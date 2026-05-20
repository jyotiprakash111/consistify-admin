'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getDashboard } from '@/lib/api';

export default function DashboardPage() {
  const [data, setData] = useState<Record<string, number>>({});
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboard().then((res) => {
      if (!res.ok) return setError(res.error);
      setData(res.data.metrics ?? {});
    });
  }, []);

  return (
    <AdminShell>
      <h1>Dashboard</h1>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ border: '1px solid #eee', borderRadius: 8, padding: 12 }}>
            <div style={{ fontSize: 12, color: '#666' }}>{key}</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
