import type { LeaveKind } from '@/lib/types/admin';

const styles: Record<LeaveKind, string> = {
  standard: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  extra_pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  extra_approved: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
};

const labels: Record<LeaveKind, string> = {
  standard: 'Standard',
  extra_pending: 'Extra · pending',
  extra_approved: 'Extra · approved',
};

export function LeaveKindBadge({ kind }: { kind: LeaveKind }) {
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${styles[kind]}`}
    >
      {labels[kind]}
    </span>
  );
}
