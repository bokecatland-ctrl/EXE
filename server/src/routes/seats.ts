import { FastifyInstance } from 'fastify';
import db from '../db';
import { emitSeatChanged, emitBulkUpdated } from '../socket/events';
import { PatchSeatBody, Seat, SeatStatus } from '../types';

const VALID_STATUSES: SeatStatus[] = ['available', 'occupied', 'reserved', 'cleaning'];

function getSeats(): Seat[] {
  return db.prepare(`
    SELECT s.*, z.name AS zone_name
    FROM seats s
    LEFT JOIN layout_zones z ON z.id = s.zone_id
    WHERE s.is_active = 1
    ORDER BY z.sort_order, s.label
  `).all() as Seat[];
}

function getSeat(id: number): Seat | undefined {
  return db.prepare(`
    SELECT s.*, z.name AS zone_name
    FROM seats s
    LEFT JOIN layout_zones z ON z.id = s.zone_id
    WHERE s.id = ? AND s.is_active = 1
  `).get(id) as Seat | undefined;
}

export default async function seatsRoutes(app: FastifyInstance) {
  // GET /api/seats
  app.get('/', async (_req, reply) => {
    const seats = getSeats();
    return reply.send({ seats, updatedAt: new Date().toISOString() });
  });

  // GET /api/seats/:id
  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const seat = getSeat(Number(req.params.id));
    if (!seat) return reply.status(404).send({ error: 'Seat not found' });
    return reply.send({ seat });
  });

  // PATCH /api/seats/:id
  app.patch<{ Params: { id: string }; Body: PatchSeatBody }>('/:id', async (req, reply) => {
    const id = Number(req.params.id);
    const { status, notes, changedBy } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return reply.status(400).send({ error: 'Invalid status' });
    }

    const existing = getSeat(id);
    if (!existing) return reply.status(404).send({ error: 'Seat not found' });

    const now = new Date().toISOString();
    const occupiedSince = status === 'occupied'
      ? (existing.status === 'occupied' ? existing.occupied_since : now)
      : null;

    db.prepare(`
      UPDATE seats
      SET status = ?, notes = ?, occupied_since = ?, updated_at = ?, updated_by = ?
      WHERE id = ?
    `).run(status, notes ?? null, occupiedSince, now, changedBy ?? null, id);

    db.prepare(`
      INSERT INTO seat_history (seat_id, from_status, to_status, notes, changed_by, changed_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, existing.status, status, notes ?? null, changedBy ?? null, now);

    const updated = getSeat(id)!;
    emitSeatChanged(updated);
    return reply.send({ seat: updated });
  });

  // POST /api/seats/reset-all
  app.post('/reset-all', async (req, reply) => {
    const body = req.body as { changedBy?: string } | undefined;
    const changedBy = body?.changedBy ?? null;
    const now = new Date().toISOString();

    const allSeats = getSeats();

    const updateStmt = db.prepare(`
      UPDATE seats SET status = 'available', notes = NULL, occupied_since = NULL,
      updated_at = ?, updated_by = ? WHERE id = ?
    `);
    const historyStmt = db.prepare(`
      INSERT INTO seat_history (seat_id, from_status, to_status, changed_by, changed_at)
      VALUES (?, ?, 'available', ?, ?)
    `);

    const transaction = db.transaction(() => {
      for (const seat of allSeats) {
        updateStmt.run(now, changedBy, seat.id);
        if (seat.status !== 'available') {
          historyStmt.run(seat.id, seat.status, changedBy, now);
        }
      }
    });
    transaction();

    const updatedSeats = getSeats();
    emitBulkUpdated(updatedSeats);
    return reply.send({ seats: updatedSeats });
  });

  // GET /api/seats/:id/history
  app.get<{ Params: { id: string } }>('/:id/history', async (req, reply) => {
    const id = Number(req.params.id);
    const history = db.prepare(`
      SELECT * FROM seat_history WHERE seat_id = ? ORDER BY changed_at DESC LIMIT 50
    `).all(id);
    return reply.send({ history });
  });
}
