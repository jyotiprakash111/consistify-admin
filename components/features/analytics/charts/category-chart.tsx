'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { CategoryCount } from '@/lib/types/analytics';
import { ChartTooltipContent } from './chart-tooltip';
import { useChartTheme } from './use-chart-theme';

export function CategoryChart({ data }: { data: CategoryCount[] }) {
  const theme = useChartTheme();

  if (!data.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No subject categories yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={56}
          outerRadius={88}
          paddingAngle={2}
          label={(props) => {
            const name = String(props.name ?? props.payload?.category ?? '');
            return `${name} ${((props.percent ?? 0) * 100).toFixed(0)}%`;
          }}
          labelLine={{ stroke: theme.axis }}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={theme.series[i % theme.series.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltipContent />} />
        <Legend wrapperStyle={{ fontSize: 12, color: theme.axis }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
