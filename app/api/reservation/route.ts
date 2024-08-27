import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = async (req: NextRequest, res: NextResponse) => {
  const supabase = createClient();
  try {
    const { reservationId, status } = await req.json();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // TODO need to handle admin input cases - if role is admin and inputText is passed along, use that info

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    if (status === 'canceled') {
      // find reservation and make sure it belongs to user
      // TODO handle admin cancelation (won't have user_id)
      const { data: reservation, error } = await supabase
        .from('reservations')
        .update({
          user_id: null,
          guest_name: null,
        })
        .eq('id', reservationId)
        .eq('user_id', user.id)
        .select('*')
        .single();

      if (!error) {
        return NextResponse.json({ status: 201, data: reservation });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
        { error: duplicateError.message },
        { status: 500 }
      );
    } else if (duplicates.length > 0) {
      return NextResponse.json(
        { error: 'You already have a reservation at this time!' },
        { status: 400 }
      );
    }

    // TODO need to add reserved_at
    const { error: updateError, data } = await supabase
      .from('reservations')
      .update({
        user_id: user.id,
        guest_name:
          user?.user_metadata?.display_name || user?.user_metadata?.full_name,
      })
      .eq('id', reservationId);
    // to-do return reservation success here to show in toast

    if (!updateError) {
      return NextResponse.json({ status: 200, data });
    } else {
      throw Error('Could not update reservation');
    }
  } catch (error) {
    console.error('Error parsing request body:', error);
    throw Error('Server Error');
  }
};
