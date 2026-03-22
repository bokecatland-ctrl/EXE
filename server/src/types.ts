export type SeatStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

export interface Zone {
  id: number;
  name: string;
  sort_order: number;
}

export interface Seat {
  id: number;
  zone_id: number | null;
  zone_name: string | null;
  label: string;
  capacity: number;
  status: SeatStatus;
  notes: string | null;
  occupied_since: string | null;
  position_x: number | null;
  position_y: number | null;
  is_active: number;
  updated_at: string;
  updated_by: string | null;
}

export interface SeatHistoryRow {
  id: number;
  seat_id: number;
  from_status: string | null;
  to_status: string;
  notes: string | null;
  changed_by: string | null;
  changed_at: string;
}

export interface PatchSeatBody {
  status: SeatStatus;
  notes?: string;
  changedBy?: string;
}
