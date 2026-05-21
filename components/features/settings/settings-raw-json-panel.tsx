'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Code2 } from 'lucide-react';
import { TextAreaInput } from '@/components/ui/form-field';
import { btnPrimary, card, mutedText, sectionTitle } from '@/lib/ui-classes';

type SettingsRawJsonPanelProps = {
  rawJson: string;
  saving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
};

export function SettingsRawJsonPanel({
  rawJson,
  saving,
  onChange,
  onSave,
}: SettingsRawJsonPanelProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className={`${card} mt-8`}>
      <button
        type="button"
        className="flex w-full items-center gap-2 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="size-4 text-slate-500" strokeWidth={2} />
        ) : (
          <ChevronRight className="size-4 text-slate-500" strokeWidth={2} />
        )}
        <Code2 className="size-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
        <span className={sectionTitle.replace('mt-6', 'mt-0').replace('mb-3', 'mb-0')}>
          Advanced — raw JSON
        </span>
      </button>
      <p className={`${mutedText} mt-2 text-xs`}>
        Power users only. Invalid JSON or schema errors will be rejected by the API.
      </p>

      {open ? (
        <div className="mt-4">
          <TextAreaInput value={rawJson} onChange={(e) => onChange(e.target.value)} rows={16} />
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className={`${btnPrimary} mt-3`}
          >
            {saving ? 'Saving…' : 'Save raw JSON'}
          </button>
        </div>
      ) : null}
    </section>
  );
}
