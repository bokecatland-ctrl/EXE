import { FastifyInstance } from 'fastify';
import db from '../db';

export default async function layoutRoutes(app: FastifyInstance) {
  app.get('/', async (_req, reply) => {
    const zones = db.prepare('SELECT * FROM layout_zones ORDER BY sort_order').all();
    const seats = db.prepare(`
      SELECT s.*, z.name AS zone_name
      FROM seats s
      LEFT JOIN layout_zones z ON z.id = s.zone_id
      WHERE s.is_active = 1
      ORDER BY z.sort_order, s.label
    `).all();
    return reply.send({ zones, seats });
  });
}
