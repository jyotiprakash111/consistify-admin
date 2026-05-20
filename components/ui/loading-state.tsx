import { Loader2 } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <p className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
      <Loader2 className="size-4 animate-spin" strokeWidth={2} />
      {label}
    </p>
  );
}
