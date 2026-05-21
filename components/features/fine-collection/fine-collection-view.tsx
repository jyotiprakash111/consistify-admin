'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import Link from 'next/link';
import { useEffect } from 'react';
import { AlertMessage } from '@/components/ui/alert-message';
import { CardSection } from '@/components/ui/card-section';
import { DataTable } from '@/components/ui/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { MetricCard, MetricCardSkeleton } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchFineCollection,
  selectFineCollection,
} from '@/lib/store/slices/fine-collection/fineCollectionSlice';
import { card, gridCards, linkAccent, mutedText } from '@/lib/ui-classes';

export function FineCollectionView() {
  const dispatch = useAppDispatch();
  const { summary, users, error, status } = useAppSelector(selectFineCollection);
  const loading = status === 'loading';

  useEffect(() => {
    dispatch(fetchFineCollection());
  }, [dispatch]);

  return (
    <AdminShell>
      <PageHeader
        title="Fine collection"
        description="Wallet vs fines and refund exposure"
        apiHint="GET /fine-collection/summary · GET /fine-collection/users"
      />
      <AlertMessage error={error} />

      {loading ? (
        <>
          <div className={`${gridCards} mb-6`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <MetricCardSkeleton key={i} />
            ))}
          </div>
          <div className={`${card} mb-6 animate-pulse`}>
            <div className="mb-4 h-4 w-16 rounded-md bg-slate-200 dark:bg-zinc-700" />
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-3 w-full max-w-md rounded-md bg-slate-200 dark:bg-zinc-700" />
              ))}
            </div>
          </div>
        </>
      ) : summary ? (
        <>
          <div className={`${gridCards} mb-6`}>
            <MetricCard label="Total wallet balance" value={summary.totalWalletBalance} />
            <MetricCard label="Total fines collected" value={summary.totalFineCollected} />
            <MetricCard label="Applicable today" value={summary.totalApplicableToday} />
            <MetricCard label="Difference as of today" value={summary.differenceAsOfToday} />
          </div>
          <CardSection title="Notes">
            {Object.entries(summary.descriptions).map(([key, text]) => (
              <p key={key} className={`${mutedText} mb-1 dark:text-zinc-400`}>
                <span className="font-medium text-slate-700 dark:text-zinc-300">{key}:</span> {text}
              </p>
            ))}
          </CardSection>
        </>
      ) : null}

      <div className="mt-8">
        <h3 className="mb-3 text-lg font-semibold text-slate-800 dark:text-zinc-100">Accounts</h3>
        {loading ? (
          <DataTableSkeleton columns={6} rows={8} />
        ) : (
          <DataTable
            rows={users}
            rowKey={(u) => u.userId}
            emptyMessage="No accounts"
            columns={[
              {
                key: 'user',
                header: 'User',
                render: (u) => (
                  <Link href={`/users/${u.userId}`} className={linkAccent}>
                    {u.userName || u.userId}
                  </Link>
                ),
              },
              { key: 'plan', header: 'Plan', render: (u) => u.plan },
              { key: 'wallet', header: 'Wallet', render: (u) => u.walletBalance },
              { key: 'fines', header: 'Fines', render: (u) => u.fineCollected },
              { key: 'applicable', header: 'Applicable today', render: (u) => u.applicableToday },
              { key: 'diff', header: 'Difference', render: (u) => u.difference },
            ]}
          />
        )}
      </div>
    </AdminShell>
  );
}
