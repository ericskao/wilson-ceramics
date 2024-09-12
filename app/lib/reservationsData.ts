import { createClient } from '@/utils/supabase/server';

export type ReservationType = {
  id: number;
  guest_name: string | null;
  reserved_at: string;
  table_name: string;
  user_id: string | null;
  time_slot_id: number;
  date: string;
};

export type WaitlistType = {
  id: number;
  date: string;
  user_id: string;
  time_slot_id: number;
  raw_user_meta_data: {
    picture: string;
    full_name: string;
    name: string;
  };
};

interface FetchReservationsResponse {
  status: 'success' | 'error';
  data?: any[];
  error?: {
    message: string;
    details?: any;
  };
}

export async function fetchReservations(
  weekOffset: number = 0
): Promise<FetchReservationsResponse> {
  try {
    const today = new Date();

    // Calculate start and end dates of the week with offset
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 7 * weekOffset
    );
    const endOfWeek = new Date(
      startOfWeek.getFullYear(),
      startOfWeek.getMonth(),
      startOfWeek.getDate() + 6
    );

    // Format dates as YYYY-MM-DD
    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    const supabase = createClient();

    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error(error);
      return {
        status: 'error',
        error: {
          message: 'Supabase query error',
          details: error,
        },
      };
    } else {
      return {
        status: 'success',
        data,
      };
    }
  } catch (error) {
    console.error('fetch failed', error);
    return {
      status: 'error',
      error: {
        message: 'Unexpected error occurred',
        details: error,
      },
    };
  }
}
