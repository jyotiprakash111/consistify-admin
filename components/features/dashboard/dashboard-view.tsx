'use client';

import { useEffect } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { AlertMessage } from '@/components/ui/alert-message';
import { MetricCard } from '@/components/ui/metric-card';
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
            <MetricCard key={key} label={METRIC_LABELS[key]} value={metrics[key]} />
          ))}
        </div>
      ) : status === 'loading' ? (
        <p className="text-sm text-slate-500">Loading metrics...</p>
      ) : null}
    </AdminShell>
  );
}
