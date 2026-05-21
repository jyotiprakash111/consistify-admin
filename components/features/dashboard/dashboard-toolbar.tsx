'use client';

import { RefreshCw } from 'lucide-react';
import { formatRefreshedAt } from '@/lib/dashboard/format-refreshed';
import { btn, mutedText } from '@/lib/ui-classes';

type DashboardToolbarProps = {
  refreshedAt: string | null;
  loading: boolean;
  onRefresh: () => void;
};

export function DashboardToolbar({ refreshedAt, loading, onRefresh }: DashboardToolbarProps) {
  const label = formatRefreshedAt(refreshedAt);

  return (
    <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
      {label ? (
        <p className={`${mutedText} text-xs`}>
          Updated {label}
        </p>
      ) : null}
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className={btn}
        aria-label="Refresh dashboard"
      >
        <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} strokeWidth={2} />
        {loading ? 'Refreshing…' : 'Refresh'}
      </button>
    </div>
  );
}
