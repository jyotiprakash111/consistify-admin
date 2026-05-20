'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { DropoffStage } from '@/lib/types/analytics';
import { ChartTooltipContent } from './chart-tooltip';
import { useChartTheme } from './use-chart-theme';

export function DropoffChart({ data }: { data: DropoffStage[] }) {
  const theme = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal={false} />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickFormatter={(v) => `${v}%`}
        />
        <YAxis
          type="category"
          dataKey="stage"
          width={110}
          tick={{ fill: theme.axis, fontSize: 11 }}
          tickLine={false}
        />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar dataKey="dropOffRate" name="Drop-off %" radius={[0, 4, 4, 0]} maxBarSize={28}>
          {data.map((_, i) => (
            <Cell key={i} fill={theme.series[i % theme.series.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
