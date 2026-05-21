'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DASHBOARD_QUICK_LINKS } from '@/lib/dashboard/quick-links';
import { card, mutedText } from '@/lib/ui-classes';

export function DashboardQuickLinks() {
  return (
    <section className="mb-8" aria-label="Quick links">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
        Quick links
      </h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DASHBOARD_QUICK_LINKS.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group ${card} flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200/80 hover:shadow-lg hover:shadow-slate-200/50 dark:hover:border-indigo-500/30 dark:hover:shadow-black/20`}
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 transition-transform duration-200 group-hover:scale-105 dark:bg-indigo-500/15 dark:text-indigo-400">
                <Icon className="size-5" strokeWidth={2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">{link.label}</p>
                <p className={`${mutedText} truncate text-xs`}>{link.description}</p>
              </div>
              <ChevronRight
                className="size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500 dark:text-zinc-600 dark:group-hover:text-indigo-400"
                strokeWidth={2}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
