'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Inbox,
  Link2,
  RotateCcw,
  Send,
  Smartphone,
  UserPlus,
  Users,
} from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';
import { DataTable } from '@/components/ui/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { SelectInput } from '@/components/ui/form-field';
import { UserSelectField } from '@/components/ui/user-select-field';
import { StatusBadge } from '@/components/features/users/user-profile-ui';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  buildInviteActivityRows,
  filterActivityByTab,
  type InviteTab,
} from '@/lib/session-invite-activity';
import {
  fetchSessionInvites,
  resetSessionInvitesFilters,
  selectSessionInvites,
  setSessionInvitesFilters,
} from '@/lib/store/slices/session-invites/sessionInvitesSlice';
import { formatInviteDate } from '@/lib/session-invite-utils';
import {
  btn,
  btnOutlinePrimary,
  btnPrimary,
  linkAccent,
  mutedText,
  panel,
} from '@/lib/ui-classes';

const TABS: { id: InviteTab; label: string; icon: typeof Send }[] = [
  { id: 'all', label: 'All activity', icon: Users },
  { id: 'in_app', label: 'In-app invites', icon: Send },
  { id: 'share_link', label: 'Share codes', icon: Link2 },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

function InviteTypeBadge({ kind }: { kind: 'in_app' | 'share_link' }) {
  if (kind === 'in_app') {
    return <StatusBadge label="In-app" variant="accent" />;
  }
  return (
    <span className="inline-flex items-center gap-1.5">
      <StatusBadge label="Share link" variant="neutral" />
      <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">WP · TG</span>
    </span>
  );
}

function ActivityTabs({
  tab,
  counts,
  onChange,
}: {
  tab: InviteTab;
  counts: Record<InviteTab, number>;
  onChange: (t: InviteTab) => void;
}) {
  return (
    <div
      className="grid grid-cols-1 gap-3 sm:grid-cols-3"
      role="tablist"
      aria-label="Invite activity type"
    >
      {TABS.map(({ id, label, icon: Icon }) => {
        const active = tab === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={`group flex items-center gap-3 rounded-xl px-4 py-3.5 text-left transition-all ${
              active
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 dark:bg-indigo-500 dark:shadow-indigo-500/25'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:bg-zinc-800'
            }`}
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                active
                  ? 'bg-white/20 text-white'
                  : 'bg-white text-indigo-600 shadow-sm dark:bg-zinc-900 dark:text-indigo-400'
              }`}
            >
              <Icon className="size-4" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{label}</p>
              <p
                className={`mt-0.5 text-xs tabular-nums ${
                  active ? 'text-indigo-100' : 'text-slate-500 dark:text-zinc-500'
                }`}
              >
                {counts[id]} {counts[id] === 1 ? 'record' : 'records'}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function StatusPills({
  value,
  onChange,
}: {
  value: string;
  onChange: (status: string) => void;
}) {
  return (
    <div
      className="inline-flex flex-wrap gap-1 rounded-lg bg-slate-100/80 p-1 dark:bg-zinc-800/80"
      role="group"
      aria-label="Partner status"
    >
      {STATUS_OPTIONS.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              active
                ? 'bg-white text-indigo-700 shadow-sm dark:bg-zinc-900 dark:text-indigo-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

function ActiveCodesToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="grid grid-cols-[2.75rem_1fr] items-center gap-x-3 gap-y-0.5">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby="active-codes-label active-codes-hint"
        onClick={() => onChange(!checked)}
        className={`relative col-start-1 row-span-2 h-6 w-11 justify-self-center rounded-full transition-colors ${
          checked ? 'bg-indigo-600 dark:bg-indigo-500' : 'bg-slate-300 dark:bg-zinc-600'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <p
        id="active-codes-label"
        className="col-start-2 row-start-1 text-sm font-medium text-slate-800 dark:text-zinc-200"
      >
        Active share codes only
      </p>
      <p
        id="active-codes-hint"
        className="col-start-2 row-start-2 text-xs leading-snug text-slate-500 dark:text-zinc-500"
      >
        Hide expired session join codes
      </p>
    </div>
  );
}

function InviteEmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-zinc-800">
        <Inbox className="size-8 text-slate-400 dark:text-zinc-500" strokeWidth={1.5} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">
        No invites match your filters
      </h3>
      <p className={`${mutedText} mt-2 max-w-sm text-sm leading-relaxed`}>
        Widen partner status, turn off active-codes-only, or clear the user filter.
      </p>
      <button type="button" onClick={onReset} className={`${btn} mt-5`}>
        <RotateCcw className="size-4" strokeWidth={2} />
        Clear all filters
      </button>
    </div>
  );
}

export function SessionInvitesView() {
  const searchParams = useSearchParams();
  const appliedUrlUser = useRef(false);
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<InviteTab>('all');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const {
    summary,
    partnerRequests,
    shareCodes,
    filters,
    error,
    status,
  } = useAppSelector(selectSessionInvites);

  const isLoading = status === 'loading' && !summary;

  const activityRows = useMemo(
    () => buildInviteActivityRows(partnerRequests, shareCodes),
    [partnerRequests, shareCodes],
  );

  const displayedRows = useMemo(() => filterActivityByTab(activityRows, tab), [activityRows, tab]);

  const tabCounts = useMemo(
    () => ({
      all: activityRows.length,
      in_app: partnerRequests.length,
      share_link: shareCodes.length,
    }),
    [activityRows.length, partnerRequests.length, shareCodes.length],
  );

  const totalPages = Math.max(1, Math.ceil(displayedRows.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  const paginatedRows = useMemo(
    () => displayedRows.slice(safePage * pageSize, safePage * pageSize + pageSize),
    [displayedRows, safePage, pageSize],
  );

  useEffect(() => {
    setPage(0);
  }, [tab, filters, pageSize]);

  useEffect(() => {
    const userIdFromUrl = searchParams?.get('userId')?.trim() ?? '';
    if (userIdFromUrl && !appliedUrlUser.current) {
      appliedUrlUser.current = true;
      const next = { ...filters, userId: userIdFromUrl };
      dispatch(setSessionInvitesFilters({ userId: userIdFromUrl }));
      dispatch(fetchSessionInvites(next));
      return;
    }
    dispatch(fetchSessionInvites(filters));
  }, [dispatch, searchParams]);

  function onApply() {
    dispatch(fetchSessionInvites(filters));
  }

  function onReset() {
    setTab('all');
    setPage(0);
    dispatch(resetSessionInvitesFilters());
    dispatch(fetchSessionInvites({ status: 'all', userId: '', activeShareCodesOnly: false }));
  }

  const activityColumns = [
    {
      key: 'type',
      header: 'Type',
      render: (r: (typeof paginatedRows)[0]) => <InviteTypeBadge kind={r.kind} />,
    },
    {
      key: 'when',
      header: 'When',
      className: 'whitespace-nowrap',
      render: (r: (typeof paginatedRows)[0]) => formatInviteDate(r.createdAt),
    },
    {
      key: 'host',
      header: 'From / host',
      render: (r: (typeof paginatedRows)[0]) => (
        <Link href={`/users/${r.primaryUserId}`} className={linkAccent}>
          {r.primaryLabel}
        </Link>
      ),
    },
    {
      key: 'target',
      header: 'To / code',
      render: (r: (typeof paginatedRows)[0]) => {
        if (r.kind === 'share_link') {
          return (
            <div className="space-y-0.5">
              <span className="font-mono text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                {r.code}
              </span>
              <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-500">
                <Smartphone className="size-3" strokeWidth={2} />
                WhatsApp · Telegram · Other
              </div>
            </div>
          );
        }
        return r.secondaryUserId ? (
          <Link href={`/users/${r.secondaryUserId}`} className={linkAccent}>
            {r.secondaryLabel}
          </Link>
        ) : (
          r.secondaryLabel
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (r: (typeof paginatedRows)[0]) => (
        <StatusBadge label={r.statusLabel} variant={r.statusVariant} />
      ),
    },
    {
      key: 'join',
      header: '',
      render: (r: (typeof paginatedRows)[0]) =>
        r.joinUrl ? (
          <span
            className="cursor-default text-xs font-medium text-slate-400 dark:text-zinc-500"
            title={r.joinUrl}
          >
            Open join link
          </span>
        ) : r.note?.trim() ? (
          <span className="max-w-[10rem] truncate text-xs text-slate-500" title={r.note}>
            {r.note}
          </span>
        ) : null,
    },
  ];

  return (
    <AdminShell>
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Invite activity
          </h1>
          <p className={`${mutedText} mt-1 max-w-lg text-sm`}>
            Manage and track all partner invites and share codes for joint focus sessions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btnOutlinePrimary}
            onClick={() => setTab('share_link')}
          >
            <Link2 className="size-4" strokeWidth={2} />
            Share codes
          </button>
          <Link href="/users" className={btnPrimary}>
            <UserPlus className="size-4" strokeWidth={2} />
            View users
          </Link>
        </div>
      </header>

      <AlertMessage error={error} />

      {isLoading ? (
        <div className={panel}>
          <div className="h-14 animate-pulse border-b bg-slate-50 dark:bg-zinc-900" />
          <div className="p-6">
            <DataTableSkeleton columns={6} rows={8} />
          </div>
        </div>
      ) : summary ? (
        <div className={panel}>
          <div className="space-y-4 px-5 py-5 sm:px-6 sm:py-6">
            <ActivityTabs tab={tab} counts={tabCounts} onChange={setTab} />

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <div className="grid gap-5 lg:grid-cols-12">
                <div className="space-y-2 lg:col-span-5">
                  <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                    User
                  </label>
                  <UserSelectField
                    combobox
                    label=""
                    value={filters.userId}
                    onChange={(userId) =>
                      dispatch(setSessionInvitesFilters({ userId }))
                    }
                  />
                </div>

                <div className="space-y-2 lg:col-span-4">
                  <label className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                    Partner status
                  </label>
                  <StatusPills
                    value={filters.status}
                    onChange={(status) =>
                      dispatch(setSessionInvitesFilters({ status }))
                    }
                  />
                </div>

                <div className="flex flex-col justify-between gap-4 lg:col-span-3">
                  <div className="pt-7">
                    <ActiveCodesToggle
                      checked={filters.activeShareCodesOnly}
                      onChange={(activeShareCodesOnly) =>
                        dispatch(
                          setSessionInvitesFilters({
                            activeShareCodesOnly,
                          }),
                        )
                      }
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <button type="button" onClick={onReset} className={btn}>
                      <RotateCcw className="size-4" strokeWidth={2} />
                      Reset
                    </button>
                    <button type="button" onClick={onApply} className={btnPrimary}>
                      <Filter className="size-4" strokeWidth={2} />
                      Apply filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="min-h-[240px] border-t border-slate-100 dark:border-zinc-800">
            {displayedRows.length === 0 ? (
              <InviteEmptyState onReset={onReset} />
            ) : (
              <div className="p-4 sm:px-6 sm:pb-6">
                <DataTable
                  rows={paginatedRows}
                  rowKey={(r) => r.id}
                  emptyMessage="No invites match your filters"
                  columns={activityColumns}
                />
              </div>
            )}
          </div>

          <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              <span className="font-medium text-slate-700 dark:text-zinc-400">
                {displayedRows.length}
              </span>{' '}
              {displayedRows.length === 1 ? 'record' : 'records'} ·{' '}
              <span className="font-medium text-slate-700 dark:text-zinc-400">
                {tabCounts.all}
              </span>{' '}
              total loaded
            </p>
            {displayedRows.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  className={btn}
                  disabled={safePage <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" strokeWidth={2} />
                </button>
                <span className="min-w-[4rem] text-center tabular-nums text-slate-700 dark:text-zinc-300">
                  {safePage + 1} / {totalPages}
                </span>
                <button
                  type="button"
                  className={btn}
                  disabled={safePage >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" strokeWidth={2} />
                </button>
                <SelectInput
                  value={String(pageSize)}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="!w-auto min-w-[7rem]"
                  aria-label="Rows per page"
                >
                  {PAGE_SIZE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n} per page
                    </option>
                  ))}
                </SelectInput>
              </div>
            ) : null}
          </footer>
        </div>
      ) : null}
    </AdminShell>
  );
}
