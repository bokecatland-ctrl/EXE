import { Server as SocketServer } from 'socket.io';
import { Seat } from '../types';

let io: SocketServer | null = null;

export function initSocket(socketServer: SocketServer) {
  io = socketServer;

  io.on('connection', (socket) => {
    socket.on('client:identify', (data: { role: string; deviceName?: string }) => {
      socket.data.role = data.role;
      socket.data.deviceName = data.deviceName;
    });
  });
}

export function emitSeatChanged(seat: Seat) {
  if (!io) return;
  io.emit('seat:status_changed', {
    seatId: seat.id,
    label: seat.label,
    status: seat.status,
    notes: seat.notes,
    changedBy: seat.updated_by,
    changedAt: seat.updated_at,
    occupiedSince: seat.occupied_since,
  });
}

export function emitBulkUpdated(seats: Seat[]) {
  if (!io) return;
  io.emit('seat:bulk_updated', { seats });
}
