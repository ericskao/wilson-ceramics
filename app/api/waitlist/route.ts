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

    const { error: conflictError, data: conflictData } = await supabase
      .from('reservations')
      .select('*')
      .eq('time_slot_id', timeSlotId)
      .eq('date', date)
      .eq('user_id', user.id);
    const reservationExists = conflictData?.length ?? 0 > 0;
    if (reservationExists) {
      return NextResponse.json(
        {
          message:
            'Failed to join waitlist, you already have a reservation for this time!',
        },
        { status: 409 }
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
      console.error(waitlistError);
      return NextResponse.json(
        {
          message: 'Failed to join waitlist',
        },
        {
          status: 500,
        }
      );
    } else {
      return NextResponse.json({ status: 201 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Waitlist Internal Server Error' },
      { status: 500 }
    );
  }
};

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  const supabase = createClient();
  try {
    const { waitlistId } = await req.json();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('waitlists')
      .delete()
      .eq('id', waitlistId);

    if (error) {
      console.error(error);
      return NextResponse.json(
        { message: 'Failed to remove from waitlist' },
        { status: 500 }
      );
    } else {
      return NextResponse.json({ status: 204 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: 'Remove Waitlist Internal Server Error' },
      { status: 500 }
    );
  }
};
