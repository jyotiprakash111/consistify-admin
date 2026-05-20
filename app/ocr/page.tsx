'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getOcrSubmissions, patchOcrSubmission } from '@/lib/api';

type OcrStatus = 'pending' | 'approved' | 'review' | 'fined';

export default function OcrPage() {
  const [submissions, setSubmissions] = useState<Array<Record<string, unknown>>>([]);
  const [status, setStatus] = useState<string>('all');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function load() {
    setError('');
    const res = await getOcrSubmissions({
      status,
      userId: userId.trim() || undefined,
      limit: 100,
    });
    if (!res.ok) return setError(res.error);
    setSubmissions(res.data.submissions ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function quickUpdate(id: string, nextStatus: OcrStatus) {
    setError('');
    setMessage('');
    const res = await patchOcrSubmission(id, { status: nextStatus });
    if (!res.ok) return setError(res.error);
    setMessage(`Updated submission ${id} to ${nextStatus}`);
    await load();
  }

  return (
    <AdminShell>
      <h1>OCR Moderation</h1>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      {message ? <p style={{ color: 'green' }}>{message}</p> : null}

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="review">Review</option>
          <option value="fined">Fined</option>
        </select>
        <input
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="Filter by userId"
        />
        <button onClick={load}>Apply</button>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        {submissions.map((item) => (
          <div key={String(item.id)} style={{ border: '1px solid #eee', borderRadius: 8, padding: 10 }}>
            <strong>{String(item.id)}</strong>
            <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>
              user: {String(item.userId)} | status: {String(item.status)} | solved:{' '}
              {String(item.questionsSolved ?? '-')} | accuracy: {String(item.accuracyPercent ?? '-')}
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button onClick={() => quickUpdate(String(item.id), 'approved')}>Approve</button>
              <button onClick={() => quickUpdate(String(item.id), 'review')}>Mark review</button>
              <button onClick={() => quickUpdate(String(item.id), 'fined')}>Mark fined</button>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
