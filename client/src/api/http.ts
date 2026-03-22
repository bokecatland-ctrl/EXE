import { Seat, SeatStatus } from '../types';

export async function fetchSeats(): Promise<Seat[]> {
  const res = await fetch('/api/seats');
  const data = await res.json();
  return data.seats;
}

export async function patchSeat(
  id: number,
  status: SeatStatus,
  opts?: { notes?: string; changedBy?: string }
): Promise<Seat> {
  const res = await fetch(`/api/seats/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, ...opts }),
  });
  const data = await res.json();
  return data.seat;
}

export async function resetAllSeats(changedBy?: string): Promise<Seat[]> {
  const res = await fetch('/api/seats/reset-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ changedBy }),
  });
  const data = await res.json();
  return data.seats;
}

export async function fetchStats() {
  const res = await fetch('/api/stats');
  return res.json();
}
