'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, TrendingUp } from 'lucide-react';
import { CategoryChart } from '@/components/features/analytics/charts/category-chart';
import { DropoffChart } from '@/components/features/analytics/charts/dropoff-chart';
import { EisenhowerChart } from '@/components/features/analytics/charts/eisenhower-chart';
import { GrowthChart } from '@/components/features/analytics/charts/growth-chart';
import { RetentionChart } from '@/components/features/analytics/charts/retention-chart';
import { SessionCompletionChart } from '@/components/features/analytics/charts/session-completion-chart';
import { SpacedRepetitionChart } from '@/components/features/analytics/charts/spaced-repetition-chart';
import { AlertMessage } from '@/components/ui/alert-message';
import { ChartCard } from '@/components/ui/chart-card';
import { JsonPanel } from '@/components/ui/json-panel';
import { LoadingState } from '@/components/ui/loading-state';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchAnalytics, selectAnalytics } from '@/lib/store/slices/analytics/analyticsSlice';
import { btn, gridCards } from '@/lib/ui-classes';

export function AnalyticsView() {
  const dispatch = useAppDispatch();
  const { analytics, subjects, error, status } = useAppSelector(selectAnalytics);
  const [showRaw, setShowRaw] = useState(false);

  useEffect(() => {
    dispatch(fetchAnalytics());
  }, [dispatch]);

  const focusScore =
    analytics?.retentionMetrics?.[0]?.focusConsistencyScore ??
    analytics?.retentionMetrics?.[analytics.retentionMetrics.length - 1]?.focusConsistencyScore;

  const loading = status === 'loading' && !analytics;

  return (
    <AdminShell>
      <PageHeader
        title="Analytics"
        description="Growth, retention funnel, and subject insights"
        apiHint="GET /analytics · GET /analytics/subjects"
      />
      <AlertMessage error={error} />

      {loading ? (
        <LoadingState label="Loading analytics..." />
      ) : (
        <>
          <div className={`${gridCards} mb-8`}>
            {subjects ? (
              <MetricCard label="Total subjects" value={subjects.totalSubjects} />
            ) : null}
            {subjects ? (
              <MetricCard
                label="Scheduled sessions"
                value={subjects.schedulingMetrics.scheduledSessions}
              />
            ) : null}
            {subjects ? (
              <MetricCard
                label="Completed sessions"
                value={subjects.schedulingMetrics.completedScheduledSessions}
              />
            ) : null}
            {focusScore !== undefined ? (
              <MetricCard label="Avg focus consistency" value={`${focusScore}%`} />
            ) : null}
          </div>

          {analytics ? (
            <section className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                <TrendingUp className="size-5 text-indigo-500" strokeWidth={2} />
                Platform growth & retention
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Daily growth (last 5 days)"
                  description="New signups vs users who started a session"
                  height={300}
                >
                  <GrowthChart data={analytics.growthPoints} />
                </ChartCard>
                <ChartCard
                  title="Drop-off funnel"
                  description="Share of users who never reached each stage"
                  height={300}
                >
                  <DropoffChart data={analytics.dropoffStages} />
                </ChartCard>
                <ChartCard
                  title="Cohort retention"
                  description="Day 1 / 7 / 30 retention by cohort (sample data)"
                  height={300}
                  className="lg:col-span-2"
                >
                  <RetentionChart data={analytics.retentionMetrics} />
                </ChartCard>
                <ChartCard
                  title="Spaced repetition"
                  description="Learners and completion rate by cadence (sample data)"
                  height={320}
                  className="lg:col-span-2"
                >
                  <SpacedRepetitionChart data={analytics.spacedRepetitionMetrics} />
                </ChartCard>
              </div>
            </section>
          ) : null}

          {subjects ? (
            <section className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Subjects & scheduling
              </h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <ChartCard
                  title="Session completion"
                  description="Completed vs total scheduled sessions"
                  height={280}
                >
                  <SessionCompletionChart
                    scheduled={subjects.schedulingMetrics.scheduledSessions}
                    completed={subjects.schedulingMetrics.completedScheduledSessions}
                  />
                </ChartCard>
                <ChartCard title="Subjects by category" description="Distribution from database">
                  <CategoryChart data={subjects.categoryCounts} />
                </ChartCard>
                <ChartCard
                  title="Eisenhower matrix"
                  description="Task distribution by quadrant (sample data)"
                  height={300}
                  className="lg:col-span-2"
                >
                  <EisenhowerChart data={subjects.eisenhowerDistribution} />
                </ChartCard>
              </div>
            </section>
          ) : null}

          <div className="border-t border-slate-200/80 pt-6 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setShowRaw((v) => !v)}
              className={`${btn} mb-4`}
            >
              {showRaw ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
              {showRaw ? 'Hide' : 'Show'} raw API JSON
            </button>
            {showRaw ? (
              <div className="grid gap-6 lg:grid-cols-2">
                {analytics ? <JsonPanel title="GET /analytics" data={analytics} /> : null}
                {subjects ? <JsonPanel title="GET /analytics/subjects" data={subjects} /> : null}
              </div>
            ) : null}
          </div>
        </>
      )}
    </AdminShell>
  );
}
