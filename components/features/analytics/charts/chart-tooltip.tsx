'use client';

import { useChartTheme } from './use-chart-theme';

type TooltipEntry = {
  name?: string;
  value?: number;
  color?: string;
  dataKey?: string | number;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
};

export function ChartTooltipContent({ active, payload, label }: ChartTooltipProps) {
  const theme = useChartTheme();
  if (!active || !payload?.length) return null;

  return (
    <div
      className="rounded-lg border px-3 py-2 text-xs shadow-lg"
      style={{
        backgroundColor: theme.tooltipBg,
        borderColor: theme.tooltipBorder,
        color: theme.tooltipText,
      }}
    >
      {label ? <p className="mb-1 font-medium">{label}</p> : null}
      {payload.map((entry) => (
        <p key={String(entry.dataKey)} style={{ color: entry.color }}>
          {entry.name}: {entry.value}
          {entry.dataKey === 'dropOffRate' || entry.dataKey === 'completionRate' ? '%' : ''}
        </p>
      ))}
    </div>
  );
}
