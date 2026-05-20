'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getLogs } from '@/lib/api';

export default function LogsPage() {
  const [logs, setLogs] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');
  const [action, setAction] = useState('');

  async function loadLogs() {
    const query = action.trim() ? `action=${encodeURIComponent(action.trim())}` : '';
    const res = await getLogs(query);
    if (!res.ok) return setError(res.error);
    setLogs(res.data.logs ?? []);
  }

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminShell>
      <h1>Logs</h1>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={action}
          onChange={(e) => setAction(e.target.value)}
          placeholder="Filter by action"
        />
        <button onClick={loadLogs}>Apply</button>
      </div>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(logs.slice(0, 100), null, 2)}
      </pre>
    </AdminShell>
  );
}
