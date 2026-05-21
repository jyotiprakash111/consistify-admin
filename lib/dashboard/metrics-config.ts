import type { LucideIcon } from 'lucide-react';
import {
  AlertTriangle,
  CalendarRange,
  CircleDollarSign,
  Clock,
  Target,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  Wallet,
} from 'lucide-react';
import type { MetricAccent } from '@/components/ui/metric-card';
import type { DashboardMetrics } from '@/lib/types/dashboard';

export type DashboardMetricKey = keyof DashboardMetrics;

export type MetricDefinition = {
  key: DashboardMetricKey;
  label: string;
  icon: LucideIcon;
  accent: MetricAccent;
  decimals?: number;
  /** Shown under the value when present */
  hint?: (metrics: DashboardMetrics) => string | undefined;
};

/** Primary KPI row — headline numbers */
export const PRIMARY_METRICS: MetricDefinition[] = [
  {
    key: 'totalUsers',
    label: 'Total users',
    icon: Users,
    accent: 'violet',
  },
  {
    key: 'activeToday',
    label: 'Active today',
    icon: UserCheck,
    accent: 'emerald',
    hint: (m) => `${m.activeTodayPercent}% of all users`,
  },
  {
    key: 'newUsersToday',
    label: 'New signups today',
    icon: UserPlus,
    accent: 'blue',
    hint: (m) => `${m.newUsersWeek} this week`,
  },
  {
    key: 'focusSessionsToday',
    label: 'Sessions today',
    icon: Target,
    accent: 'indigo',
    hint: (m) => {
      const delta = m.focusSessionsToday - m.focusSessionsYesterday;
      if (delta === 0) return 'Same as yesterday';
      const sign = delta > 0 ? '+' : '';
      return `${sign}${delta} vs yesterday`;
    },
  },
];

/** Secondary row — operations & platform health */
export const SECONDARY_METRICS: MetricDefinition[] = [
  {
    key: 'focusSessionsWeek',
    label: 'Sessions (7d)',
    icon: CalendarRange,
    accent: 'indigo',
  },
  {
    key: 'totalFocusTimeHours',
    label: 'Focus time (hours)',
    icon: Clock,
    accent: 'amber',
    decimals: 1,
  },
  {
    key: 'totalWalletDeposits',
    label: 'Wallet deposits',
    icon: Wallet,
    accent: 'emerald',
  },
  {
    key: 'totalActiveBalances',
    label: 'Active balances',
    icon: CircleDollarSign,
    accent: 'violet',
  },
  {
    key: 'totalFineCollected',
    label: 'Fines collected',
    icon: CircleDollarSign,
    accent: 'amber',
  },
  {
    key: 'disabledUsers',
    label: 'Disabled / inactive',
    icon: UserMinus,
    accent: 'rose',
  },
  {
    key: 'failedIncompleteSessions',
    label: 'Failed / incomplete (24h)',
    icon: AlertTriangle,
    accent: 'rose',
  },
];

export const ALL_METRIC_SECTIONS = [
  { id: 'primary', title: 'Overview', metrics: PRIMARY_METRICS },
  { id: 'secondary', title: 'Platform health', metrics: SECONDARY_METRICS },
] as const;
