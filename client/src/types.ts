export type SeatStatus = 'available' | 'occupied' | 'reserved' | 'cleaning';

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
