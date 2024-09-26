import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export const PUT = async (req: NextRequest, res: NextResponse) => {
  const supabase = createClient();
  const request = await req.json();

  try {
    const { link, note, date } = request;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    // check to see if day detail exists
    const { data, error } = await supabase
      .from('day_details')
      .select('*')
      .eq('date', date);

    if (error) {
      throw Error('Error checking if day detail exists');
    }
    // if not, create new one
    if (!data?.length) {
      const { data: newDetails, error: createError } = await supabase
        .from('day_details')
        .insert({ date: date, link: link, note: note });

      if (createError) {
        throw Error('Failed to save details');
      }
    } else {
      // already exists, update it
      const { data: updatedData, error: updateError } = await supabase
        .from('day_details')
        .update({ link, note })
        .eq('id', data[0].id);

      if (updateError) {
        throw Error('Error updating details!');
      }
    }
    return NextResponse.json({ status: 201 });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Add Day Details Internal Server Error',
      },
      { status: 500 }
    );
  }
};
