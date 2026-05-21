import type { DashboardAlert, DashboardMetrics } from '@/lib/types/dashboard';

/**
 * Derives actionable alerts from metrics (pure, testable, no I/O).
 * Order: critical → warning → info.
 */
export function buildDashboardAlerts(metrics: DashboardMetrics): DashboardAlert[] {
  const alerts: DashboardAlert[] = [];

  if (metrics.pendingExtraLeaves > 0) {
    alerts.push({
      id: 'extra-leaves',
      severity: 'warning',
      title: 'Extra leave approvals',
      message: `${metrics.pendingExtraLeaves} request${metrics.pendingExtraLeaves === 1 ? '' : 's'} waiting for review.`,
      href: '/extra-leaves',
      ctaLabel: 'Review queue',
    });
  }

  if (metrics.pendingOcrSubmissions > 0) {
    alerts.push({
      id: 'ocr-pending',
      severity: 'warning',
      title: 'OCR submissions',
      message: `${metrics.pendingOcrSubmissions} pending submission${metrics.pendingOcrSubmissions === 1 ? '' : 's'} need attention.`,
      href: '/ocr',
      ctaLabel: 'Open OCR',
    });
  }

  if (metrics.failedIncompleteSessions > 0) {
    alerts.push({
      id: 'failed-sessions',
      severity: metrics.failedIncompleteSessions >= 10 ? 'critical' : 'warning',
      title: 'Session failures (24h)',
      message: `${metrics.failedIncompleteSessions} failed or abandoned session${metrics.failedIncompleteSessions === 1 ? '' : 's'} in the last day.`,
      href: '/analytics',
      ctaLabel: 'View analytics',
    });
  }

  if (metrics.disabledUsers > 0) {
    alerts.push({
      id: 'disabled-users',
      severity: 'info',
      title: 'Disabled accounts',
      message: `${metrics.disabledUsers} user${metrics.disabledUsers === 1 ? '' : 's'} disabled or marked inactive.`,
      href: '/users',
      ctaLabel: 'Browse users',
    });
  }

  const severityOrder: Record<DashboardAlert['severity'], number> = {
    critical: 0,
    warning: 1,
    info: 2,
  };

  return alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}
