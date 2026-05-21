import type { LucideIcon } from 'lucide-react';
import { AnimatedNumber } from '@/components/ui/animated-number';
import { card, mutedText } from '@/lib/ui-classes';

export type MetricAccent = 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';

const accentStyles: Record<
  MetricAccent,
  { icon: string; ring: string; value: string }
> = {
  violet: {
    icon: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    ring: 'group-hover:ring-violet-500/20',
    value: 'text-violet-700 dark:text-violet-300',
  },
  blue: {
    icon: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    ring: 'group-hover:ring-blue-500/20',
    value: 'text-blue-700 dark:text-blue-300',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    ring: 'group-hover:ring-emerald-500/20',
    value: 'text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    ring: 'group-hover:ring-amber-500/20',
    value: 'text-amber-700 dark:text-amber-300',
  },
  rose: {
    icon: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    ring: 'group-hover:ring-rose-500/20',
    value: 'text-rose-700 dark:text-rose-300',
  },
  indigo: {
    icon: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    ring: 'group-hover:ring-indigo-500/20',
    value: 'text-indigo-700 dark:text-indigo-300',
  },
};

type MetricCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: MetricAccent;
  /** Count up from previous value when numeric */
  animateValue?: boolean;
  decimals?: number;
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  accent = 'indigo',
  animateValue = false,
  decimals = 0,
}: MetricCardProps) {
  const styles = accentStyles[accent];

  return (
    <div
      className={`group ${card} ring-1 ring-transparent transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-black/20 ${styles.ring}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`${mutedText} text-xs font-medium uppercase tracking-wide`}>{label}</div>
        {Icon ? (
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${styles.icon}`}
          >
            <Icon className="size-4" strokeWidth={2} />
          </div>
        ) : null}
      </div>
      <div
        className={`mt-3 text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white ${Icon ? '' : styles.value}`}
      >
        {animateValue && typeof value === 'number' ? (
          <AnimatedNumber value={value} decimals={decimals} />
        ) : (
          value
        )}
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className={`${card} animate-pulse`}>
      <div className="flex items-start justify-between">
        <div className="h-3 w-24 rounded-md bg-slate-200 dark:bg-zinc-700" />
        <div className="size-9 rounded-xl bg-slate-200 dark:bg-zinc-700" />
      </div>
      <div className="mt-4 h-8 w-20 rounded-lg bg-slate-200 dark:bg-zinc-700" />
    </div>
  );
}
