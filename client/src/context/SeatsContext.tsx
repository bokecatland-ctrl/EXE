import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { Seat } from '../types';
import { fetchSeats } from '../api/http';
import { getSocket } from '../api/socket';

type Action =
  | { type: 'SYNC_ALL'; seats: Seat[] }
  | { type: 'UPDATE_SEAT'; patch: Partial<Seat> & { id: number } }
  | { type: 'BULK_UPDATED'; seats: Seat[] };

function reducer(state: Seat[], action: Action): Seat[] {
  switch (action.type) {
    case 'SYNC_ALL':
      return action.seats;
    case 'UPDATE_SEAT':
      return state.map((s) => (s.id === action.patch.id ? { ...s, ...action.patch } : s));
    case 'BULK_UPDATED':
      return action.seats;
    default:
      return state;
  }
}

interface SeatsContextValue {
  seats: Seat[];
  connected: boolean;
  dispatch: React.Dispatch<Action>;
}

const SeatsContext = createContext<SeatsContextValue | null>(null);

export function SeatsProvider({ children }: { children: React.ReactNode }) {
  const [seats, dispatch] = useReducer(reducer, []);
  const [connected, setConnected] = React.useState(false);

  useEffect(() => {
    fetchSeats().then((s) => dispatch({ type: 'SYNC_ALL', seats: s }));

    const socket = getSocket();

    socket.on('connect', () => {
      setConnected(true);
      // Resync on reconnect to catch any missed events
      fetchSeats().then((s) => dispatch({ type: 'SYNC_ALL', seats: s }));
    });
    socket.on('disconnect', () => setConnected(false));

    socket.on('seat:status_changed', (payload: {
      seatId: number; label: string; status: Seat['status'];
      notes: string | null; changedBy: string | null;
      changedAt: string; occupiedSince: string | null;
    }) => {
      dispatch({
        type: 'UPDATE_SEAT',
        patch: {
          id: payload.seatId,
          label: payload.label,
          status: payload.status,
          notes: payload.notes,
          occupied_since: payload.occupiedSince,
          updated_at: payload.changedAt,
          updated_by: payload.changedBy,
        },
      });
    });

    socket.on('seat:bulk_updated', (data: { seats: Seat[] }) => {
      dispatch({ type: 'BULK_UPDATED', seats: data.seats });
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('seat:status_changed');
      socket.off('seat:bulk_updated');
    };
  }, []);

  return (
    <SeatsContext.Provider value={{ seats, connected, dispatch }}>
      {children}
    </SeatsContext.Provider>
  );
}

export function useSeatsContext() {
  const ctx = useContext(SeatsContext);
  if (!ctx) throw new Error('useSeatsContext must be used within SeatsProvider');
  return ctx;
}
