'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PropsWithChildren } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { adminNavItems, isNavActive } from '@/lib/admin-nav';
import { LogoutIcon, navIconMap } from '@/lib/nav-icons';
import { useAppDispatch } from '@/lib/store/hooks';
import { logoutAdmin } from '@/lib/store/slices/auth/authSlice';
import { btn, navLinkActive, navLinkInactive, shellAside, shellMain } from '@/lib/ui-classes';
import { Shield } from 'lucide-react';

export function AdminShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();

  async function onLogout() {
    await dispatch(logoutAdmin());
    router.push('/login');
  }

  return (
    <div className="flex min-h-screen">
      <aside className={shellAside}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-md dark:bg-indigo-500">
            <Shield className="size-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Persistify</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Admin console</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto scroll-smooth pr-1">
          {adminNavItems.map((link) => {
            const active = isNavActive(pathname ?? '', link.href);
            const Icon = navIconMap[link.href];
            return (
              <Link
                key={link.href}
                href={link.href}
                title={link.api}
                className={active ? navLinkActive : navLinkInactive}
              >
                {Icon ? <Icon className="size-4 shrink-0 opacity-90" strokeWidth={2} /> : null}
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 space-y-3 border-t border-slate-200/80 pt-4 dark:border-slate-700">
          <ThemeToggle />
          <button type="button" onClick={onLogout} className={`${btn} w-full`}>
            <LogoutIcon className="size-4" strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>
      <main className={shellMain}>{children}</main>
    </div>
  );
}
