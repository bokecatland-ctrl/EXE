import { FastifyInstance } from 'fastify';
import db from '../db';

export default async function statsRoutes(app: FastifyInstance) {
  app.get('/', async (_req, reply) => {
    const row = db.prepare(`
      SELECT
        COUNT(*) AS total,
        SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) AS available,
        SUM(CASE WHEN status = 'occupied'  THEN 1 ELSE 0 END) AS occupied,
        SUM(CASE WHEN status = 'reserved'  THEN 1 ELSE 0 END) AS reserved,
        SUM(CASE WHEN status = 'cleaning'  THEN 1 ELSE 0 END) AS cleaning
      FROM seats WHERE is_active = 1
    `).get() as { total: number; available: number; occupied: number; reserved: number; cleaning: number };

    const availabilityPct = row.total > 0 ? Math.round((row.available / row.total) * 100) : 0;
    return reply.send({ ...row, availabilityPct });
  });
}
