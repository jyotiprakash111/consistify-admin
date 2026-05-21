'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { useEffect, useMemo, useState } from 'react';
import { AlertMessage } from '@/components/ui/alert-message';
import { CardSection } from '@/components/ui/card-section';
import { FormField, TextInput } from '@/components/ui/form-field';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { UserSelectField } from '@/components/ui/user-select-field';
import { WalletTransactionsTable } from '@/components/features/users/wallet-transactions-table';
import { getWalletTransactions } from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchWallet,
  selectWallet,
  setWalletForm,
  submitWalletCredit,
} from '@/lib/store/slices/wallet/walletSlice';
import {
  normalizeWalletTransactions,
  type WalletTransactionRow,
} from '@/lib/wallet-transaction-utils';
import { btnPrimary, formGrid, gridCards } from '@/lib/ui-classes';

export function WalletView() {
  const dispatch = useAppDispatch();
  const { overview, transactions, form, error, message, status } = useAppSelector(selectWallet);
  const [userTransactions, setUserTransactions] = useState<WalletTransactionRow[]>([]);
  const [txLoading, setTxLoading] = useState(false);

  const loading = status === 'loading' && !overview;

  const allTransactions = useMemo(
    () => normalizeWalletTransactions(transactions),
    [transactions],
  );

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

  useEffect(() => {
    const userId = form.userId.trim();
    if (!userId) {
      setUserTransactions([]);
      setTxLoading(false);
      return;
    }

    let cancelled = false;
    setTxLoading(true);
    getWalletTransactions({ limit: 100, userId }).then((res) => {
      if (cancelled) return;
      setUserTransactions(
        res.ok ? normalizeWalletTransactions(res.data.transactions ?? []) : [],
      );
      setTxLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [form.userId]);

  function onCredit() {
    const parsed = Number(form.amount);
    if (!form.userId.trim()) return;
    if (!Number.isFinite(parsed)) return;
    if (!form.note.trim()) return;
    dispatch(
      submitWalletCredit({
        userId: form.userId.trim(),
        amount: parsed,
        note: form.note.trim(),
      }),
    );
  }

  const showUserTransactions = Boolean(form.userId.trim());

  return (
    <AdminShell>
      <PageHeader
        title="Wallet"
        description="Overview, per-user transactions, and manual credits"
        apiHint="GET /wallet/overview · POST /wallet/credit"
      />
      <AlertMessage error={error} success={message} />

      {overview ? (
        <div className={`${gridCards} mb-6`}>
          <MetricCard label="Total deposits" value={overview.totalDeposits} />
          <MetricCard label="Active balances" value={overview.totalActiveBalances} />
        </div>
      ) : null}

      <CardSection title="Manual credit / debit">
        <div className={formGrid}>
          <UserSelectField
            label="User"
            value={form.userId}
            showWalletBalance
            combobox
            onChange={(userId) => dispatch(setWalletForm({ userId }))}
          />
          <FormField label="Amount (+/-)">
            <TextInput
              type="number"
              value={form.amount}
              onChange={(e) => dispatch(setWalletForm({ amount: e.target.value }))}
            />
          </FormField>
          <FormField label="Reason">
            <TextInput
              value={form.note}
              onChange={(e) => dispatch(setWalletForm({ note: e.target.value }))}
              placeholder="Required for audit trail"
            />
          </FormField>
          <button
            type="button"
            onClick={onCredit}
            disabled={!form.userId.trim() || loading}
            className={`${btnPrimary} w-fit`}
          >
            Submit credit
          </button>
        </div>
      </CardSection>

      <div className="mt-6">
        <WalletTransactionsTable
          transactions={showUserTransactions ? userTransactions : allTransactions}
          loading={showUserTransactions ? txLoading : loading}
        />
      </div>
    </AdminShell>
  );
}
