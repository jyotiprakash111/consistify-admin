/** Sidebar routes aligned with `server/src/routes/admin.ts` */
export type AdminNavItem = {
  href: string;
  label: string;
  api: string;
};

export const adminNavItems: AdminNavItem[] = [
  { href: '/dashboard', label: 'Dashboard', api: 'GET /dashboard' },
  { href: '/users', label: 'Users', api: 'GET /users' },
  { href: '/users/feature-overrides', label: 'Feature overrides', api: 'GET /users/feature-overrides' },
  { href: '/fine-collection', label: 'Fine collection', api: 'GET /fine-collection/*' },
  { href: '/wallet', label: 'Wallet', api: 'GET /wallet/*' },
  { href: '/ocr', label: 'OCR', api: 'GET /ocr/submissions' },
  { href: '/badges', label: 'Badges', api: 'GET /badges/summary' },
  { href: '/analytics', label: 'Analytics', api: 'GET /analytics' },
  { href: '/settings', label: 'System config', api: 'GET /systemconfig' },
  { href: '/logs', label: 'Logs', api: 'GET /logs' },
];

export function isNavActive(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  if (href === '/users') return pathname === '/users';
  return pathname === href || pathname.startsWith(`${href}/`);
}
