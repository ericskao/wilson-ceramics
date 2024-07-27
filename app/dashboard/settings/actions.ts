'use server';

export async function verifyOtp(code: string) {
  console.log('code from client', code);
  if (code === '1125') {
    return { status: 200, message: 'Member verified successfully' };
  } else {
    return {
      status: 400,
      message: 'Invalid code',
    };
  }
}
