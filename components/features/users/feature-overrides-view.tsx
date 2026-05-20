'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { AlertMessage } from '@/components/ui/alert-message';
import { DataTable } from '@/components/ui/data-table';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchFeatureOverrides,
  selectFeatureOverrides,
} from '@/lib/store/slices/users/featureOverridesSlice';
import { linkAccent, mutedText } from '@/lib/ui-classes';

export function FeatureOverridesView() {
  const dispatch = useAppDispatch();
  const { rows, error } = useAppSelector(selectFeatureOverrides);

  useEffect(() => {
    dispatch(fetchFeatureOverrides());
  }, [dispatch]);

  const bool = (v: boolean) => (v ? 'Yes' : 'No');

  return (
    <AdminShell>
      <PageHeader
        title="Feature overrides"
        description="Per-user wallet, badges, and notification flags"
        apiHint="GET /users/feature-overrides"
      />
      <AlertMessage error={error} />
      <DataTable
        rows={rows}
        rowKey={(r) => r.userId}
        emptyMessage="No overrides loaded"
        columns={[
          {
            key: 'user',
            header: 'User',
            render: (r) => (
              <Link href={`/users/${r.userId}`} className={linkAccent}>
                {r.userId}
              </Link>
            ),
          },
          { key: 'wallet', header: 'Wallet', render: (r) => bool(r.walletEnabled) },
          { key: 'badges', header: 'Badges', render: (r) => bool(r.badgeRewardsEnabled) },
          { key: 'email', header: 'Email', render: (r) => bool(r.emailNotificationsEnabled) },
          { key: 'push', header: 'Push', render: (r) => bool(r.pushNotificationsEnabled) },
          {
            key: 'edit',
            header: '',
            render: (r) => (
              <Link href={`/users/${r.userId}`} className={`text-sm ${mutedText} ${linkAccent}`}>
                Edit on profile
              </Link>
            ),
          },
        ]}
      />
    </AdminShell>
  );
}
