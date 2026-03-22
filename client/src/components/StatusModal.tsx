import { useState } from 'react';
import { Seat, SeatStatus } from '../types';

const STATUSES: { status: SeatStatus; label: string; emoji: string; style: string }[] = [
  { status: 'available', label: '空き',   emoji: '🟢', style: 'bg-emerald-500 hover:bg-emerald-400 text-white' },
  { status: 'occupied',  label: '使用中', emoji: '🔴', style: 'bg-red-500 hover:bg-red-400 text-white' },
  { status: 'cleaning',  label: '清掃中', emoji: '🔵', style: 'bg-blue-400 hover:bg-blue-300 text-white' },
  { status: 'reserved',  label: '予約',   emoji: '🟡', style: 'bg-amber-400 hover:bg-amber-300 text-gray-900' },
];

const STATUS_LABEL: Record<SeatStatus, string> = {
  available: '空き',
  occupied:  '使用中',
  reserved:  '予約',
  cleaning:  '清掃中',
};

interface Props {
  seat: Seat;
  onConfirm: (status: SeatStatus, notes: string) => void;
  onClose: () => void;
}

export default function StatusModal({ seat, onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState<SeatStatus>(seat.status);
  const [notes, setNotes] = useState(seat.notes ?? '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 rounded-t-2xl w-full max-w-lg p-6 pb-10 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-white text-xl font-bold">席 {seat.label}</h2>
          <span className="text-gray-400 text-sm">現在: {STATUS_LABEL[seat.status]}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {STATUSES.map(({ status, label, emoji, style }) => (
            <button
              key={status}
              className={`
                h-20 rounded-xl text-lg font-semibold flex flex-col items-center justify-center gap-1
                transition-all ${style}
                ${selected === status ? 'ring-4 ring-white scale-105' : 'opacity-80'}
              `}
              onClick={() => setSelected(status)}
            >
              <span className="text-2xl">{emoji}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>

        <input
          className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="メモ（任意）"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            className="flex-1 py-4 rounded-xl bg-gray-700 text-white text-base font-semibold"
            onClick={onClose}
          >
            キャンセル
          </button>
          <button
            className="flex-1 py-4 rounded-xl bg-white text-gray-900 text-base font-bold"
            onClick={() => onConfirm(selected, notes)}
          >
            確定
          </button>
        </div>
      </div>
    </div>
  );
}
