import { NextRequest, NextResponse } from 'next/server';

const protectedPrefixes = [
  '/dashboard',
  '/users',
  '/fine-collection',
  '/wallet',
  '/ocr',
  '/badges',
  '/analytics',
  '/settings',
  '/logs',
  '/leaves',
  '/extra-leaves',
  '/session-invites',
  '/exam-subjects',
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPath = pathname === '/login';
  const isProtected = protectedPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!isLoginPath && !isProtected) {
    return NextResponse.next();
  }

  const session = request.cookies.get('consistify_admin_token')?.value;

  if (!session && isProtected) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (session && isLoginPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/dashboard/:path*',
    '/users/:path*',
    '/fine-collection/:path*',
    '/wallet/:path*',
    '/badges/:path*',
    '/ocr/:path*',
    '/analytics/:path*',
    '/settings/:path*',
    '/logs/:path*',
    '/leaves/:path*',
    '/extra-leaves/:path*',
    '/session-invites/:path*',
    '/exam-subjects/:path*',
  ],
};
