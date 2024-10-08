import { weekDatesWithOffset } from '@/utils/date';
import { createClient } from '@/utils/supabase/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const weekOffset = request.nextUrl.searchParams.get('offset');

  try {
    const { startDate, endDate } = weekDatesWithOffset(weekOffset);

    const supabase = createClient();
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error(error);
      return NextResponse.json({
        status: 400,
        message: 'Failed to get reservations',
      });
    } else {
      return NextResponse.json({ data, status: 200 });
    }
  } catch (error) {
    console.error('fetch failed', error);
    return NextResponse.json({ status: 500, message: `${error}` });
  }
}
