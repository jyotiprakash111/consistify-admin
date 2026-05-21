'use client';

import { Timer } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, formatDate } from '@/components/features/users/user-profile-ui';
import { card } from '@/lib/ui-classes';

type SessionRow = {
  id: string;
  startTime?: string;
  endTime?: string;
  status?: string;
  distanceEarnedKm?: number;
};

function sessionStatusVariant(
  status: string,
): 'success' | 'warning' | 'danger' | 'neutral' | 'accent' {
  const s = status.toLowerCase();
  if (s === 'completed') return 'success';
  if (s === 'failed' || s === 'abandoned') return 'danger';
  if (s === 'active' || s === 'in_progress') return 'accent';
  return 'neutral';
}

export function UserSessionsTable({ sessions }: { sessions: Array<Record<string, unknown>> }) {
  const rows: SessionRow[] = sessions.map((s) => ({
    id: String(s.id ?? ''),
    startTime: String(s.startTime ?? ''),
    endTime: String(s.endTime ?? ''),
    status: String(s.status ?? ''),
    distanceEarnedKm: typeof s.distanceEarnedKm === 'number' ? s.distanceEarnedKm : undefined,
  }));

  return (
    <section className={card}>
      <div className="mb-4 flex items-center gap-2">
        <Timer className="size-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Focus sessions
        </h3>
      </div>
      <DataTable
        rows={rows}
        rowKey={(s) => s.id}
        emptyMessage="No sessions recorded"
        columns={[
          {
            key: 'start',
            header: 'Started',
            className: 'whitespace-nowrap',
            render: (s) => formatDate(s.startTime),
          },
          {
            key: 'end',
            header: 'Ended',
            className: 'whitespace-nowrap',
            render: (s) => formatDate(s.endTime),
          },
          {
            key: 'status',
            header: 'Status',
            render: (s) => (
              <StatusBadge
                label={s.status || '—'}
                variant={sessionStatusVariant(s.status || '')}
              />
            ),
          },
          {
            key: 'km',
            header: 'Distance',
            render: (s) =>
              s.distanceEarnedKm != null ? `${s.distanceEarnedKm.toFixed(2)} km` : '—',
          },
        ]}
      />
    </section>
  );
}
