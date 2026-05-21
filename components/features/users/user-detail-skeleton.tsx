'use client';

import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { card, formGrid, panel } from '@/lib/ui-classes';

export function UserDetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className={`${card} flex gap-5 p-6`}>
        <div className="size-20 rounded-2xl bg-slate-200 dark:bg-zinc-700" />
        <div className="flex-1 space-y-3">
          <div className="h-6 w-48 rounded-lg bg-slate-200 dark:bg-zinc-700" />
          <div className="h-4 w-64 rounded-md bg-slate-200 dark:bg-zinc-700" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-lg bg-slate-200 dark:bg-zinc-700" />
            <div className="h-6 w-20 rounded-lg bg-slate-200 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${panel} h-20`} />
        ))}
      </div>
      <div className={`${card} p-5`}>
        <div className={`${formGrid} max-w-2xl`}>
          <div className="h-16 rounded-xl bg-slate-200 dark:bg-zinc-700" />
          <div className="h-16 rounded-xl bg-slate-200 dark:bg-zinc-700" />
        </div>
      </div>
      <DataTableSkeleton columns={5} rows={5} />
      <DataTableSkeleton columns={4} rows={4} />
    </div>
  );
}
