import type { AdminLog } from '@/lib/types/admin';
import type { GrowthPoint } from '@/lib/types/analytics';

export type DashboardMetrics = {
  totalUsers: number;
  activeToday: number;
  activeTodayPercent: number;
  newUsersToday: number;
  newUsersWeek: number;
  disabledUsers: number;
  focusSessionsToday: number;
  focusSessionsYesterday: number;
  focusSessionsWeek: number;
  totalFocusTimeHours: number;
  totalWalletDeposits: number;
  totalActiveBalances: number;
  failedIncompleteSessions: number;
  pendingExtraLeaves: number;
  pendingOcrSubmissions: number;
  totalFineCollected: number;
};

export type DashboardPayload = {
  metrics: DashboardMetrics;
  growthPoints: GrowthPoint[];
  recentLogs: AdminLog[];
  refreshedAt: string;
};

export type DashboardAlertSeverity = 'info' | 'warning' | 'critical';

export type DashboardAlert = {
  id: string;
  severity: DashboardAlertSeverity;
  title: string;
  message: string;
  href: string;
  ctaLabel?: string;
};
