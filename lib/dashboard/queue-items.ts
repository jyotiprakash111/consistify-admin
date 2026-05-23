import type { LucideIcon } from 'lucide-react';
import { CalendarClock, ScanLine } from 'lucide-react';
import type { MetricAccent } from '@/components/ui/metric-card';
import type { DashboardMetrics } from '@/lib/types/dashboard';

export type QueueItemDefinition = {
  metricKey: keyof Pick<DashboardMetrics, 'pendingExtraLeaves' | 'pendingOcrSubmissions'>;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent: MetricAccent;
  ctaLabel: string;
};

export const DASHBOARD_QUEUE_ITEMS: QueueItemDefinition[] = [
  {
    metricKey: 'pendingExtraLeaves',
    label: 'Leaves',
    description: 'Awaiting admin approval',
    href: '/leaves',
    icon: CalendarClock,
    accent: 'amber',
    ctaLabel: 'Open queue',
  },
  {
    metricKey: 'pendingOcrSubmissions',
    label: 'OCR submissions',
    description: 'Pending review or correction',
    href: '/ocr',
    icon: ScanLine,
    accent: 'blue',
    ctaLabel: 'Open OCR',
  },
];

const accentIconBg: Record<MetricAccent, string> = {
  violet: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
  blue: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
};

const accentCount: Record<MetricAccent, string> = {
  violet: 'text-violet-700 dark:text-violet-300',
  blue: 'text-blue-700 dark:text-blue-300',
  emerald: 'text-emerald-700 dark:text-emerald-300',
  amber: 'text-amber-700 dark:text-amber-300',
  rose: 'text-rose-700 dark:text-rose-300',
  indigo: 'text-indigo-700 dark:text-indigo-300',
};

const accentBorderHover: Record<MetricAccent, string> = {
  violet: 'hover:border-violet-200 dark:hover:border-violet-500/40',
  blue: 'hover:border-blue-200 dark:hover:border-blue-500/40',
  emerald: 'hover:border-emerald-200 dark:hover:border-emerald-500/40',
  amber: 'hover:border-amber-200 dark:hover:border-amber-500/40',
  rose: 'hover:border-rose-200 dark:hover:border-rose-500/40',
  indigo: 'hover:border-indigo-200 dark:hover:border-indigo-500/40',
};

export function queueItemStyles(accent: MetricAccent) {
  return {
    icon: accentIconBg[accent],
    count: accentCount[accent],
    borderHover: accentBorderHover[accent],
  };
}
