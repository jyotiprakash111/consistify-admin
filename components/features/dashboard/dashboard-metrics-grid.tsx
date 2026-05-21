'use client';

import { MetricCard } from '@/components/ui/metric-card';
import type { MetricDefinition } from '@/lib/dashboard/metrics-config';
import type { DashboardMetrics } from '@/lib/types/dashboard';
import { gridCards } from '@/lib/ui-classes';

type DashboardMetricsGridProps = {
  metrics: DashboardMetrics;
  definitions: MetricDefinition[];
  animate?: boolean;
};

export function DashboardMetricsGrid({
  metrics,
  definitions,
  animate = true,
}: DashboardMetricsGridProps) {
  return (
    <div className={gridCards}>
      {definitions.map((def) => (
        <MetricCard
          key={def.key}
          label={def.label}
          value={metrics[def.key]}
          icon={def.icon}
          accent={def.accent}
          animateValue={animate}
          decimals={def.decimals ?? 0}
          subtext={def.hint?.(metrics)}
        />
      ))}
    </div>
  );
}
