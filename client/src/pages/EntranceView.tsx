import { useMemo } from 'react';
import { useSeatsContext } from '../context/SeatsContext';
import { Seat } from '../types';
import ConnectionDot from '../components/ConnectionDot';
import { useElapsedMinutes } from '../hooks/useElapsedMinutes';

function ZoneBar({ seats }: { seats: Seat[] }) {
  const total = seats.length;
  const available = seats.filter((s) => s.status === 'available').length;
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {seats.map((s) => (
          <span
            key={s.id}
            className={`inline-block w-4 h-4 rounded-sm ${
              s.status === 'available' ? 'bg-emerald-500' :
              s.status === 'occupied'  ? 'bg-red-500' :
              s.status === 'reserved'  ? 'bg-amber-400' : 'bg-blue-400'
            }`}
            title={s.label}
          />
        ))}
      </div>
      <span className="text-gray-400 text-sm">{available} / {total}</span>
    </div>
  );
}

function OccupiedSeatRow({ seat }: { seat: Seat }) {
  const elapsed = useElapsedMinutes(seat.occupied_since);
  const elapsedText = elapsed !== null ? (
    elapsed >= 60
      ? `${Math.floor(elapsed / 60)}時間${elapsed % 60 > 0 ? elapsed % 60 + '分' : ''}`
      : `${elapsed}分`
  ) : null;

  const warnColor = elapsed !== null && elapsed >= 180
    ? 'text-orange-400'
    : elapsed !== null && elapsed >= 120
    ? 'text-yellow-400'
    : 'text-gray-400';

  return (
    <span className="inline-flex items-center gap-1 text-sm bg-gray-800 rounded px-2 py-1">
      <span className="text-white">{seat.label}</span>
      {elapsedText && <span className={warnColor}>{elapsedText}</span>}
    </span>
  );
}

export default function EntranceView() {
  const { seats, connected } = useSeatsContext();

  const stats = useMemo(() => {
    const total = seats.length;
    const available = seats.filter((s) => s.status === 'available').length;
    const occupied = seats.filter((s) => s.status === 'occupied').length;
    const reserved = seats.filter((s) => s.status === 'reserved').length;
    const cleaning = seats.filter((s) => s.status === 'cleaning').length;
    const pct = total > 0 ? Math.round((available / total) * 100) : 0;
    return { total, available, occupied, reserved, cleaning, pct };
  }, [seats]);

  const zones = useMemo(() => {
    const map = new Map<string, Seat[]>();
    for (const s of seats) {
      const key = s.zone_name ?? '未分類';
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  }, [seats]);

  const occupiedSeats = seats.filter((s) => s.status === 'occupied');
  const lowStock = stats.available <= 2 && stats.total > 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-800">
        <h1 className="text-2xl font-bold tracking-wide">EXE Lounge</h1>
        <ConnectionDot connected={connected} />
      </header>

      <main className="flex-1 p-6 space-y-8 max-w-4xl mx-auto w-full">
        {/* Low stock alert */}
        {lowStock && (
          <div className="bg-red-900/60 border border-red-500 rounded-xl px-6 py-4 text-center">
            <p className="text-red-300 text-lg font-bold">
              残り空き席: {stats.available}席 — まもなく満席です
            </p>
          </div>
        )}

        {/* Big summary numbers */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="bg-emerald-900/50 border border-emerald-700 rounded-2xl p-5 text-center">
            <div className="text-5xl font-extrabold text-emerald-400">{stats.available}</div>
            <div className="text-emerald-300 mt-1 font-semibold">空き席</div>
          </div>
          <div className="bg-red-900/40 border border-red-800 rounded-2xl p-5 text-center">
            <div className="text-5xl font-extrabold text-red-400">{stats.occupied}</div>
            <div className="text-red-300 mt-1 font-semibold">使用中</div>
          </div>
          {stats.reserved > 0 && (
            <div className="bg-amber-900/40 border border-amber-700 rounded-2xl p-5 text-center">
              <div className="text-5xl font-extrabold text-amber-400">{stats.reserved}</div>
              <div className="text-amber-300 mt-1 font-semibold">予約済</div>
            </div>
          )}
          {stats.cleaning > 0 && (
            <div className="bg-blue-900/40 border border-blue-700 rounded-2xl p-5 text-center">
              <div className="text-5xl font-extrabold text-blue-400">{stats.cleaning}</div>
              <div className="text-blue-300 mt-1 font-semibold">清掃中</div>
            </div>
          )}
        </div>

        {/* Availability pct */}
        <div className="bg-gray-900 rounded-xl px-6 py-3 flex items-center gap-4">
          <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
            <div
              className="h-4 bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${stats.pct}%` }}
            />
          </div>
          <span className="text-gray-300 text-sm w-16 text-right">{stats.pct}% 空き</span>
        </div>

        {/* Zone breakdown */}
        <div className="space-y-4">
          <h2 className="text-gray-400 text-sm uppercase tracking-widest font-semibold">
            エリア別
          </h2>
          {[...zones.entries()].map(([zone, zoneSeats]) => {
            const avail = zoneSeats.filter((s) => s.status === 'available').length;
            return (
              <div key={zone} className="bg-gray-900 rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <span className="text-white font-semibold text-base">{zone}</span>
                  <span className={`ml-3 text-sm font-bold ${avail === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {avail === 0 ? '満席' : `${avail}席 空き`}
                  </span>
                </div>
                <ZoneBar seats={zoneSeats} />
              </div>
            );
          })}
        </div>

        {/* Currently occupied with elapsed time */}
        {occupiedSeats.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-gray-400 text-sm uppercase tracking-widest font-semibold">
              在席中
            </h2>
            <div className="flex flex-wrap gap-2">
              {occupiedSeats.map((s) => (
                <OccupiedSeatRow key={s.id} seat={s} />
              ))}
            </div>
            <p className="text-gray-600 text-xs">
              黄色: 2時間以上 / オレンジ: 3時間以上
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
