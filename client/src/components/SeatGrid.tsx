import { Seat } from '../types';
import SeatTile from './SeatTile';

interface Props {
  seats: Seat[];
  interactive?: boolean;
  onSeatClick?: (seat: Seat) => void;
}

function groupByZone(seats: Seat[]) {
  const zones: Map<string, Seat[]> = new Map();
  for (const seat of seats) {
    const key = seat.zone_name ?? '未分類';
    if (!zones.has(key)) zones.set(key, []);
    zones.get(key)!.push(seat);
  }
  return zones;
}

export default function SeatGrid({ seats, interactive, onSeatClick }: Props) {
  const zones = groupByZone(seats);

  return (
    <div className="space-y-6 p-4">
      {[...zones.entries()].map(([zone, zoneSeats]) => (
        <div key={zone}>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">
            {zone}
          </h2>
          <div className="flex flex-wrap gap-3">
            {zoneSeats.map((seat) => (
              <SeatTile
                key={seat.id}
                seat={seat}
                interactive={interactive}
                onClick={onSeatClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
