'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import Link from 'next/link';
import { useEffect } from 'react';
import { CalendarClock } from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';
import { DataTable } from '@/components/ui/data-table';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  approveQueuedExtraLeave,
  fetchExtraLeaveQueue,
  selectExtraLeaves,
} from '@/lib/store/slices/extra-leaves/extraLeavesSlice';
import { btnPrimary, gridCards, linkAccent, mutedText } from '@/lib/ui-classes';

function formatRequestedAt(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export function ExtraLeavesQueueView() {
  const dispatch = useAppDispatch();
  const { total, leaves, status, error, message, approvingId } = useAppSelector(selectExtraLeaves);

  useEffect(() => {
    dispatch(fetchExtraLeaveQueue());
  }, [dispatch]);

  return (
    <AdminShell>
      <PageHeader
        title="Extra leave queue"
        description="Review and approve 5th+ leave requests (extra_pending)"
        apiHint="GET /leaves/extra-pending · POST /leaves/:leaveId/approve-extra"
        actions={
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            onClick={() => dispatch(fetchExtraLeaveQueue())}
            disabled={status === 'loading'}
          >
            Refresh
          </button>
        }
      />
      <AlertMessage error={error} success={message} />

      <div className={`${gridCards} mb-6`}>
        <MetricCard label="Pending approvals" value={total} />
        <MetricCard label="Shown in table" value={leaves.length} />
      </div>

      <DataTable
        rows={leaves}
        rowKey={(row) => row.id}
        emptyMessage="No pending extra leaves — queue is empty."
        columns={[
          {
            key: 'user',
            header: 'Student',
            render: (row) => (
              <div>
                <Link href={`/users/${row.userId}`} className={linkAccent}>
                  {row.userName || row.userId}
                </Link>
                <p className={`${mutedText} text-xs`}>{row.phone}</p>
              </div>
            ),
          },
          { key: 'exam', header: 'Exam group', render: (row) => row.examGroup || '—' },
          { key: 'date', header: 'Leave date', render: (row) => row.leaveDate },
          { key: 'month', header: 'Month', render: (row) => row.monthKey },
          {
            key: 'reason',
            header: 'Reason',
            render: (row) => (
              <span className="max-w-xs block truncate" title={row.reason}>
                {row.reason || '—'}
              </span>
            ),
          },
          {
            key: 'requested',
            header: 'Requested',
            render: (row) => formatRequestedAt(row.createdAt),
          },
          {
            key: 'action',
            header: '',
            render: (row) => (
              <button
                type="button"
                className={btnPrimary}
                disabled={approvingId === row.id}
                onClick={() => void dispatch(approveQueuedExtraLeave(row.id))}
              >
                {approvingId === row.id ? 'Approving…' : 'Approve'}
              </button>
            ),
          },
        ]}
      />

      {leaves.length > 0 ? (
        <p className={`${mutedText} mt-4 flex items-center gap-2 text-sm`}>
          <CalendarClock className="h-4 w-4 shrink-0" />
          Approved leaves become extra_approved; no fines apply on that leave day once fine rules
          are configured on the server.
        </p>
      ) : null}
    </AdminShell>
  );
}
