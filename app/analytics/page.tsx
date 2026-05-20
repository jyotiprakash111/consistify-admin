'use client';

import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getAnalytics, getAnalyticsSubjects } from '@/lib/api';

export default function AnalyticsPage() {
  const [growthRows, setGrowthRows] = useState<Array<Record<string, unknown>>>([]);
  const [dropoffRows, setDropoffRows] = useState<Array<Record<string, unknown>>>([]);
  const [subjects, setSubjects] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [analyticsRes, subjectsRes] = await Promise.all([
        getAnalytics(),
        getAnalyticsSubjects(),
      ]);
      if (cancelled) return;
      if (!analyticsRes.ok) return setError(analyticsRes.error);
      if (!subjectsRes.ok) return setError(subjectsRes.error);
      setGrowthRows(analyticsRes.data.growthPoints ?? []);
      setDropoffRows(analyticsRes.data.dropoffStages ?? []);
      setSubjects(subjectsRes.data as unknown as Record<string, unknown>);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminShell>
      <h1>Analytics</h1>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <h3>Growth Points</h3>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(growthRows, null, 2)}
      </pre>
      <h3 style={{ marginTop: 16 }}>Drop-off Funnel</h3>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(dropoffRows, null, 2)}
      </pre>
      <h3 style={{ marginTop: 16 }}>Subject Analytics</h3>
      <pre style={{ background: '#f7f7f7', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(subjects, null, 2)}
      </pre>
    </AdminShell>
  );
}
