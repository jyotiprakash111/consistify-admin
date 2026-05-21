'use client';

import { useEffect } from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { clearFlash, selectFlash } from '@/lib/store/slices/ui/uiSlice';

const AUTO_DISMISS_MS = 4500;

export function FlashProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const flash = useAppSelector(selectFlash);

  useEffect(() => {
    if (!flash) return;
    const timer = window.setTimeout(() => dispatch(clearFlash()), AUTO_DISMISS_MS);
    return () => window.clearTimeout(timer);
  }, [flash, dispatch]);

  return (
    <>
      {children}
      {flash ? (
        <div
          className="pointer-events-none fixed inset-x-0 bottom-6 z-[105] flex justify-center px-4"
          role="status"
          aria-live="polite"
        >
          <div
            className={`pointer-events-auto flex max-w-lg items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${
              flash.type === 'success'
                ? 'border-emerald-200/80 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/90 dark:text-emerald-100'
                : 'border-red-200/80 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/90 dark:text-red-100'
            }`}
          >
            {flash.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
            ) : (
              <AlertCircle className="mt-0.5 size-5 shrink-0" strokeWidth={2} />
            )}
            <p className="flex-1 text-sm font-medium">{flash.message}</p>
            <button
              type="button"
              onClick={() => dispatch(clearFlash())}
              className="shrink-0 rounded-md p-0.5 opacity-70 transition-opacity hover:opacity-100"
              aria-label="Dismiss"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
