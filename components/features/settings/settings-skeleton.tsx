'use client';

import { card, formGrid, panel } from '@/lib/ui-classes';

export function SettingsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={card}>
          <div className="mb-4 flex gap-3">
            <div className="size-10 rounded-xl bg-slate-200 dark:bg-zinc-700" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded-md bg-slate-200 dark:bg-zinc-700" />
              <div className="h-3 w-48 rounded-md bg-slate-200 dark:bg-zinc-700" />
            </div>
          </div>
          <div className={`${formGrid} max-w-2xl`}>
            <div className="h-16 rounded-xl bg-slate-200 dark:bg-zinc-700" />
            <div className="h-16 rounded-xl bg-slate-200 dark:bg-zinc-700" />
          </div>
        </div>
      ))}
      <div className={`${panel} h-14 rounded-2xl`} />
    </div>
  );
}
