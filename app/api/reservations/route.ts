import { NextApiRequest, NextApiResponse } from 'next';

import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createClient();
  const { data, error } = await supabase.from('reservations').select('*');

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    console.log('data', data, 'res', res);
    return NextResponse.json(data, { status: 200 });
  }
};

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createClient();
};

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const supabase = createClient();
//   console.log('in handler', req);
//   if (req.method === 'POST') {
//     console.log('making post request');
//     // const { user_id, guest_name, time_slot_id } = req.body;

//     // const { data, error } = await supabase
//     //   .from('reservations')
//     //   .insert([{ user_id, guest_name, time_slot_id }]);

//     // if (error) {
//     //   res.status(400).json({ error: error.message });
//     // } else {
//     //   res.status(200).json(data);
//     // }
//   } else if (req.method === 'GET') {
//     console.log('get request');
//     const { data, error } = await supabase.from('reservations').select('*');
//     console.log('data', data);
//     if (error) {
//       res.status(400).json({ error: error.message });
//     } else {
//       res.status(200).json(data);
//     }
//   } else {
//     res.setHeader('Allow', ['POST', 'GET']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }
