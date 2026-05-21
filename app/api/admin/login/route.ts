import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_TOKEN_COOKIE,
  ADMIN_TOKEN_MAX_AGE,
  getApiOrigin,
} from '@/lib/api-origin';

/**
 * Login on the Vercel/Next host and set the session cookie here.
 * Rewrites to Railway do not reliably forward Set-Cookie to the browser.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Invalid request body' },
      { status: 400 },
    );
  }

  const upstream = await fetch(`${getApiOrigin()}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const text = await upstream.text();
  let payload: { success?: boolean; token?: string; message?: string; error?: string } =
    {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = {};
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        success: false,
        message: payload.message ?? payload.error ?? 'Invalid email or password',
      },
      { status: upstream.status },
    );
  }

  const token = payload.token;
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'Login succeeded but no token returned' },
      { status: 502 },
    );
  }

  const response = NextResponse.json({ success: true, token });
  const secure =
    process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);

  response.cookies.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure,
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_TOKEN_MAX_AGE,
  });

  return response;
}
