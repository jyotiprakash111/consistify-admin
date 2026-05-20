'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme, type Theme } from '@/components/providers/theme-provider';
import { btn } from '@/lib/ui-classes';

const options: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'system', icon: Monitor, label: 'System' },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    const next: Theme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';
    const Icon = theme === 'dark' ? Moon : theme === 'light' ? Sun : Monitor;
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        className={`${btn} !p-2.5`}
        title={`Theme: ${theme}. Click to switch.`}
        aria-label="Toggle theme"
      >
        <Icon className="size-4" strokeWidth={2} />
      </button>
    );
  }

  return (
    <div
      className="inline-flex rounded-lg border border-slate-200/80 bg-slate-100/80 p-0.5 dark:border-slate-700 dark:bg-slate-800/80"
      role="group"
      aria-label="Theme"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all duration-200 ${
            theme === value
              ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white'
              : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
          title={label}
        >
          <Icon className="size-3.5" strokeWidth={2} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
