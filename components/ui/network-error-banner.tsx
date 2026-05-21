'use client';

import { RefreshCw, WifiOff } from 'lucide-react';
import { btn } from '@/lib/ui-classes';

type NetworkErrorBannerProps = {
  /** True when the browser reports no connection. */
  offline: boolean;
  onRetry: () => void;
};

export function NetworkErrorBanner({ offline, onRetry }: NetworkErrorBannerProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-x-0 top-0 z-[100] border-b border-rose-300/80 bg-rose-600 px-4 py-3 text-white shadow-lg shadow-rose-900/20 dark:border-rose-800 dark:bg-rose-950"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <WifiOff className="size-5" strokeWidth={2} aria-hidden />
          </div>
          <div>
            <p className="font-semibold">No network connection</p>
            <p className="text-sm text-rose-100">
              {offline
                ? 'You appear to be offline. Check your internet and try again.'
                : 'Unable to reach the server. Your connection may be unstable.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRetry}
          className={`${btn} border-white/30 bg-white/10 text-white hover:bg-white/20 dark:border-white/20 dark:bg-white/10 dark:hover:bg-white/20`}
        >
          <RefreshCw className="size-4" strokeWidth={2} />
          Try again
        </button>
      </div>
    </div>
  );
}
