'use client';

import { NumberCounter, type NumberCounterProps } from '@/components/ui/number-counter';

/** @deprecated Prefer NumberCounter */
export type AnimatedNumberProps = Pick<
  NumberCounterProps,
  'value' | 'duration' | 'decimals' | 'className'
>;

export function AnimatedNumber({ value, duration, decimals, className }: AnimatedNumberProps) {
  return (
    <NumberCounter
      value={value}
      duration={duration}
      decimals={decimals}
      className={className}
      animate
    />
  );
}
