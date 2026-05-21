import type { AdminLog } from '@/lib/types/admin';
import type { GrowthPoint } from '@/lib/types/analytics';
import type { DashboardMetrics, DashboardPayload } from '@/lib/types/dashboard';

/** Legacy shape from GET /dashboard before enriched payload */
type LegacyDashboardMetrics = Partial<DashboardMetrics> & {
  totalUsers?: number;
  activeToday?: number;
  focusSessionsToday?: number;
  focusSessionsWeek?: number;
  totalFocusTimeHours?: number;
  totalWalletDeposits?: number;
  totalActiveBalances?: number;
  failedIncompleteSessions?: number;
};

type RawDashboardResponse = {
  metrics?: LegacyDashboardMetrics;
  growthPoints?: GrowthPoint[];
  recentLogs?: AdminLog[];
  refreshedAt?: string;
};

function num(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function normalizeMetrics(raw: LegacyDashboardMetrics | undefined): DashboardMetrics {
  const totalUsers = num(raw?.totalUsers);
  const activeToday = num(raw?.activeToday);
  const activeTodayPercent =
    typeof raw?.activeTodayPercent === 'number'
      ? raw.activeTodayPercent
      : totalUsers > 0
        ? Math.round((activeToday / totalUsers) * 100)
        : 0;

  return {
    totalUsers,
    activeToday,
    activeTodayPercent,
    newUsersToday: num(raw?.newUsersToday),
    newUsersWeek: num(raw?.newUsersWeek),
    disabledUsers: num(raw?.disabledUsers),
    focusSessionsToday: num(raw?.focusSessionsToday),
    focusSessionsYesterday: num(raw?.focusSessionsYesterday),
    focusSessionsWeek: num(raw?.focusSessionsWeek),
    totalFocusTimeHours: num(raw?.totalFocusTimeHours),
    totalWalletDeposits: num(raw?.totalWalletDeposits),
    totalActiveBalances: num(raw?.totalActiveBalances),
    failedIncompleteSessions: num(raw?.failedIncompleteSessions),
    pendingExtraLeaves: num(raw?.pendingExtraLeaves),
    pendingOcrSubmissions: num(raw?.pendingOcrSubmissions),
    totalFineCollected: num(raw?.totalFineCollected),
  };
}

/** Coerce API response (including pre-enrichment backend) into a safe DashboardPayload. */
export function normalizeDashboardPayload(raw: RawDashboardResponse): DashboardPayload {
  return {
    metrics: normalizeMetrics(raw.metrics),
    growthPoints: Array.isArray(raw.growthPoints) ? raw.growthPoints : [],
    recentLogs: Array.isArray(raw.recentLogs) ? raw.recentLogs : [],
    refreshedAt:
      typeof raw.refreshedAt === 'string' && raw.refreshedAt
        ? raw.refreshedAt
        : new Date().toISOString(),
  };
}
