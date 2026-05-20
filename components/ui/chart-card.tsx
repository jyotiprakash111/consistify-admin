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
