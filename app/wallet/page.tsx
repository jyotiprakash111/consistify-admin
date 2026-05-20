'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getWalletOverview, getWalletTransactions, postWalletCredit } from '@/lib/api';

export default function WalletPage() {
  const [overview, setOverview] = useState<{ totalDeposits: number; totalActiveBalances: number } | null>(null);
  const [transactions, setTransactions] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('0');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setError('');
    const [overviewRes, txRes] = await Promise.all([
      getWalletOverview(),
      getWalletTransactions({ limit: 50 }),
    ]);
    if (!overviewRes.ok) return setError(overviewRes.error);
    if (!txRes.ok) return setError(txRes.error);
    setOverview({
      totalDeposits: overviewRes.data.totalDeposits,
      totalActiveBalances: overviewRes.data.totalActiveBalances,
    });
    setTransactions(txRes.data.transactions ?? []);
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [overviewRes, txRes] = await Promise.all([
        getWalletOverview(),
        getWalletTransactions({ limit: 50 }),
      ]);
      if (cancelled) return;
      if (!overviewRes.ok) return setError(overviewRes.error);
      if (!txRes.ok) return setError(txRes.error);
      setOverview({
        totalDeposits: overviewRes.data.totalDeposits,
        totalActiveBalances: overviewRes.data.totalActiveBalances,
      });
      setTransactions(txRes.data.transactions ?? []);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onCredit() {
    setError('');
    setMessage('');
    const parsed = Number(amount);
    if (!userId.trim()) return setError('User ID is required');
    if (!Number.isFinite(parsed)) return setError('Invalid amount');
    if (!note.trim()) return setError('Note is required');

    const res = await postWalletCredit({ userId: userId.trim(), amount: parsed, note: note.trim() });
    if (!res.ok) return setError(res.error);
    setMessage(`${res.data.message}. New balance: ${res.data.newBalance}`);
    setAmount('0');
    setNote('');
    await load();
  }

  return (
    <AdminShell>
      <h1>Wallet</h1>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {message ? <p style={{ color: 'green' }}>{message}</p> : null}
      {overview ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <div>Total Deposits: {overview.totalDeposits}</div>
          <div>Total Active Balances: {overview.totalActiveBalances}</div>
        </div>
      ) : null}

      <h3 style={{ marginTop: 20 }}>Manual Credit / Debit</h3>
      <div style={{ display: 'grid', gap: 8, maxWidth: 500 }}>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (+/-)" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Reason" />
        <button onClick={onCredit}>Submit</button>
      </div>

      <h3 style={{ marginTop: 20 }}>Recent Transactions</h3>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(transactions, null, 2)}
      </pre>
    </AdminShell>
  );
}
