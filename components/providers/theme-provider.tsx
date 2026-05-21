'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export type Theme = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = 'persistify-admin-theme';

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(resolved);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  const resolve = useCallback((value: Theme) => {
    return value === 'system' ? getSystemTheme() : value;
  }, []);

  const setTheme = useCallback((value: Theme) => {
    setThemeState(value);
    localStorage.setItem(STORAGE_KEY, value);
    const resolved = resolve(value);
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [resolve]);

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? 'system';
    setThemeState(stored);
    const resolved = resolve(stored);
    setResolvedTheme(resolved);
    applyTheme(resolved);

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (stored === 'system') {
        const next = getSystemTheme();
        setResolvedTheme(next);
        applyTheme(next);
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [resolve]);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div className="min-h-screen">{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
