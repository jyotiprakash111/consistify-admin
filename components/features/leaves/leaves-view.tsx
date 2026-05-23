'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo } from 'react';
import { CalendarDays, Loader2, RefreshCw } from 'lucide-react';
import { AdminShell } from '@/components/layout/admin-shell';
import { LeaveKindBadge } from '@/components/features/leaves/leave-kind-badge';
import { AlertMessage } from '@/components/ui/alert-message';
import { DataTable } from '@/components/ui/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import type { AdminLeaveRow } from '@/lib/types/admin';
import type { LeavesKindFilter, LeavesTab } from '@/lib/store/slices/leaves/leavesSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  approveLeave,
  fetchLeaves,
  selectLeaves,
  setLeavesKindFilter,
  setLeavesTab,
} from '@/lib/store/slices/leaves/leavesSlice';
import { btn, btnPrimary, gridCards, linkAccent, mutedText, panel } from '@/lib/ui-classes';

function formatRequestedAt(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

const TAB_OPTIONS: { id: LeavesTab; label: string; description: string }[] = [
  {
    id: 'pending',
    label: 'Pending approval',
    description: '5th+ extra leaves awaiting admin approval',
  },
  {
    id: 'all',
    label: 'All leaves',
    description: 'Standard and extra leaves across students',
  },
];

const KIND_FILTERS: { value: LeavesKindFilter; label: string }[] = [
  { value: 'all', label: 'All kinds' },
  { value: 'standard', label: 'Standard' },
  { value: 'extra_pending', label: 'Extra pending' },
  { value: 'extra_approved', label: 'Extra approved' },
];

export function LeavesView() {
  const dispatch = useAppDispatch();
  const {
    activeTab,
    kindFilter,
    total,
    pendingTotal,
    leaves,
    status,
    error,
    message,
    approvingId,
  } = useAppSelector(selectLeaves);

  const loading = status === 'loading';

  const displayLeaves = useMemo(() => {
    if (activeTab === 'pending') {
      return leaves.filter((row) => row.kind === 'extra_pending');
    }
    return leaves;
  }, [activeTab, leaves]);

  const load = useCallback(() => {
    dispatch(fetchLeaves({ tab: activeTab, kindFilter }));
  }, [dispatch, activeTab, kindFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const activeTabMeta = TAB_OPTIONS.find((t) => t.id === activeTab)!;

  const columns = [
    {
      key: 'user',
      header: 'Student',
      render: (row: AdminLeaveRow) => (
        <div>
          <Link href={`/users/${row.userId}`} className={linkAccent}>
            {row.userName || row.userId}
          </Link>
          <p className={`${mutedText} text-xs`}>{row.phone}</p>
        </div>
      ),
    },
    {
      key: 'kind',
      header: 'Type',
      render: (row: AdminLeaveRow) => <LeaveKindBadge kind={row.kind} />,
    },
    { key: 'exam', header: 'Exam group', render: (row: AdminLeaveRow) => row.examGroup || '—' },
    { key: 'date', header: 'Leave date', render: (row: AdminLeaveRow) => row.leaveDate },
    { key: 'month', header: 'Month', render: (row: AdminLeaveRow) => row.monthKey },
    {
      key: 'reason',
      header: 'Reason',
      render: (row: AdminLeaveRow) => (
        <span className="block max-w-xs truncate" title={row.reason}>
          {row.reason || '—'}
        </span>
      ),
    },
    {
      key: 'requested',
      header: 'Requested',
      render: (row: AdminLeaveRow) => formatRequestedAt(row.createdAt),
    },
    {
      key: 'action',
      header: '',
      render: (row: AdminLeaveRow) =>
        row.kind === 'extra_pending' ? (
          <button
            type="button"
            className={btnPrimary}
            disabled={approvingId === row.id}
            onClick={() => void dispatch(approveLeave(row.id))}
          >
            {approvingId === row.id ? (
              <span className="inline-flex items-center gap-1.5">
                <Loader2 className="size-3.5 animate-spin" strokeWidth={2} aria-hidden />
                Approving…
              </span>
            ) : (
              'Approve'
            )}
          </button>
        ) : (
          <span className={`${mutedText} text-xs`}>—</span>
        ),
    },
  ];

  return (
    <AdminShell>
      <PageHeader
        title="Leaves"
        description="Approve extra (5th+) leaves and review all student leave records"
        apiHint="GET /leaves · POST /leaves/:leaveId/approve-extra"
        actions={
          <button
            type="button"
            className={btn}
            disabled={status === 'loading'}
            onClick={load}
          >
            <RefreshCw
              className={`size-4 ${status === 'loading' ? 'animate-spin' : ''}`}
              strokeWidth={2}
            />
            Refresh
          </button>
        }
      />

      <AlertMessage error={error} success={message} />

      <div className={`${gridCards} mb-6`}>
        <MetricCard label="Pending approval" value={pendingTotal} />
        <MetricCard
          label={activeTab === 'pending' ? 'In queue' : 'Shown in table'}
          value={activeTab === 'pending' ? displayLeaves.length : total}
        />
      </div>

      <div className={`${panel} mb-6 flex flex-wrap gap-2 p-1`}>
        {TAB_OPTIONS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => dispatch(setLeavesTab(tab.id))}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-sm dark:bg-indigo-500'
                : 'text-slate-600 hover:bg-slate-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <p className={`${mutedText} mb-4 text-sm`}>{activeTabMeta.description}</p>

      {activeTab === 'all' ? (
        <div className="mb-4 flex flex-wrap gap-2">
          {KIND_FILTERS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => dispatch(setLeavesKindFilter(opt.value))}
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                kindFilter === opt.value
                  ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                  : 'border-slate-200/80 text-slate-600 hover:bg-slate-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : null}

      {loading ? (
        <DataTableSkeleton columns={8} rows={6} />
      ) : (
        <DataTable
          rows={displayLeaves}
          rowKey={(row) => row.id}
          emptyMessage={
            activeTab === 'pending'
              ? 'No pending extra leaves — queue is empty.'
              : 'No leaves match this filter.'
          }
          columns={columns}
        />
      )}

      {displayLeaves.some((l) => l.kind === 'extra_pending') ? (
        <p className={`${mutedText} mt-4 flex items-center gap-2 text-sm`}>
          <CalendarDays className="size-4 shrink-0" strokeWidth={2} />
          Standard leaves are auto-recorded when students book within their monthly quota. Extra
          leaves (5th+) need approval here before fines are waived for that day.
        </p>
      ) : null}
    </AdminShell>
  );
}
