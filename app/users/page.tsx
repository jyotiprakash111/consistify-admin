'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AdminShell } from '@/components/admin-shell';
import { getUsers } from '@/lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState<Array<Record<string, unknown>>>([]);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('streak');

  async function loadUsers() {
    setError('');
    const params = new URLSearchParams();
    if (phone.trim()) params.set('phone', phone.trim());
    if (status) params.set('status', status);
    if (sort) params.set('sort', sort);
    const res = await getUsers(params.toString());
    if (!res.ok) return setError(res.error);
    setUsers(res.data.users ?? []);
  }

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AdminShell>
      <h1>Users</h1>
      {error ? <p style={{ color: 'crimson' }}>{error}</p> : null}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Search by phone"
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="streak">Streak</option>
          <option value="partnerMatches">Partner matches</option>
          <option value="complianceRate">Compliance</option>
        </select>
        <button onClick={loadUsers}>Apply</button>
      </div>
      <p>Total users: {users.length}</p>
      <div style={{ display: 'grid', gap: 8 }}>
        {users.slice(0, 50).map((user) => (
          <div key={String(user.id)} style={{ border: '1px solid #eee', borderRadius: 8, padding: 10 }}>
            <strong>{String(user.phone ?? user.id)}</strong>
            <div style={{ fontSize: 13, color: '#666' }}>
              {String(user.subscriptionTier ?? '')} | Streak: {String(user.currentStreakDays ?? 0)}
            </div>
            <Link href={`/users/${String(user.id)}`}>Open profile</Link>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
