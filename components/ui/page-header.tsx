import type { ReactNode } from 'react';
import { mutedText } from '@/lib/ui-classes';

type PageHeaderProps = {
  title: string;
  description?: string;
  apiHint?: string;
  actions?: ReactNode;
};

export function PageHeader({ title, description, apiHint, actions }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 transition-colors dark:text-slate-50">
          {title}
        </h1>
        {description ? <p className={mutedText}>{description}</p> : null}
        {apiHint ? (
          <p className="mt-1.5 font-mono text-xs text-slate-400 dark:text-slate-500">{apiHint}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
