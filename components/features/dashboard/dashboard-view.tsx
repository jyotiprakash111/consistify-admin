'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { useEffect } from 'react';
import { AlertMessage } from '@/components/ui/alert-message';
import { MetricCard, MetricCardSkeleton } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchDashboard, selectDashboard } from '@/lib/store/slices/dashboard/dashboardSlice';
import type { DashboardMetrics } from '@/lib/types/admin';
import { gridCards } from '@/lib/ui-classes';

const METRIC_LABELS: Record<keyof DashboardMetrics, string> = {
  totalUsers: 'Total users',
  activeToday: 'Active today',
  focusSessionsToday: 'Focus sessions today',
  focusSessionsWeek: 'Focus sessions (7d)',
  totalFocusTimeHours: 'Focus time (hours)',
  totalWalletDeposits: 'Total wallet deposits',
  totalActiveBalances: 'Active wallet balances',
  failedIncompleteSessions: 'Failed / incomplete (24h)',
};

const METRIC_DECIMALS: Partial<Record<keyof DashboardMetrics, number>> = {
  totalFocusTimeHours: 1,
};

export function DashboardView() {
  const dispatch = useAppDispatch();
  const { metrics, error, status } = useAppSelector(selectDashboard);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <AdminShell>
      <PageHeader title="Dashboard" description="Platform-wide metrics" apiHint="GET /dashboard" />
      <AlertMessage error={error} />
      {metrics ? (
        <div className={gridCards}>
          {(Object.keys(METRIC_LABELS) as Array<keyof DashboardMetrics>).map((key) => (
            <MetricCard
              key={key}
              label={METRIC_LABELS[key]}
              value={metrics[key]}
              animateValue
              decimals={METRIC_DECIMALS[key] ?? 0}
            />
          ))}
        </div>
      ) : status === 'loading' ? (
        <div className={gridCards}>
          {Array.from({ length: 8 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))}
        </div>
      ) : null}
    </AdminShell>
  );
}
