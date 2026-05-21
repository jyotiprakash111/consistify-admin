'use client';

import { ChartCardSkeleton } from '@/components/ui/chart-card';
import { MetricCardSkeleton } from '@/components/ui/metric-card';
import { gridCards, panel } from '@/lib/ui-classes';

export function DashboardSkeleton() {
  return (
    <>
      <div className={`${gridCards} mb-8`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={`primary-${i}`} />
        ))}
      </div>
      <div className={`${gridCards} mb-8`}>
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricCardSkeleton key={`secondary-${i}`} />
        ))}
      </div>
      <div className="mb-8 grid gap-6 lg:grid-cols-3 lg:items-stretch">
        <ChartCardSkeleton height={240} className="lg:col-span-2" />
        <div className={`${panel} min-h-[280px] animate-pulse p-5`}>
          <div className="h-4 w-20 rounded-md bg-slate-200 dark:bg-zinc-700" />
          <div className="mt-4 space-y-3">
            <div className="h-24 rounded-xl bg-slate-200 dark:bg-zinc-700" />
            <div className="h-24 rounded-xl bg-slate-200 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={`${panel} h-20 animate-pulse`} />
        ))}
      </div>
      <div className={`${panel} animate-pulse p-5`}>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 rounded-lg bg-slate-200 dark:bg-zinc-700" />
          ))}
        </div>
      </div>
    </>
  );
}
