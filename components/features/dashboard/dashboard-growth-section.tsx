'use client';

import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { GrowthChart } from '@/components/features/analytics/charts/growth-chart';
import { ChartCard } from '@/components/ui/chart-card';
import type { GrowthPoint } from '@/lib/types/analytics';
import { linkAccent } from '@/lib/ui-classes';

type DashboardGrowthSectionProps = {
  growthPoints?: GrowthPoint[] | null;
  /** When false, omits bottom margin (e.g. inside a grid row). */
  standalone?: boolean;
};

export function DashboardGrowthSection({
  growthPoints,
  standalone = true,
}: DashboardGrowthSectionProps) {
  const points: GrowthPoint[] = Array.isArray(growthPoints) ? growthPoints : [];
  if (points.length === 0) return null;

  return (
    <section className={standalone ? 'mb-8' : ''}>
      <ChartCard
        title="Growth (last 5 days)"
        description="New signups and distinct users with sessions per day"
        height={240}
      >
        <GrowthChart data={points} />
      </ChartCard>
      <p className="mt-2 text-right">
        <Link href="/analytics" className={`${linkAccent} inline-flex items-center gap-1 text-xs`}>
          <TrendingUp className="size-3.5" strokeWidth={2} />
          Full analytics
        </Link>
      </p>
    </section>
  );
}
