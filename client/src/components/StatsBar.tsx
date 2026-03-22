import { Seat } from '../types';

interface Props {
  seats: Seat[];
}

export default function StatsBar({ seats: allSeats }: Props) {
  const seats = allSeats.filter((s) => s.is_active);
  const total = seats.length;
  const available = seats.filter((s) => s.status === 'available').length;
  const occupied = seats.filter((s) => s.status === 'occupied').length;
  const reserved = seats.filter((s) => s.status === 'reserved').length;
  const cleaning = seats.filter((s) => s.status === 'cleaning').length;

  return (
    <div className="flex gap-4 text-sm">
      <span className="text-emerald-400 font-semibold">空き {available}</span>
      <span className="text-red-400 font-semibold">使用中 {occupied}</span>
      {reserved > 0 && <span className="text-amber-400 font-semibold">予約 {reserved}</span>}
      {cleaning > 0 && <span className="text-blue-400 font-semibold">清掃 {cleaning}</span>}
      <span className="text-gray-400">/ 計 {total}</span>
    </div>
  );
}
