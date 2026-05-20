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
import type { EisenhowerQuadrant } from '@/lib/types/analytics';
import { ChartTooltipContent } from './chart-tooltip';
import { useChartTheme } from './use-chart-theme';

const QUADRANT_COLORS: Record<string, number> = {
  UI: 0,
  UNI: 1,
  NUI: 2,
  NUNI: 3,
};

export function EisenhowerChart({ data }: { data: EisenhowerQuadrant[] }) {
  const theme = useChartTheme();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 48 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: theme.axis, fontSize: 10 }}
          interval={0}
          angle={-18}
          textAnchor="end"
          height={72}
        />
        <YAxis tick={{ fill: theme.axis, fontSize: 11 }} allowDecimals={false} />
        <Tooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry) => {
            const idx = QUADRANT_COLORS[entry.quadrant] ?? 0;
            return <Cell key={entry.quadrant} fill={theme.series[idx % theme.series.length]} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
