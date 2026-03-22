import { useState } from 'react';
import { useSeatsContext } from '../context/SeatsContext';
import { Seat, SeatStatus } from '../types';
import SeatGrid from '../components/SeatGrid';
import StatusModal from '../components/StatusModal';
import StatsBar from '../components/StatsBar';
import ConnectionDot from '../components/ConnectionDot';
import { patchSeat, resetAllSeats } from '../api/http';

export default function FloorView() {
  const { seats, connected, dispatch } = useSeatsContext();
  const [selected, setSelected] = useState<Seat | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  async function handleConfirm(status: SeatStatus, notes: string) {
    if (!selected) return;
    const updated = await patchSeat(selected.id, status, { notes });
    dispatch({ type: 'UPDATE_SEAT', seat: updated });
    setSelected(null);
  }

  async function handleResetAll() {
    const updated = await resetAllSeats();
    dispatch({ type: 'BULK_UPDATED', seats: updated });
    setShowResetConfirm(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold">EXE フロア</h1>
          <StatsBar seats={seats} />
        </div>
        <div className="flex items-center gap-3">
          <ConnectionDot connected={connected} />
          <button
            className="px-3 py-1.5 text-sm rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            onClick={() => setShowResetConfirm(true)}
          >
            全席リセット
          </button>
        </div>
      </header>

      {/* Seat grid */}
      <main className="flex-1 overflow-y-auto">
        <SeatGrid
          seats={seats}
          interactive
          onSeatClick={(seat) => setSelected(seat)}
        />
      </main>

      {/* Seat status modal */}
      {selected && (
        <StatusModal
          seat={selected}
          onConfirm={handleConfirm}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Reset confirmation dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-sm w-full space-y-5 border border-gray-700">
            <h2 className="text-white text-lg font-bold text-center">全席リセット</h2>
            <p className="text-gray-300 text-center text-sm">
              全ての席を「空き」にします。<br />この操作は元に戻せません。
            </p>
            <div className="flex gap-3">
              <button
                className="flex-1 py-3 rounded-xl bg-gray-700 text-white font-semibold"
                onClick={() => setShowResetConfirm(false)}
              >
                キャンセル
              </button>
              <button
                className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold"
                onClick={handleResetAll}
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
