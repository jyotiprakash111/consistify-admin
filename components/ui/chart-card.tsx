import type { ReactNode } from 'react';
import { card, mutedText } from '@/lib/ui-classes';

type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  height?: number;
};

export function ChartCard({
  title,
  description,
  children,
  className = '',
  height = 280,
}: ChartCardProps) {
  return (
    <section className={`${card} ${className}`}>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {description ? <p className={`${mutedText} mt-1 mb-4`}>{description}</p> : <div className="mb-4" />}
      <div style={{ width: '100%', height }} className="min-w-0">
        {children}
      </div>
    </section>
  );
}

export function ChartCardSkeleton({
  className = '',
  height = 280,
}: {
  className?: string;
  height?: number;
}) {
  return (
    <section className={`${card} animate-pulse ${className}`}>
      <div className="h-4 w-44 rounded-md bg-slate-200 dark:bg-zinc-700" />
      <div className="mt-2 mb-4 h-3 w-64 max-w-full rounded-md bg-slate-200 dark:bg-zinc-700" />
      <div
        className="w-full rounded-xl bg-slate-200/90 dark:bg-zinc-800"
        style={{ height }}
      />
    </section>
  );
}
