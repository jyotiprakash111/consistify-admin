'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getBadgeSummary, postBadgeCorrection } from '@/lib/api';

export default function BadgesPage() {
  const [summary, setSummary] = useState<{ totalBadges: number; distribution: Array<{ type: string; count: number }> } | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [type, setType] = useState('streak_3');
  const [note, setNote] = useState('');

  async function load() {
    const res = await getBadgeSummary();
    if (!res.ok) return setError(res.error);
    setSummary({
      totalBadges: res.data.totalBadges,
      distribution: res.data.distribution ?? [],
    });
  }

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const res = await getBadgeSummary();
      if (cancelled) return;
      if (!res.ok) return setError(res.error);
      setSummary({
        totalBadges: res.data.totalBadges,
        distribution: res.data.distribution ?? [],
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit() {
    setError('');
    setMessage('');
    if (!userId.trim()) return setError('User ID is required');
    if (!note.trim()) return setError('Correction note is required');
    const res = await postBadgeCorrection({ userId: userId.trim(), type, note: note.trim() });
    if (!res.ok) return setError(res.error);
    setMessage('Badge correction logged');
    setNote('');
    await load();
  }

  return (
    <AdminShell>
      <h1>Badges</h1>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {message ? <p style={{ color: 'green' }}>{message}</p> : null}
      <h3>Manual Badge Correction</h3>
      <div style={{ display: 'grid', gap: 8, maxWidth: 500, marginBottom: 16 }}>
        <input value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="User ID" />
        <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Badge type (enum)" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Correction note" />
        <button onClick={onSubmit}>Submit correction</button>
      </div>
      {summary ? (
        <>
          <p>Total badges: {summary.totalBadges}</p>
          <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
            {JSON.stringify(summary.distribution, null, 2)}
          </pre>
        </>
      ) : null}
    </AdminShell>
  );
}
