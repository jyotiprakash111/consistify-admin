/** Backend origin for admin API (no trailing slash). */
export function getApiOrigin(): string {
  return (
    process.env.API_ORIGIN ??
    process.env.NEXT_PUBLIC_API_URL ??
    'https://persistify-production.up.railway.app'
  );
}

export const ADMIN_TOKEN_COOKIE = 'consistify_admin_token';
export const ADMIN_TOKEN_MAX_AGE = 86400;
