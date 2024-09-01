import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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

      if (!error) {
        return NextResponse.json({ status: 201, data: reservation });
      }
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    if (isAdmin && guestName) {
      const { error: guestError, data } = await supabase
        .from('reservations')
        .update({
          guest_name: guestName,
        })
        .eq('id', reservationId);
      if (guestError) {
        throw Error('Could not update reservation');
      } else {
        return NextResponse.json({ status: 200, data });
      }
    } else {
      // Call the custom SQL function to check for duplicate reservations
      const { data: duplicates, error: duplicateError } = await supabase.rpc(
        'check_duplicate_reservations',
        {
          reservation_id: reservationId,
          user_id: user.id,
        }
      );

      if (duplicateError) {
        return NextResponse.json(
          { message: duplicateError.message },
          { status: 500 }
        );
      } else if (duplicates.length > 0) {
        return NextResponse.json(
          { message: 'You already have a reservation at this time!' },
          { status: 400 }
        );
      }

      const { error: updateError, data } = await supabase
        .from('reservations')
        .update({
          user_id: user.id,
          guest_name:
            user?.user_metadata?.display_name || user?.user_metadata?.full_name,
        })
        .eq('id', reservationId);
      if (!updateError) {
        return NextResponse.json({ status: 200, data });
      } else {
        throw Error('Could not update reservation');
      }
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
    throw Error('Server Error');
  }
};
