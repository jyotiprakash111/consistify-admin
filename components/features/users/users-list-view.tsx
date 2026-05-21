'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { AlertMessage } from '@/components/ui/alert-message';
import { DataTable } from '@/components/ui/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { FilterBar } from '@/components/ui/filter-bar';
import { SelectInput, TextInput } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchUsersList,
  selectUsersList,
  setUsersFilter,
} from '@/lib/store/slices/users/usersListSlice';
import type { AdminUser } from '@/lib/types/admin';
import {
  applyClientUserFilters,
  uniqueSignupSources,
  uniqueTiers,
} from '@/lib/users-list-filter';
import { formatGender, getUserDisplayName, getUserStatusLabel } from '@/lib/user-display';
import { linkAccent, mutedText } from '@/lib/ui-classes';

function UserAvatarCell({ user }: { user: AdminUser }) {
  const avatar = user.avatar?.trim() ?? '';
  const isImageUrl = /^https?:\/\//i.test(avatar);

  if (isImageUrl) {
    return (
      <div className="flex items-center gap-2.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={avatar}
          alt=""
          className="size-9 rounded-full object-cover ring-1 ring-slate-200/80 dark:ring-zinc-700"
        />
        <span className="font-medium text-slate-900 dark:text-zinc-100">{getUserDisplayName(user)}</span>
      </div>
    );
  }

  const initial = getUserDisplayName(user).charAt(0).toUpperCase() || '?';
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-sm font-semibold text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
        {initial}
      </span>
      <span className="font-medium text-slate-900 dark:text-zinc-100">{getUserDisplayName(user)}</span>
    </div>
  );
}

export function UsersListView() {
  const dispatch = useAppDispatch();
  const { users, filters, error, status } = useAppSelector(selectUsersList);
  const loading = status === 'loading';

  const displayed = useMemo(
    () => applyClientUserFilters(users, filters),
    [users, filters],
  );

  const tiers = useMemo(() => uniqueTiers(users), [users]);
  const signupSources = useMemo(() => uniqueSignupSources(users), [users]);

  useEffect(() => {
    dispatch(fetchUsersList(filters));
  }, [dispatch]);

  function onApply() {
    dispatch(fetchUsersList(filters));
  }

  return (
    <AdminShell>
      <PageHeader title="Users" description="Search, filter, and open user profiles" apiHint="GET /users" />
      <AlertMessage error={error} />
      <FilterBar onApply={onApply}>
        <TextInput
          value={filters.search}
          onChange={(e) => dispatch(setUsersFilter({ search: e.target.value }))}
          placeholder="Search name, email, phone, or id"
          className="min-w-[220px] flex-1"
        />
        <SelectInput
          value={filters.gender}
          onChange={(e) => dispatch(setUsersFilter({ gender: e.target.value }))}
        >
          <option value="all">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </SelectInput>
        <SelectInput
          value={filters.tier}
          onChange={(e) => dispatch(setUsersFilter({ tier: e.target.value }))}
        >
          <option value="all">All tiers</option>
          {tiers.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          value={filters.signupSource}
          onChange={(e) => dispatch(setUsersFilter({ signupSource: e.target.value }))}
        >
          <option value="all">All sources</option>
          {signupSources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </SelectInput>
        <SelectInput
          value={filters.status}
          onChange={(e) => dispatch(setUsersFilter({ status: e.target.value }))}
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="disabled">Disabled</option>
        </SelectInput>
        <SelectInput
          value={filters.walletFilter}
          onChange={(e) => dispatch(setUsersFilter({ walletFilter: e.target.value }))}
        >
          <option value="all">All wallets</option>
          <option value="low">Low balance (&lt;5)</option>
        </SelectInput>
        <SelectInput value={filters.sort} onChange={(e) => dispatch(setUsersFilter({ sort: e.target.value }))}>
          <option value="streak">Sort: streak</option>
          <option value="partnerMatches">Sort: partner matches</option>
          <option value="complianceRate">Sort: compliance</option>
        </SelectInput>
        <SelectInput value={filters.order} onChange={(e) => dispatch(setUsersFilter({ order: e.target.value }))}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </SelectInput>
      </FilterBar>
      {loading ? (
        <div className="mb-4 h-4 w-52 animate-pulse rounded-md bg-slate-200 dark:bg-zinc-700" />
      ) : (
        <p className={`${mutedText} mb-4`}>
          Showing {displayed.length} of {users.length} users
        </p>
      )}

      {loading ? (
        <DataTableSkeleton columns={9} rows={10} />
      ) : (
        <DataTable
          rows={displayed}
          rowKey={(u) => u.id}
          emptyMessage="No users match filters"
          columns={[
            {
              key: 'user',
              header: 'User',
              render: (u) => <UserAvatarCell user={u} />,
            },
            { key: 'phone', header: 'Phone', render: (u) => u.phone || '—' },
            { key: 'email', header: 'Email', render: (u) => u.email || '—' },
            { key: 'gender', header: 'Gender', render: (u) => formatGender(u.gender) },
            { key: 'tier', header: 'Tier', render: (u) => u.subscriptionTier || '—' },
            { key: 'streak', header: 'Streak', render: (u) => u.currentStreakDays },
            { key: 'wallet', header: 'Wallet', render: (u) => u.walletBalance },
            { key: 'status', header: 'Status', render: (u) => getUserStatusLabel(u) },
            {
              key: 'actions',
              header: '',
              render: (u) => (
                <Link href={`/users/${u.id}`} className={linkAccent}>
                  View
                </Link>
              ),
            },
          ]}
        />
      )}
    </AdminShell>
  );
}
