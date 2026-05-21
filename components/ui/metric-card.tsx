import type { LucideIcon } from 'lucide-react';
import { NumberCounter } from '@/components/ui/number-counter';
import { card, mutedText } from '@/lib/ui-classes';

export type MetricAccent = 'violet' | 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo';

const accentStyles: Record<
  MetricAccent,
  { icon: string; iconHover: string; cardHover: string; ring: string; value: string }
> = {
  violet: {
    icon: 'bg-violet-500/10 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400',
    iconHover:
      'group-hover:scale-110 group-hover:bg-violet-500/20 group-hover:shadow-md group-hover:shadow-violet-500/20',
    cardHover:
      'hover:border-violet-200/80 hover:bg-violet-50/40 dark:hover:border-violet-500/35 dark:hover:bg-violet-500/[0.07]',
    ring: 'group-hover:ring-violet-500/25',
    value: 'text-violet-700 dark:text-violet-300',
  },
  blue: {
    icon: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400',
    iconHover:
      'group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:shadow-md group-hover:shadow-blue-500/20',
    cardHover:
      'hover:border-blue-200/80 hover:bg-blue-50/40 dark:hover:border-blue-500/35 dark:hover:bg-blue-500/[0.07]',
    ring: 'group-hover:ring-blue-500/25',
    value: 'text-blue-700 dark:text-blue-300',
  },
  emerald: {
    icon: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400',
    iconHover:
      'group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:shadow-md group-hover:shadow-emerald-500/20',
    cardHover:
      'hover:border-emerald-200/80 hover:bg-emerald-50/40 dark:hover:border-emerald-500/35 dark:hover:bg-emerald-500/[0.07]',
    ring: 'group-hover:ring-emerald-500/25',
    value: 'text-emerald-700 dark:text-emerald-300',
  },
  amber: {
    icon: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400',
    iconHover:
      'group-hover:scale-110 group-hover:bg-amber-500/20 group-hover:shadow-md group-hover:shadow-amber-500/20',
    cardHover:
      'hover:border-amber-200/80 hover:bg-amber-50/40 dark:hover:border-amber-500/35 dark:hover:bg-amber-500/[0.07]',
    ring: 'group-hover:ring-amber-500/25',
    value: 'text-amber-700 dark:text-amber-300',
  },
  rose: {
    icon: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400',
    iconHover:
      'group-hover:scale-110 group-hover:bg-rose-500/20 group-hover:shadow-md group-hover:shadow-rose-500/20',
    cardHover:
      'hover:border-rose-200/80 hover:bg-rose-50/40 dark:hover:border-rose-500/35 dark:hover:bg-rose-500/[0.07]',
    ring: 'group-hover:ring-rose-500/25',
    value: 'text-rose-700 dark:text-rose-300',
  },
  indigo: {
    icon: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400',
    iconHover:
      'group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:shadow-md group-hover:shadow-indigo-500/20',
    cardHover:
      'hover:border-indigo-200/80 hover:bg-indigo-50/40 dark:hover:border-indigo-500/35 dark:hover:bg-indigo-500/[0.07]',
    ring: 'group-hover:ring-indigo-500/25',
    value: 'text-indigo-700 dark:text-indigo-300',
  },
};

const cardHoverBase =
  'cursor-default ring-1 ring-transparent transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 active:translate-y-0 active:shadow-md dark:hover:shadow-black/30';

type MetricCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: MetricAccent;
  /** Count up from previous value when numeric */
  animateValue?: boolean;
  decimals?: number;
  /** Secondary line under the value (e.g. trend or %) */
  subtext?: string;
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  accent = 'indigo',
  animateValue = false,
  decimals = 0,
  subtext,
}: MetricCardProps) {
  const styles = accentStyles[accent];

  const valueEl = (
    <div
      className={`text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-white ${Icon ? '' : styles.value}`}
    >
      {typeof value === 'number' || typeof value === 'string' ? (
        <NumberCounter value={value} decimals={decimals} animate={animateValue} />
      ) : (
        value
      )}
    </div>
  );

  const cardClass = `group ${card} ${cardHoverBase} ${styles.cardHover} ${styles.ring}`;

  if (Icon) {
    return (
      <div className={cardClass}>
        <div className="flex items-start gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ease-out ${styles.icon} ${styles.iconHover}`}
          >
            <Icon className="size-5 transition-transform duration-300 group-hover:scale-105" strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div
              className={`${mutedText} text-xs font-medium uppercase tracking-wide transition-colors duration-300 group-hover:text-slate-600 dark:group-hover:text-zinc-300`}
            >
              {label}
            </div>
            <div className="mt-2 transition-transform duration-300 group-hover:translate-x-0.5">
              {valueEl}
              {subtext ? (
                <p className={`${mutedText} mt-1 text-[11px] leading-snug`}>{subtext}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <div
        className={`${mutedText} text-xs font-medium uppercase tracking-wide transition-colors duration-300 group-hover:text-slate-600 dark:group-hover:text-zinc-300`}
      >
        {label}
      </div>
      <div className="mt-3">
        {valueEl}
        {subtext ? (
          <p className={`${mutedText} mt-1 text-[11px] leading-snug`}>{subtext}</p>
        ) : null}
      </div>
    </div>
  );
}

export function MetricCardSkeleton() {
  return (
    <div className={`${card} animate-pulse`}>
      <div className="flex items-start gap-3">
        <div className="size-10 shrink-0 rounded-xl bg-slate-200 dark:bg-zinc-700" />
        <div className="min-w-0 flex-1">
          <div className="h-3 w-24 rounded-md bg-slate-200 dark:bg-zinc-700" />
          <div className="mt-3 h-8 w-20 rounded-lg bg-slate-200 dark:bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}
