import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import path from 'path';
import fs from 'fs';
import seatsRoutes from './routes/seats';
import layoutRoutes from './routes/layout';
import statsRoutes from './routes/stats';
import { initSocket } from './socket/events';

const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = Fastify({ logger: { level: 'info' } });
const httpServer = createServer(app.server);

const io = new SocketServer(httpServer, {
  cors: { origin: '*' },
});
initSocket(io);

app.register(fastifyCors, { origin: '*' });

// Serve built client from server/public
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  app.register(fastifyStatic, {
    root: publicDir,
    prefix: '/',
    decorateReply: false,
  });

  // SPA fallback
  app.setNotFoundHandler((_req, reply) => {
    reply.sendFile('index.html');
  });
}

app.register(seatsRoutes, { prefix: '/api/seats' });
app.register(layoutRoutes, { prefix: '/api/layout' });
app.register(statsRoutes, { prefix: '/api/stats' });

// Start — use raw httpServer so Socket.IO shares the port
httpServer.listen(PORT, HOST, () => {
  console.log(`EXE Lounge server running on http://${HOST}:${PORT}`);
});
