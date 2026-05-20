'use client';

import { useEffect } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { AlertMessage } from '@/components/ui/alert-message';
import { DataTable } from '@/components/ui/data-table';
import { FilterBar } from '@/components/ui/filter-bar';
import { TextInput } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { fetchLogs, selectLogs, setLogsActionFilter } from '@/lib/store/slices/logs/logsSlice';

export function LogsView() {
  const dispatch = useAppDispatch();
  const { logs, actionFilter, error } = useAppSelector(selectLogs);

  useEffect(() => {
    dispatch(fetchLogs(actionFilter));
  }, [dispatch]);

  function onApply() {
    dispatch(fetchLogs(actionFilter));
  }

  return (
    <AdminShell>
      <PageHeader title="Admin logs" description="Audit trail of admin actions" apiHint="GET /logs" />
      <AlertMessage error={error} />
      <FilterBar onApply={onApply}>
        <TextInput
          value={actionFilter}
          onChange={(e) => dispatch(setLogsActionFilter(e.target.value))}
          placeholder="Filter by action"
        />
      </FilterBar>
      <DataTable
        rows={logs}
        rowKey={(l) => l.id}
        emptyMessage="No logs"
        columns={[
          { key: 'createdAt', header: 'Time', render: (l) => new Date(l.createdAt).toLocaleString() },
          { key: 'action', header: 'Action', render: (l) => l.action },
          { key: 'userId', header: 'User', render: (l) => l.userId ?? '—' },
          {
            key: 'details',
            header: 'Details',
            render: (l) => <span className="font-mono text-xs text-slate-600">{JSON.stringify(l.details)}</span>,
          },
        ]}
      />
    </AdminShell>
  );
}
