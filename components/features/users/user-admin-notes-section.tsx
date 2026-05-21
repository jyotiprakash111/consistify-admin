'use client';

import { FileText } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { formatDate } from '@/components/features/users/user-profile-ui';
import { card, mutedText } from '@/lib/ui-classes';

type AdminNote = { id: string; text: string; createdAt: string };

export function UserAdminNotesSection({ notes }: { notes: AdminNote[] }) {
  return (
    <section className={card}>
      <div className="mb-4 flex items-center gap-2">
        <FileText className="size-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          Admin notes
        </h3>
      </div>
      <DataTable
        rows={notes}
        rowKey={(n) => n.id}
        emptyMessage="No admin notes yet"
        columns={[
          {
            key: 'when',
            header: 'When',
            className: 'whitespace-nowrap',
            render: (n) => formatDate(n.createdAt),
          },
          {
            key: 'note',
            header: 'Note',
            render: (n) => (
              <span className="text-slate-800 dark:text-zinc-200">{n.text}</span>
            ),
          },
        ]}
      />
    </section>
  );
}
