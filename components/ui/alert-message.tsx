import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { errorText, successText } from '@/lib/ui-classes';

type AlertMessageProps = {
  error?: string;
  success?: string;
};

export function AlertMessage({ error, success }: AlertMessageProps) {
  if (!error && !success) return null;
  return (
    <div className="mb-4 space-y-2">
      {error ? (
        <p
          className={`${errorText} flex items-start gap-2 rounded-lg border border-red-200/80 bg-red-50 px-3 py-2 dark:border-red-900/50 dark:bg-red-950/40`}
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <span>{error}</span>
        </p>
      ) : null}
      {success ? (
        <p
          className={`${successText} flex items-start gap-2 rounded-lg border border-emerald-200/80 bg-emerald-50 px-3 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/40`}
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" strokeWidth={2} />
          <span>{success}</span>
        </p>
      ) : null}
    </div>
  );
}
