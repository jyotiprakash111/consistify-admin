/** Paths that must not trigger a session-expired redirect on 401 */
const AUTH_API_PATHS = new Set(['/login', '/logout']);

let sessionRedirectInFlight = false;

function isLoginPage(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/login';
}

/**
 * Clear the httpOnly session cookie and send the admin back to login.
 * Safe to call from multiple concurrent API failures (deduped).
 */
export async function handleSessionExpired(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (isLoginPage() || sessionRedirectInFlight) return;

  sessionRedirectInFlight = true;

  try {
    await fetch('/api/admin/logout', {
      method: 'POST',
      credentials: 'include',
    });
  } catch {
    // Still redirect even if logout fails.
  }

  const returnPath =
    window.location.pathname + window.location.search + window.location.hash;
  const loginUrl = new URL('/login', window.location.origin);

  if (returnPath && returnPath !== '/login') {
    loginUrl.searchParams.set('from', returnPath);
  }
  loginUrl.searchParams.set('expired', '1');

  window.location.assign(loginUrl.toString());
}

export function isAuthApiPath(path: string): boolean {
  const normalized = path.split('?')[0] ?? path;
  return AUTH_API_PATHS.has(normalized);
}
