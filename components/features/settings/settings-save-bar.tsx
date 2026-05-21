'use client';

import Link from 'next/link';
import { Loader2, RotateCcw, Save } from 'lucide-react';
import { btn, btnPrimary } from '@/lib/ui-classes';

type SettingsSaveBarProps = {
  dirty: boolean;
  saving: boolean;
  validationError: string | null;
  onSave: () => void;
  onReset: () => void;
};

export function SettingsSaveBar({
  dirty,
  saving,
  validationError,
  onSave,
  onReset,
}: SettingsSaveBarProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-2 mt-8 border-t border-slate-200/80 bg-white/90 px-2 py-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90 md:-mx-4 md:px-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 text-sm">
          {validationError ? (
            <p className="text-red-600 dark:text-red-400">{validationError}</p>
          ) : dirty ? (
            <p className="font-medium text-amber-700 dark:text-amber-400">Unsaved changes</p>
          ) : (
            <p className="text-slate-500 dark:text-zinc-400">All changes saved</p>
          )}
          <Link
            href="/logs"
            className="mt-0.5 block text-xs text-indigo-600 hover:underline dark:text-indigo-400"
          >
            View change history in Logs
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={btn}
            disabled={!dirty || saving}
            onClick={onReset}
          >
            <RotateCcw className="size-4" strokeWidth={2} />
            Reset
          </button>
          <button
            type="button"
            className={btnPrimary}
            disabled={!dirty || saving || Boolean(validationError)}
            onClick={onSave}
          >
            {saving ? (
              <>
                <Loader2 className="size-4 animate-spin" strokeWidth={2} />
                Saving…
              </>
            ) : (
              <>
                <Save className="size-4" strokeWidth={2} />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
