'use client';

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SpacedRepetitionMetric } from '@/lib/types/analytics';
import { ChartTooltipContent } from './chart-tooltip';
import { useChartTheme } from './use-chart-theme';

export function SpacedRepetitionChart({ data }: { data: SpacedRepetitionMetric[] }) {
  const theme = useChartTheme();
  const chartData = data.map((d) => ({
    ...d,
    label: `${d.cadenceDays}d · ${d.trophyLabel}`,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: theme.axis, fontSize: 10 }} interval={0} angle={-12} textAnchor="end" height={56} />
        <YAxis yAxisId="left" tick={{ fill: theme.axis, fontSize: 11 }} />
        <YAxis
          yAxisId="right"
          orientation="right"
          domain={[0, 100]}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ fontSize: 12, color: theme.axis }} />
        <Bar
          yAxisId="left"
          dataKey="activeLearners"
          name="Active learners"
          fill={theme.colors.sky}
          radius={[4, 4, 0, 0]}
          maxBarSize={48}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="completionRate"
          name="Completion %"
          stroke={theme.colors.violet}
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
