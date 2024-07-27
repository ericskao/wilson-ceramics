'use client';

import { verifyOtp } from '@/app/dashboard/settings/actions';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useEffect, useState } from 'react';

const AuthCode = () => {
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    if (code.length === 4) {
      const handleSubmit = async () => {
        try {
          const response = await verifyOtp(code);
          setCode('');
          console.log('response is', response);
        } catch (error) {
          console.log(error);
        }
      };
      handleSubmit();
    }
  }, [code]);

  return (
    <form name="auth-code">
      <label>Enter Member Code here</label>
      <InputOTP required value={code} onChange={setCode} maxLength={4}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    </form>
  );
};

export default AuthCode;
