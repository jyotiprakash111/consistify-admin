'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getUserDetail, patchUser } from '@/lib/api';

export default function UserDetailPage() {
  const params = useParams<{ id: string }>();
  const userId = String(params.id);
  const [data, setData] = useState<{
    user: Record<string, unknown>;
    sessions: Array<Record<string, unknown>>;
    transactions: Array<Record<string, unknown>>;
    ocrSubmissions: Array<Record<string, unknown>>;
    adminNotes: Array<Record<string, unknown>>;
  } | null>(null);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [avatar, setAvatar] = useState('');
  const [walletAmount, setWalletAmount] = useState('0');
  const [walletReason, setWalletReason] = useState('');

  async function load() {
    const res = await getUserDetail(userId);
    if (!res.ok) return setError(res.error);
    setData({
      user: res.data.user,
      sessions: res.data.sessions ?? [],
      transactions: res.data.transactions ?? [],
      ocrSubmissions: res.data.ocrSubmissions ?? [],
      adminNotes: res.data.adminNotes ?? [],
    });
    setAvatar(String(res.data.user?.avatar ?? ''));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function onToggleDisable() {
    if (!data) return;
    const disabled = Boolean(data.user.isDisabled);
    const res = await patchUser(userId, { isDisabled: !disabled });
    if (!res.ok) return setError(res.error);
    await load();
  }

  async function onUpdateAvatar() {
    const res = await patchUser(userId, { avatar });
    if (!res.ok) return setError(res.error);
    await load();
  }

  async function onAddNote() {
    const trimmed = note.trim();
    if (!trimmed) return;
    const res = await patchUser(userId, { adminNote: trimmed });
    if (!res.ok) return setError(res.error);
    setNote('');
    await load();
  }

  async function onWalletAdjust() {
    const amount = Number(walletAmount);
    if (!Number.isFinite(amount)) return setError('Invalid wallet amount');
    if (!walletReason.trim()) return setError('Wallet reason is required');
    const res = await patchUser(userId, {
      walletAdjustment: { amount, reason: walletReason.trim() },
    });
    if (!res.ok) return setError(res.error);
    setWalletAmount('0');
    setWalletReason('');
    await load();
  }

  return (
    <AdminShell>
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {!data ? (
        <p>Loading...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
            <div>Phone: {String(data.user.phone ?? '')}</div>
            <div>Email: {String(data.user.email ?? '')}</div>
            <div>Wallet: {String(data.user.walletBalance ?? 0)}</div>
            <div>Streak: {String(data.user.currentStreakDays ?? 0)}</div>
            <button onClick={onToggleDisable}>
              {Boolean(data.user.isDisabled) ? 'Enable user' : 'Disable user'}
            </button>
          </div>

          <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
            <h3>Avatar</h3>
            <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="avatar id" />
            <button onClick={onUpdateAvatar}>Update avatar</button>
          </div>

          <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
            <h3>Wallet Adjustment</h3>
            <input
              value={walletAmount}
              onChange={(e) => setWalletAmount(e.target.value)}
              placeholder="amount (+/-)"
            />
            <input
              value={walletReason}
              onChange={(e) => setWalletReason(e.target.value)}
              placeholder="reason"
            />
            <button onClick={onWalletAdjust}>Apply wallet adjustment</button>
          </div>

          <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
            <h3>Admin Note</h3>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} />
            <button onClick={onAddNote}>Add note</button>
          </div>

          <h3>Recent Notes</h3>
          <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
            {JSON.stringify(data.adminNotes, null, 2)}
          </pre>

          <h3>Recent Transactions</h3>
          <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
            {JSON.stringify(data.transactions.slice(0, 20), null, 2)}
          </pre>

          <h3>Recent OCR Submissions</h3>
          <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
            {JSON.stringify(data.ocrSubmissions.slice(0, 20), null, 2)}
          </pre>
        </>
      )}
    </AdminShell>
  );
}
