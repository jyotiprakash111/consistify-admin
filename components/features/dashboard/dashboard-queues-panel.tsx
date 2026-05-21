'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { NumberCounter } from '@/components/ui/number-counter';
import {
  DASHBOARD_QUEUE_ITEMS,
  queueItemStyles,
} from '@/lib/dashboard/queue-items';
import type { DashboardMetrics } from '@/lib/types/dashboard';
import { card, mutedText } from '@/lib/ui-classes';

type DashboardQueuesPanelProps = {
  metrics: DashboardMetrics;
  /** Sidebar beside chart, or full-width row when chart is hidden */
  layout?: 'sidebar' | 'wide';
  /** Animate queue counts on load / refresh */
  animateCounts?: boolean;
};

export function DashboardQueuesPanel({
  metrics,
  layout = 'sidebar',
  animateCounts = true,
}: DashboardQueuesPanelProps) {
  const isWide = layout === 'wide';

  return (
    <div
      className={`${card} flex flex-col ${isWide ? '' : 'h-full min-h-[280px]'}`}
    >
      <div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Queues</h3>
        <p className={`${mutedText} mt-1 text-xs`}>Items needing admin attention</p>
      </div>

      <ul
        className={`mt-4 gap-3 ${
          isWide
            ? 'grid sm:grid-cols-2'
            : 'flex flex-1 flex-col'
        }`}
      >
        {DASHBOARD_QUEUE_ITEMS.map((item) => {
          const count = metrics[item.metricKey];
          const styles = queueItemStyles(item.accent);
          const Icon = item.icon;
          const hasPending = count > 0;

          return (
            <li key={item.metricKey} className="flex-1">
              <Link
                href={item.href}
                className={`group flex h-full min-h-[5.5rem] flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-md dark:border-zinc-700/80 dark:bg-zinc-800/40 dark:hover:bg-zinc-800/80 ${styles.borderHover}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105 ${styles.icon}`}
                  >
                    <Icon className="size-4" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                      {item.label}
                    </p>
                    <p className={`${mutedText} text-xs leading-snug`}>{item.description}</p>
                  </div>
                  <NumberCounter
                    value={count}
                    animate={animateCounts}
                    className={`shrink-0 text-2xl font-bold tabular-nums ${hasPending ? styles.count : 'text-slate-300 dark:text-zinc-600'}`}
                  />
                </div>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 group-hover:underline dark:text-indigo-400">
                  {item.ctaLabel}
                  <ChevronRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2}
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
