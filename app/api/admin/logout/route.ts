import { NextResponse } from 'next/server';
import { ADMIN_TOKEN_COOKIE, getApiOrigin } from '@/lib/api-origin';

export async function POST() {
  try {
    await fetch(`${getApiOrigin()}/api/admin/logout`, { method: 'POST' });
  } catch {
    // Best-effort upstream logout; always clear local cookie.
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_TOKEN_COOKIE, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}
