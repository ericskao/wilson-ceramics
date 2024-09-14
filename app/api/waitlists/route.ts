import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const weekOffset = request.nextUrl.searchParams.get('offset');

  try {
    const today = new Date();
    const startOfWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - today.getDay() + 7 * Number(weekOffset)
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
      .from('waitlists')
      .select(
        `
          id,
          date,
          time_slot_id,
          profiles(email, full_name, picture, id)
        `
      )
      .gte('date', startDate)
      .lte('date', endDate)
      .order('created_at', { ascending: true });

    if (error) {
      console.error(error);
      return NextResponse.json({ status: 400, message: `${error}` });
    } else {
      const transformedData = data.map((item) => {
        const { profiles, ...rest } = item;
        return {
          ...rest,
          user: profiles,
        };
      });
      return NextResponse.json({ data: transformedData, status: 200 });
    }
  } catch (error) {
    console.error('fetch failed', error);
    return NextResponse.json({ status: 500, message: `${error}` });
  }
}
