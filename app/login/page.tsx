import Heading from '@/components/ui/heading';
import { Chrome } from 'lucide-react';
import { Button } from '../ui/button';
import { google, otp } from './actions';

export default function LoginPage() {
  return (
    <main className="min-h-svh flex">
      <div className="flex flex-col items-center justify-center p-4 mx-auto max-w-md w-full">
        <Heading>Sign in with a magic link</Heading>
        <p className="mt-2 mb-4 text-muted-foreground">
          Enter your email to receive a sign-in link
        </p>
        <form className="flex flex-col w-full gap-4">
          <input
            className="ring-offset-background border-input border placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-10 px-3 py-2 rounded-md"
            placeholder="name@example.com"
            id="otp-email"
            name="email"
            type="email"
            required
          />
          <Button formAction={otp}>Send email link</Button>
        </form>
        <div className="relative w-full my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground uppercase">
              Or sign in with
            </span>
          </div>
        </div>
        <div>
          <form>
            <Button
              formAction={google}
              variant="tertiary"
              className="flex gap-x-1"
            >
              <Chrome className="h-4 w-4" />
              Google
            </Button>
          </form>
        </div>
      </div>
    </main>
    // <form>
    //     <label htmlFor="email">Email:</label>
    //     <input className="text-black" id="email" name="email" type="email" />
    //     <label htmlFor="password">Password:</label>
    //     <input
    //       className="text-black"
    //       id="password"
    //       name="password"
    //       type="password"
    //     />
    //     <button formAction={login}>Log in</button>
    //     <button formAction={signup}>Sign up</button>
    //   </form>
    //   <form>
    //     <button formAction={google}>Google signin</button>
    //   </form>
  );
}
