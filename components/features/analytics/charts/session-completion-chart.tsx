'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartTooltipContent } from './chart-tooltip';
import { useChartTheme } from './use-chart-theme';

type Props = {
  scheduled: number;
  completed: number;
};

export function SessionCompletionChart({ scheduled, completed }: Props) {
  const theme = useChartTheme();
  const incomplete = Math.max(0, scheduled - completed);
  const data = [
    { name: 'Completed', value: completed },
    { name: 'Other', value: incomplete },
  ].filter((d) => d.value > 0);

  if (!data.length) {
    return <p className="text-sm text-slate-500 dark:text-slate-400">No session data</p>;
  }

  const rate = scheduled > 0 ? Math.round((completed / scheduled) * 100) : 0;

  return (
    <div className="relative h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={64}
            outerRadius={88}
            startAngle={90}
            endAngle={-270}
          >
            <Cell fill={theme.colors.emerald} />
            <Cell fill={theme.colors.slate} />
          </Pie>
          <Tooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">{rate}%</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">completion</span>
      </div>
    </div>
  );
}
