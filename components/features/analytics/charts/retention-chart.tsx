'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { RetentionMetric } from '@/lib/types/analytics';
import { ChartTooltipContent } from './chart-tooltip';
import { useChartTheme } from './use-chart-theme';

export function RetentionChart({ data }: { data: RetentionMetric[] }) {
  const theme = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis dataKey="cohortLabel" tick={{ fill: theme.axis, fontSize: 11 }} />
        <YAxis
          domain={[0, 100]}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ fontSize: 12, color: theme.axis }} />
        <Bar dataKey="day1Retention" name="Day 1" fill={theme.colors.indigo} radius={[4, 4, 0, 0]} />
        <Bar dataKey="day7Retention" name="Day 7" fill={theme.colors.emerald} radius={[4, 4, 0, 0]} />
        <Bar dataKey="day30Retention" name="Day 30" fill={theme.colors.amber} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
