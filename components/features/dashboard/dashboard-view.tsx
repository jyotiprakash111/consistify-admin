'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { useCallback, useEffect, useMemo } from 'react';
import { AlertMessage } from '@/components/ui/alert-message';
import { PageHeader } from '@/components/ui/page-header';
import { DashboardAlerts } from '@/components/features/dashboard/dashboard-alerts';
import { DashboardGrowthSection } from '@/components/features/dashboard/dashboard-growth-section';
import { DashboardMetricsGrid } from '@/components/features/dashboard/dashboard-metrics-grid';
import { DashboardQueuesPanel } from '@/components/features/dashboard/dashboard-queues-panel';
import { DashboardQuickLinks } from '@/components/features/dashboard/dashboard-quick-links';
import { DashboardRecentLogs } from '@/components/features/dashboard/dashboard-recent-logs';
import { DashboardSkeleton } from '@/components/features/dashboard/dashboard-skeleton';
import { DashboardToolbar } from '@/components/features/dashboard/dashboard-toolbar';
import { buildDashboardAlerts } from '@/lib/dashboard/build-alerts';
import { ALL_METRIC_SECTIONS } from '@/lib/dashboard/metrics-config';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchDashboard,
  selectDashboard,
  selectDashboardData,
} from '@/lib/store/slices/dashboard/dashboardSlice';
import { mutedText } from '@/lib/ui-classes';

export function DashboardView() {
  const dispatch = useAppDispatch();
  const { error, status } = useAppSelector(selectDashboard);
  const data = useAppSelector(selectDashboardData);

  const loading = status === 'loading' && !data;
  const refreshing = status === 'loading' && Boolean(data);

  const refresh = useCallback(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const alerts = useMemo(
    () => (data?.metrics ? buildDashboardAlerts(data.metrics) : []),
    [data?.metrics],
  );

  const hasGrowth = Boolean(data?.growthPoints?.length);

  return (
    <AdminShell>
      <PageHeader
        title="Dashboard"
        description="Platform overview, queues, and quick actions"
        apiHint="GET /dashboard"
      />

      {data ? (
        <DashboardToolbar
          refreshedAt={data.refreshedAt}
          loading={refreshing}
          onRefresh={refresh}
        />
      ) : null}

      <AlertMessage error={error} />

      {loading ? (
        <DashboardSkeleton />
      ) : data ? (
        <>
          <DashboardAlerts alerts={alerts} />
          <DashboardQuickLinks />

          {ALL_METRIC_SECTIONS.map((section) => (
            <section key={section.id} className="mb-8">
              <h2 className={`${mutedText} mb-3 text-xs font-semibold uppercase tracking-wider`}>
                {section.title}
              </h2>
              <DashboardMetricsGrid metrics={data.metrics} definitions={section.metrics} />
            </section>
          ))}

          <section className="mb-8">
            <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
              {hasGrowth ? (
                <div className="lg:col-span-2">
                  <DashboardGrowthSection
                    growthPoints={data.growthPoints}
                    standalone={false}
                  />
                </div>
              ) : null}
              <div className={hasGrowth ? undefined : 'lg:col-span-3'}>
                <DashboardQueuesPanel
                  metrics={data.metrics}
                  layout={hasGrowth ? 'sidebar' : 'wide'}
                />
              </div>
            </div>
          </section>

          <DashboardRecentLogs logs={data.recentLogs} />
        </>
      ) : null}
    </AdminShell>
  );
}
