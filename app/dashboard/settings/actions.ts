'use server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createClientServiceRole } from '@supabase/supabase-js';

export async function verifyOtp(code: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (code === process.env.NEXT_PUBLIC_MEMBER_CODE) {
    try {
      const supabaseAdmin = createClientServiceRole(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '',
        { auth: { persistSession: false } }
      );

      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        user?.id || '',
        {
          role: 'dashboard_member',
        }
      );
      if (error) {
        throw error;
      }
      return { status: 200, message: 'Member verified successfully' };
    } catch (error) {
      console.error('ERROR VERIFING MEMBER as dashboard_member: ', error);
    }
  } else if (code === process.env.NEXT_PUBLIC_ADMIN_CODE) {
    try {
      const supabaseAdmin = createClientServiceRole(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || '',
        { auth: { persistSession: false } }
      );
      const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
        user?.id || '',
        {
          role: 'service_role',
        }
      );
      if (error) {
        throw error;
      }
      return { status: 200, message: 'Admin verified successfully' };
    } catch (error) {
      console.error('ERROR VERIFING MEMBER: ', error);
    }
  }
  return {
    status: 400,
    message: 'Invalid code',
  };
}
