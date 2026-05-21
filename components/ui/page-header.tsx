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
    <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent dark:from-white dark:via-zinc-200 dark:to-zinc-400">
          {title}
        </h1>
        {description ? <p className={`${mutedText} mt-2 max-w-xl`}>{description}</p> : null}
        {apiHint ? (
          <span className="mt-3 inline-flex items-center rounded-lg border border-slate-200/80 bg-slate-50/80 px-2.5 py-1 font-mono text-xs text-slate-500 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-500">
            {apiHint}
          </span>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
