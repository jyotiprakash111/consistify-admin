'use client';

import { CheckboxField } from '@/components/ui/form-field';
import { FEATURE_OVERRIDE_ITEMS } from '@/lib/feature-override-meta';
import type { FeatureOverrides } from '@/lib/types/admin';
import { card, mutedText } from '@/lib/ui-classes';

type FeatureOverrideFieldsProps = {
  overrides: FeatureOverrides;
  onChange: (next: FeatureOverrides) => void;
  compact?: boolean;
};

export function FeatureOverrideFields({ overrides, onChange, compact }: FeatureOverrideFieldsProps) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {FEATURE_OVERRIDE_ITEMS.map((item) => (
        <div
          key={item.key}
          className={compact ? '' : `rounded-xl border border-slate-200/70 bg-slate-50/50 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900/40`}
        >
          <CheckboxField
            label={item.label}
            checked={overrides[item.key]}
            onChange={(v) => onChange({ ...overrides, [item.key]: v })}
          />
          {!compact && item.description ? (
            <p className={`${mutedText} ml-6 mt-0.5 text-xs`}>{item.description}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function FeatureOverrideLegend() {
  return (
    <div className={`${card} ${mutedText} text-xs`}>
      Per-user flags override defaults for that account only. Global switches in System config must
      also be on for a feature to work app-wide.
    </div>
  );
}
