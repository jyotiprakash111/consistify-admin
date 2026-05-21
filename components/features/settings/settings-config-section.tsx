'use client';

import {
  CheckboxField,
  FormField,
  SelectInput,
  TextInput,
} from '@/components/ui/form-field';
import type { ConfigFieldDef, ConfigSectionDef } from '@/lib/settings/config-sections';
import { getSectionValue } from '@/lib/settings/config-utils';
import type { SystemConfig } from '@/lib/types/admin';
import { card, formGrid, mutedText } from '@/lib/ui-classes';

const sectionHeading =
  'text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400';

type SettingsConfigSectionProps = {
  section: ConfigSectionDef;
  config: SystemConfig;
  onFieldChange: (field: ConfigFieldDef, value: string | number | boolean) => void;
};

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: ConfigFieldDef;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
}) {
  switch (field.type) {
    case 'boolean':
      return (
        <CheckboxField
          label={field.label}
          checked={Boolean(value)}
          onChange={(v) => onChange(v)}
        />
      );
    case 'number':
      return (
        <FormField label={field.label}>
          <TextInput
            type="number"
            min={field.min}
            max={field.max}
            step={field.step ?? 1}
            value={typeof value === 'number' ? value : 0}
            onChange={(e) => {
              const parsed = Number(e.target.value);
              const next = Number.isFinite(parsed) ? parsed : 0;
              const clamped =
                field.min !== undefined ? Math.max(field.min, next) : next;
              onChange(
                field.max !== undefined ? Math.min(field.max, clamped) : clamped,
              );
            }}
          />
        </FormField>
      );
    case 'select':
      return (
        <FormField label={field.label}>
          <SelectInput
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          >
            {(field.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectInput>
        </FormField>
      );
    case 'text':
    default:
      return (
        <FormField label={field.label}>
          <TextInput
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        </FormField>
      );
  }
}

export function SettingsConfigSection({
  section,
  config,
  onFieldChange,
}: SettingsConfigSectionProps) {
  const Icon = section.icon;
  const booleans = section.fields.filter((f) => f.type === 'boolean');
  const others = section.fields.filter((f) => f.type !== 'boolean');

  return (
    <section className={card}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
          <Icon className="size-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <h3 className={sectionHeading}>{section.title}</h3>
          {section.description ? (
            <p className={`${mutedText} mt-0.5 text-xs`}>{section.description}</p>
          ) : null}
        </div>
      </div>

      {booleans.length > 0 ? (
        <div className="space-y-2">
          {booleans.map((field) => (
            <div key={`${field.section}.${field.key}`}>
              <FieldControl
                field={field}
                value={getSectionValue(config, field.section, field.key)}
                onChange={(v) => onFieldChange(field, v)}
              />
              {field.description ? (
                <p className={`${mutedText} ml-6 mt-0.5 text-xs`}>{field.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      {others.length > 0 ? (
        <div className={`${formGrid} max-w-2xl ${booleans.length > 0 ? 'mt-4' : ''}`}>
          {others.map((field) => (
            <div key={`${field.section}.${field.key}`}>
              <FieldControl
                field={field}
                value={getSectionValue(config, field.section, field.key)}
                onChange={(v) => onFieldChange(field, v)}
              />
              {field.description ? (
                <p className={`${mutedText} mt-1 text-xs`}>{field.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
