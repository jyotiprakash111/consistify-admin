'use client';

import { useEffect } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { AlertMessage } from '@/components/ui/alert-message';
import { CardSection } from '@/components/ui/card-section';
import { FormField, TextInput } from '@/components/ui/form-field';
import { JsonPanel } from '@/components/ui/json-panel';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchWallet, selectWallet, setWalletForm, submitWalletCredit } from '@/lib/store/slices/wallet/walletSlice';
import { btnPrimary, formGrid, gridCards } from '@/lib/ui-classes';

export function WalletView() {
  const dispatch = useAppDispatch();
  const { overview, transactions, form, error, message } = useAppSelector(selectWallet);

  useEffect(() => {
    dispatch(fetchWallet());
  }, [dispatch]);

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

  return (
    <AdminShell>
      <PageHeader
        title="Wallet"
        description="Overview, transactions, and manual credits"
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
          <FormField label="User ID">
            <TextInput value={form.userId} onChange={(e) => dispatch(setWalletForm({ userId: e.target.value }))} />
          </FormField>
          <FormField label="Amount (+/-)">
            <TextInput value={form.amount} onChange={(e) => dispatch(setWalletForm({ amount: e.target.value }))} />
          </FormField>
          <FormField label="Reason">
            <TextInput value={form.note} onChange={(e) => dispatch(setWalletForm({ note: e.target.value }))} />
          </FormField>
          <button type="button" onClick={onCredit} className={`${btnPrimary} w-fit`}>
            Submit
          </button>
        </div>
      </CardSection>
      <div className="mt-6">
        <JsonPanel title="Recent transactions (GET /wallet/transactions)" data={transactions} />
      </div>
    </AdminShell>
  );
}
