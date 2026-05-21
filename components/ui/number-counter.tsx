'use client';

import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Coerce API / JSON values to a finite number for display */
export function coerceCounterValue(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

export function formatCounterValue(value: number, decimals = 0) {
  if (!Number.isFinite(value)) return '0';
  if (decimals > 0) {
    return value.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }
  return Math.round(value).toLocaleString('en-IN');
}

export type NumberCounterProps = {
  value: number | string;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** Count up from 0 (first paint) or previous value; respects prefers-reduced-motion */
  animate?: boolean;
};

export function NumberCounter({
  value,
  decimals = 0,
  duration = 900,
  prefix = '',
  suffix = '',
  className,
  animate = true,
}: NumberCounterProps) {
  const target = coerceCounterValue(value);
  const [display, setDisplay] = useState(() => (animate ? 0 : target));
  const fromRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (frameRef.current != null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    if (!animate) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      fromRef.current = target;
      setDisplay(target);
      return;
    }

    const from = fromRef.current;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = from + (target - from) * easeOutCubic(progress);
      setDisplay(next);
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
        setDisplay(target);
        frameRef.current = null;
      }
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current != null) cancelAnimationFrame(frameRef.current);
    };
  }, [target, duration, animate]);

  const text = `${prefix}${formatCounterValue(display, decimals)}${suffix}`;

  return <span className={className}>{text}</span>;
}
