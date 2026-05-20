'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { adminLogout } from '@/lib/api';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/users', label: 'Users' },
  { href: '/analytics', label: 'Analytics' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/badges', label: 'Badges' },
  { href: '/ocr', label: 'OCR' },
  { href: '/settings', label: 'Settings' },
  { href: '/logs', label: 'Logs' },
];

export function AdminShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();

  async function onLogout() {
    await adminLogout();
    router.push('/login');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <aside style={{ width: 230, borderRight: '1px solid #eee', padding: 16 }}>
        <h2 style={{ marginTop: 0 }}>Persistify Admin</h2>
        <nav style={{ display: 'grid', gap: 8 }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                textDecoration: 'none',
                color: pathname === link.href ? '#111' : '#555',
                fontWeight: pathname === link.href ? 700 : 500,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button onClick={onLogout} style={{ marginTop: 20 }}>
          Logout
        </button>
      </aside>
      <main style={{ flex: 1, padding: 20 }}>{children}</main>
    </div>
  );
}
