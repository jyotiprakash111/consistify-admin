'use client';

import Link from 'next/link';
import { CalendarClock } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { formatDate } from '@/components/features/users/user-profile-ui';
import { isPendingExtraLeave } from '@/lib/leave-utils';
import type { UserLeaveRecord } from '@/lib/types/admin';
import { btnPrimary, card, linkAccent, mutedText } from '@/lib/ui-classes';

type UserPendingExtraLeavesProps = {
  leaves: UserLeaveRecord[];
  actionLoading: boolean;
  onApprove: (leaveId: string) => void;
};

export function UserPendingExtraLeaves({
  leaves,
  actionLoading,
  onApprove,
}: UserPendingExtraLeavesProps) {
  const pending = leaves.filter(isPendingExtraLeave);

  if (pending.length === 0) {
    return (
      <section className={card}>
        <p className={`${mutedText} text-sm`}>
          No pending extra leaves for this user.{' '}
          <Link href="/leaves" className={linkAccent}>
            View leaves queue →
          </Link>
        </p>
      </section>
    );
  }

  return (
    <section className={`${card} ring-1 ring-amber-500/15`}>
      <div className="mb-4 flex items-center gap-2">
        <CalendarClock className="size-4 text-amber-600 dark:text-amber-400" strokeWidth={2} />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Pending extra leaves
        </h3>
      </div>
      <DataTable
        rows={pending}
        rowKey={(l) => l.id}
        emptyMessage="None"
        columns={[
          {
            key: 'date',
            header: 'Leave date',
            render: (l) => formatDate(l.startDate || l.createdAt),
          },
          { key: 'reason', header: 'Reason', render: (l) => l.reason || '—' },
          {
            key: 'status',
            header: 'Status',
            render: (l) => (
              <span className="text-xs font-medium capitalize text-amber-700 dark:text-amber-400">
                {l.status.replace(/_/g, ' ')}
              </span>
            ),
          },
          {
            key: 'action',
            header: '',
            render: (l) => (
              <button
                type="button"
                className={btnPrimary}
                disabled={actionLoading}
                onClick={() => onApprove(l.id)}
              >
                Approve
              </button>
            ),
          },
        ]}
      />
    </section>
  );
}
