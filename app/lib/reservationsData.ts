import { createClient } from '@/utils/supabase/server';

export type ReservationType = {
  id: number;
  guest_name: string | null;
  reserved_at: string;
  table_name: string;
  user_id: number | null;
  time_slot_id: number;
};

export async function fetchReservations() {
  const supabase = createClient();
  const { data, error } = await supabase.from('reservations').select('*');
  try {
    if (error) {
      console.error(error);
      return [];
    } else {
      return data;
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}
