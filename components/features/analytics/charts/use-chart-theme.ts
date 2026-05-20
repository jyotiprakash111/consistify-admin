'use client';

import { useTheme } from '@/components/providers/theme-provider';

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return {
    isDark,
    grid: isDark ? '#334155' : '#e2e8f0',
    axis: isDark ? '#94a3b8' : '#64748b',
    tooltipBg: isDark ? '#1e293b' : '#ffffff',
    tooltipBorder: isDark ? '#475569' : '#e2e8f0',
    tooltipText: isDark ? '#f1f5f9' : '#0f172a',
    colors: {
      indigo: isDark ? '#818cf8' : '#4f46e5',
      emerald: isDark ? '#34d399' : '#059669',
      amber: isDark ? '#fbbf24' : '#d97706',
      rose: isDark ? '#fb7185' : '#e11d48',
      sky: isDark ? '#38bdf8' : '#0284c7',
      violet: isDark ? '#a78bfa' : '#7c3aed',
      slate: isDark ? '#94a3b8' : '#64748b',
    },
    series: isDark
      ? ['#818cf8', '#34d399', '#fbbf24', '#fb7185', '#38bdf8', '#a78bfa']
      : ['#4f46e5', '#059669', '#d97706', '#e11d48', '#0284c7', '#7c3aed'],
  };
}
