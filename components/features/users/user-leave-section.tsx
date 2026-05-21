'use client';

import { CalendarDays } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { formatDate, StatMini } from '@/components/features/users/user-profile-ui';
import type { UserLeaveRecord, UserLeaveSummary } from '@/lib/types/admin';
import { card, mutedText } from '@/lib/ui-classes';

function StatusBadge({ status }: { status: string }) {
  const lower = status.toLowerCase();
  const variant =
    lower === 'approved' || lower === 'used' || lower === 'completed'
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      : lower === 'pending' || lower === 'requested'
        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
        : lower === 'rejected' || lower === 'denied'
          ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
          : 'bg-slate-500/10 text-slate-600 dark:text-zinc-400';

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${variant}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

type UserLeaveSectionProps = {
  summary: UserLeaveSummary;
  leaves: UserLeaveRecord[];
  loading?: boolean;
};

export function UserLeaveSection({ summary, leaves, loading }: UserLeaveSectionProps) {
  return (
    <section className={`${card} ring-1 ring-emerald-500/10`}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
          <CalendarDays className="size-4" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Leave balance
          </h3>
          <p className={`${mutedText} text-xs`}>Days taken vs allowance for this user</p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatMini label="Total allowed" value={summary.totalAllowed} suffix="days" />
        <StatMini label="Leaves taken" value={summary.used} suffix="days" />
        <StatMini label="Leaves left" value={summary.remaining} suffix="days" />
        <StatMini label="Pending requests" value={summary.pending ?? 0} />
        {summary.extraApproved != null && summary.extraApproved > 0 ? (
          <StatMini label="Extra approved" value={summary.extraApproved} suffix="days" />
        ) : null}
      </div>

      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-500">
        Leave history
      </h4>

      {loading ? (
        <DataTableSkeleton columns={5} rows={4} />
      ) : (
        <DataTable
          rows={leaves}
          rowKey={(l) => l.id}
          emptyMessage="No leave records for this user"
          columns={[
            {
              key: 'dates',
              header: 'Period',
              render: (l) => {
                if (l.startDate && l.endDate) {
                  return `${formatDate(l.startDate)} → ${formatDate(l.endDate)}`;
                }
                return formatDate(l.startDate || l.createdAt);
              },
            },
            {
              key: 'days',
              header: 'Days',
              render: (l) => (l.days != null ? l.days : '—'),
            },
            { key: 'type', header: 'Type', render: (l) => l.type || '—' },
            {
              key: 'status',
              header: 'Status',
              render: (l) => <StatusBadge status={l.status} />,
            },
            {
              key: 'extra',
              header: 'Extra',
              render: (l) => (l.isExtra ? 'Yes' : '—'),
            },
            {
              key: 'reason',
              header: 'Reason',
              className: 'max-w-xs',
              render: (l) => (
                <span className="block truncate text-slate-600 dark:text-zinc-400" title={l.reason}>
                  {l.reason || '—'}
                </span>
              ),
            },
          ]}
        />
      )}
    </section>
  );
}
