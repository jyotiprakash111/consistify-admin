'use client';

import Link from 'next/link';
import { AlertCircle, AlertTriangle, ChevronRight, Info } from 'lucide-react';
import type { DashboardAlert, DashboardAlertSeverity } from '@/lib/types/dashboard';
import { mutedText } from '@/lib/ui-classes';

const severityStyles: Record<
  DashboardAlertSeverity,
  { border: string; bg: string; icon: typeof Info; iconClass: string }
> = {
  critical: {
    border: 'border-rose-200 dark:border-rose-500/30',
    bg: 'bg-rose-50/80 dark:bg-rose-500/10',
    icon: AlertTriangle,
    iconClass: 'text-rose-600 dark:text-rose-400',
  },
  warning: {
    border: 'border-amber-200 dark:border-amber-500/30',
    bg: 'bg-amber-50/80 dark:bg-amber-500/10',
    icon: AlertCircle,
    iconClass: 'text-amber-600 dark:text-amber-400',
  },
  info: {
    border: 'border-slate-200 dark:border-zinc-700',
    bg: 'bg-slate-50/80 dark:bg-zinc-800/50',
    icon: Info,
    iconClass: 'text-slate-500 dark:text-zinc-400',
  },
};

type DashboardAlertsProps = {
  alerts: DashboardAlert[];
};

export function DashboardAlerts({ alerts }: DashboardAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <section className="mb-8 space-y-3" aria-label="Action required">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
        Action required
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {alerts.map((alert) => {
          const style = severityStyles[alert.severity];
          const Icon = style.icon;
          return (
            <li key={alert.id}>
              <Link
                href={alert.href}
                className={`group flex items-start gap-3 rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${style.border} ${style.bg}`}
              >
                <Icon className={`mt-0.5 size-5 shrink-0 ${style.iconClass}`} strokeWidth={2} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                    {alert.title}
                  </p>
                  <p className={`${mutedText} mt-0.5 text-xs`}>{alert.message}</p>
                  {alert.ctaLabel ? (
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-indigo-600 group-hover:underline dark:text-indigo-400">
                      {alert.ctaLabel}
                      <ChevronRight className="size-3.5" strokeWidth={2} />
                    </span>
                  ) : null}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
