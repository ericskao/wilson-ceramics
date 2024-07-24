export const runtime = 'experimental-edge';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  console.log('authsecret', process.env.AUTH_SECRET);
  console.log('Middleware called for path:', req.nextUrl.pathname);
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  console.log('NODE_ENV:', process.env.NODE_ENV);
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || '',
    salt: 'authjs.session-token',
  });
  try {
    const token = await getToken({
      req,
      salt: 'authjs.session-token',
      secret: process.env.AUTH_SECRET || '',
    });

    console.log('Token retrieved:', token ? 'Yes' : 'No');
    if (token) {
      console.log('Token content:', JSON.stringify(token, null, 2));
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
  }
  console.log('token', token);
  const { pathname } = req.nextUrl;

  // Check if the user is trying to access the /dashboard route
  if (pathname.startsWith('/dashboard')) {
    console.log('in dashboard', req);
    // If there is no token, redirect to /login
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith('/login') && token) {
    const dashboardUrl = new URL('/dashboard', req.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If the token exists or the route is not protected, continue
  return NextResponse.next();
}

// Specify which paths this middleware should apply to
export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
