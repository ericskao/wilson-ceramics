import { weekDatesWithOffset } from '@/utils/date';
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const weekOffset = request.nextUrl.searchParams.get('offset');

  const { startDate, endDate } = weekDatesWithOffset(weekOffset);

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('day_details')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error(error);
      return NextResponse.json({
        status: 400,
        message: 'Failed to get details for the day',
      });
    } else {
      return NextResponse.json({ data, status: 200 });
    }
  } catch (error) {
    console.error('fetch failed', error);
    return NextResponse.json({ status: 500, message: `${error}` });
  }
}
