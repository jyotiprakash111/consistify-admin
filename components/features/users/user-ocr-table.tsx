'use client';

import Link from 'next/link';
import { ScanLine } from 'lucide-react';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge, formatDate } from '@/components/features/users/user-profile-ui';
import { linkAccent, card } from '@/lib/ui-classes';

type OcrRow = {
  id: string;
  submittedAt: string;
  status: string;
  questionCount: number;
  questionsSolved: number;
  accuracyPercent: number;
  screenshotLabel: string;
};

function ocrStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'neutral' {
  const s = status.toLowerCase();
  if (s === 'approved' || s === 'completed') return 'success';
  if (s === 'pending') return 'warning';
  if (s === 'rejected' || s === 'failed') return 'danger';
  return 'neutral';
}

export function UserOcrTable({ submissions }: { submissions: Array<Record<string, unknown>> }) {
  const rows: OcrRow[] = submissions.map((o) => ({
    id: String(o.id ?? ''),
    submittedAt: String(o.submittedAt ?? ''),
    status: String(o.status ?? ''),
    questionCount: Number(o.questionCount ?? 0),
    questionsSolved: Number(o.questionsSolved ?? 0),
    accuracyPercent: Number(o.accuracyPercent ?? 0),
    screenshotLabel: String(o.screenshotLabel ?? ''),
  }));

  return (
    <section className={card}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ScanLine className="size-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            OCR submissions
          </h3>
        </div>
        <Link href="/ocr" className={`${linkAccent} text-xs`}>
          Open OCR queue →
        </Link>
      </div>
      <DataTable
        rows={rows}
        rowKey={(o) => o.id}
        emptyMessage="No OCR submissions"
        columns={[
          {
            key: 'date',
            header: 'Submitted',
            className: 'whitespace-nowrap',
            render: (o) => formatDate(o.submittedAt),
          },
          {
            key: 'status',
            header: 'Status',
            render: (o) => (
              <StatusBadge label={o.status} variant={ocrStatusVariant(o.status)} />
            ),
          },
          {
            key: 'solved',
            header: 'Solved',
            render: (o) => `${o.questionsSolved} / ${o.questionCount}`,
          },
          {
            key: 'accuracy',
            header: 'Accuracy',
            render: (o) => `${o.accuracyPercent}%`,
          },
          {
            key: 'label',
            header: 'Label',
            className: 'max-w-[10rem] truncate',
            render: (o) => o.screenshotLabel || '—',
          },
        ]}
      />
    </section>
  );
}
