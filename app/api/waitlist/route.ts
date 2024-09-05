import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const POST = async (req: NextRequest, res: NextResponse) => {
  const supabase = createClient();
  try {
    const { timeSlotId, date } = await req.json();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { error: waitlistError, data } = await supabase
      .from('waitlists')
      .insert({
        time_slot_id: timeSlotId,
        date,
        user_id: user.id,
      });

    if (waitlistError) {
      throw Error(waitlistError.message);
    } else {
      return NextResponse.json({ status: 201 });
    }
  } catch (error) {
    console.error(error);
    throw Error('Server Error');
  }
};

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  const supabase = createClient();
  try {
    const { waitlistId } = await req.json();
    console.log('waitlistid--------', waitlistId);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { error, data } = await supabase
      .from('waitlists')
      .delete()
      .eq('id', waitlistId);

    console.log('ERRROR', error, 'DATTAAAA-------', data);

    if (error) {
      throw Error(error.message);
    } else {
      return NextResponse.json({ status: 204 });
    }
  } catch (error) {
    console.error(error);
    throw Error('Server Error');
  }
};
