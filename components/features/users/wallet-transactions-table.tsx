'use client';

import { DataTable } from '@/components/ui/data-table';
import { formatDate } from '@/components/features/users/user-profile-ui';
import type { WalletTransactionRow } from '@/lib/wallet-transaction-utils';
import { formatInr } from '@/lib/wallet-transaction-utils';
import { card, mutedText } from '@/lib/ui-classes';

function TypeBadge({ type }: { type: string }) {
  const lower = type.toLowerCase();
  const variant =
    lower.includes('credit') || lower.includes('deposit') || lower.includes('refund')
      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
      : lower.includes('fine') || lower.includes('debit') || lower.includes('deduct')
        ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400'
        : lower.includes('adjust')
          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
          : 'bg-slate-500/10 text-slate-600 dark:text-zinc-400';

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize ${variant}`}>
      {type.replace(/_/g, ' ')}
    </span>
  );
}

function AmountCell({ amount }: { amount: number | null }) {
  if (amount === null) return <span className="text-slate-400">—</span>;
  const positive = amount >= 0;
  return (
    <span
      className={`font-semibold tabular-nums ${
        positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
      }`}
    >
      {formatInr(amount)}
    </span>
  );
}

type WalletTransactionsTableProps = {
  transactions: WalletTransactionRow[];
  loading?: boolean;
};

export function WalletTransactionsTable({ transactions, loading }: WalletTransactionsTableProps) {
  return (
    <section className={card}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Wallet transactions
          </h3>
          <p className={`${mutedText} mt-0.5 text-xs`}>
            From user profile and GET /wallet/transactions
          </p>
        </div>
        <span className="rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400">
          {loading ? '…' : transactions.length} records
        </span>
      </div>

      {loading ? (
        <p className={`${mutedText} text-sm`}>Loading transactions…</p>
      ) : (
        <DataTable
          rows={transactions}
          rowKey={(t) => t.id}
          emptyMessage="No wallet transactions for this user"
          columns={[
            {
              key: 'date',
              header: 'Date',
              className: 'whitespace-nowrap',
              render: (t) => formatDate(t.createdAt),
            },
            {
              key: 'type',
              header: 'Type',
              render: (t) => <TypeBadge type={t.type} />,
            },
            {
              key: 'amount',
              header: 'Amount',
              render: (t) => <AmountCell amount={t.amount} />,
            },
            {
              key: 'balance',
              header: 'Balance after',
              render: (t) =>
                t.balanceAfter !== null ? (
                  <span className="tabular-nums">₹{t.balanceAfter.toLocaleString('en-IN')}</span>
                ) : (
                  '—'
                ),
            },
            {
              key: 'note',
              header: 'Note',
              className: 'max-w-xs',
              render: (t) => (
                <span className="block truncate text-slate-600 dark:text-zinc-400" title={t.note}>
                  {t.note || '—'}
                </span>
              ),
            },
          ]}
        />
      )}
    </section>
  );
}
