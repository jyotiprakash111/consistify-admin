'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { AlertMessage } from '@/components/ui/alert-message';
import { DataTable } from '@/components/ui/data-table';
import { FilterBar } from '@/components/ui/filter-bar';
import { SelectInput, TextInput } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchUsersList,
  selectUsersList,
  setUsersFilter,
} from '@/lib/store/slices/users/usersListSlice';
import { linkAccent, mutedText } from '@/lib/ui-classes';

export function UsersListView() {
  const dispatch = useAppDispatch();
  const { users, filters, error } = useAppSelector(selectUsersList);

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
          value={filters.phone}
          onChange={(e) => dispatch(setUsersFilter({ phone: e.target.value }))}
          placeholder="Search by phone"
        />
        <SelectInput
          value={filters.status}
          onChange={(e) => dispatch(setUsersFilter({ status: e.target.value }))}
        >
          <option value="all">All status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
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
      <p className={`${mutedText} mb-4`}>Showing {users.length} users</p>
      <DataTable
        rows={users}
        rowKey={(u) => u.id}
        emptyMessage="No users match filters"
        columns={[
          { key: 'phone', header: 'Phone', render: (u) => u.phone || u.id },
          { key: 'tier', header: 'Tier', render: (u) => u.subscriptionTier },
          { key: 'streak', header: 'Streak', render: (u) => u.currentStreakDays },
          { key: 'wallet', header: 'Wallet', render: (u) => u.walletBalance },
          {
            key: 'status',
            header: 'Status',
            render: (u) => (u.isDisabled ? 'Disabled' : u.isActive ? 'Active' : 'Inactive'),
          },
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
    </AdminShell>
  );
}
