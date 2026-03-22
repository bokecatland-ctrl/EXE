import { Seat } from '../types';
import { useElapsedMinutes } from '../hooks/useElapsedMinutes';

const STATUS_STYLES: Record<Seat['status'], string> = {
  available: 'bg-emerald-500 hover:bg-emerald-400 text-white',
  occupied:  'bg-red-500 hover:bg-red-400 text-white',
  reserved:  'bg-amber-400 hover:bg-amber-300 text-gray-900',
  cleaning:  'bg-blue-400 hover:bg-blue-300 text-white',
};

const STATUS_LABEL: Record<Seat['status'], string> = {
  available: '空き',
  occupied:  '使用中',
  reserved:  '予約',
  cleaning:  '清掃中',
};

function elapsedColor(minutes: number): string {
  if (minutes >= 180) return 'text-orange-300 font-bold';
  if (minutes >= 120) return 'text-yellow-200 font-semibold';
  return 'text-white/80';
}

function formatElapsed(minutes: number): string {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}時間${m}分` : `${h}時間`;
  }
  return `${minutes}分`;
}

interface Props {
  seat: Seat;
  interactive?: boolean;
  onClick?: (seat: Seat) => void;
}

export default function SeatTile({ seat, interactive = false, onClick }: Props) {
  const elapsed = useElapsedMinutes(seat.status === 'occupied' ? seat.occupied_since : null);

  return (
    <button
      className={`
        flex flex-col items-center justify-center rounded-xl
        w-20 h-20 md:w-24 md:h-24 select-none transition-colors duration-150
        ${STATUS_STYLES[seat.status]}
        ${interactive ? 'cursor-pointer active:scale-95' : 'cursor-default'}
      `}
      onClick={() => interactive && onClick?.(seat)}
      disabled={!interactive}
    >
      <span className="font-bold text-base leading-tight">{seat.label}</span>
      <span className="text-xs mt-0.5 opacity-90">{STATUS_LABEL[seat.status]}</span>
      {seat.status === 'occupied' && elapsed !== null && (
        <span className={`text-xs mt-0.5 ${elapsedColor(elapsed)}`}>
          {formatElapsed(elapsed)}
        </span>
      )}
    </button>
  );
}
