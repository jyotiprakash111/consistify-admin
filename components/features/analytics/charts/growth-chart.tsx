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
import type { GrowthPoint } from '@/lib/types/analytics';
import { ChartTooltipContent } from './chart-tooltip';
import { useChartTheme } from './use-chart-theme';

function formatDay(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function GrowthChart({ data }: { data: GrowthPoint[] }) {
  const theme = useChartTheme();
  const chartData = data.map((p) => ({
    ...p,
    label: formatDay(p.date),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis dataKey="label" tick={{ fill: theme.axis, fontSize: 11 }} tickLine={false} />
        <YAxis tick={{ fill: theme.axis, fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ fontSize: 12, color: theme.axis }} />
        <Bar
          dataKey="newUsers"
          name="New users"
          fill={theme.colors.emerald}
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Line
          type="monotone"
          dataKey="activeUsers"
          name="Active users"
          stroke={theme.colors.indigo}
          strokeWidth={2}
          dot={{ r: 4, fill: theme.colors.indigo }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
