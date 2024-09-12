import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

const getErrorMessage = (error: any): { message: string; status: number } => {
  if (error?.code === '23505') {
    return {
      message: 'You already have a reservation at this date and time!',
      status: 409, // Conflict
    };
  }
  // Default error message
  return {
    message: 'An unexpected reservation error occurred',
    status: 500, // Internal Server Error
  };
};

export const PUT = async (req: NextRequest, res: NextResponse) => {
  const supabase = createClient();
  try {
    const { reservationId, status, guestName } = await req.json();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }
    const isAdmin = user.role === 'service_role';

    if (status === 'canceled') {
      let query = supabase
        .from('reservations')
        .update({
          user_id: null,
          guest_name: null,
        })
        .eq('id', reservationId);

      if (!isAdmin) {
        query = query.eq('user_id', user.id);
      }

      const { data: reservation, error } = await query.select('*').single();

      if (error) {
        console.error('Error canceling reservation', error);
        return NextResponse.json(
          { message: 'Error canceling reservation' },
          { status: 500 }
        );
      }
      return NextResponse.json({ status: 201, data: reservation });
    }

    if (isAdmin && guestName) {
      const { error: guestError, data } = await supabase
        .from('reservations')
        .update({
          guest_name: guestName,
        })
        .eq('id', reservationId);
      if (guestError) {
        console.error('Error adding guest to reservation', guestError);
        return NextResponse.json(
          { message: 'Could not add guest to reservation' },
          { status: 500 }
        );
      } else {
        return NextResponse.json({ status: 200, data });
      }
    } else {
      const { error: updateError, data } = await supabase
        .from('reservations')
        .update({
          user_id: user.id,
          guest_name:
            user?.user_metadata?.display_name || user?.user_metadata?.full_name,
        })
        .eq('id', reservationId);

      if (updateError) {
        console.error('Error updating reservation', updateError);
        const { message, status } = getErrorMessage(updateError);
        return NextResponse.json({ message }, { status });
      }
      return NextResponse.json({ status: 200, data });
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    const { message } = getErrorMessage(error);
    return NextResponse.json({ message }, { status: 500 });
  }
};
