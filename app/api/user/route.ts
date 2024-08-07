import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: 'User not authenticated' },
      { status: 401 }
    );
  }

  // if i want to retrieve a user from supabase table in the future
  // const { data, error } = await supabase
  //   .from('users')
  //   .select('*')
  //   .eq('id', user.id)
  //   .single();

  // if (error) {
  //   return NextResponse.json({ error: error.message }, { status: 500 });
  // }

  return NextResponse.json(user, { status: 200 });
}
