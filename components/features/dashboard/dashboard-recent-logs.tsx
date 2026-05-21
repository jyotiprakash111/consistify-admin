'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import type { AdminLog } from '@/lib/types/admin';
import { card, linkAccent, mutedText } from '@/lib/ui-classes';

function formatLogTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

type DashboardRecentLogsProps = {
  logs?: AdminLog[] | null;
};

export function DashboardRecentLogs({ logs }: DashboardRecentLogsProps) {
  const items = logs ?? [];
  if (items.length === 0) return null;

  return (
    <section className="mb-8" aria-label="Recent admin activity">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          <FileText className="size-4" strokeWidth={2} />
          Recent activity
        </h2>
        <Link href="/logs" className={`${linkAccent} text-xs`}>
          View all logs
        </Link>
      </div>
      <div className={card}>
        <ul className="divide-y divide-slate-100 dark:divide-zinc-800">
          {items.map((log) => (
            <li
              key={log.id}
              className="flex flex-wrap items-baseline justify-between gap-2 px-1 py-3 first:pt-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-zinc-200">{log.action}</p>
                {log.userId ? (
                  <p className={`${mutedText} truncate text-xs`}>User {log.userId}</p>
                ) : null}
              </div>
              <time className={`${mutedText} shrink-0 text-xs tabular-nums`} dateTime={log.createdAt}>
                {formatLogTime(log.createdAt)}
              </time>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
