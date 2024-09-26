import { weekDatesWithOffset } from '@/utils/date';
import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const weekOffset = request.nextUrl.searchParams.get('offset');

  try {
    const { startDate, endDate } = weekDatesWithOffset(weekOffset);

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
