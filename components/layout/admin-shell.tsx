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
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30">
            <Shield className="size-5" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              Persistify
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-500">Admin console</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto scroll-smooth pr-1">
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

        <div className="mt-6 space-y-3 border-t border-slate-200/60 pt-5 dark:border-zinc-800">
          <ThemeToggle />
          <button type="button" onClick={onLogout} className={`${btn} w-full`}>
            <LogoutIcon className="size-4" strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>
      <main className={shellMain}>
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
