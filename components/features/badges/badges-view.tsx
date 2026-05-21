'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { useEffect } from 'react';
import { AlertMessage } from '@/components/ui/alert-message';
import { CardSection } from '@/components/ui/card-section';
import { FormField, TextInput } from '@/components/ui/form-field';
import { JsonPanel } from '@/components/ui/json-panel';
import { MetricCard } from '@/components/ui/metric-card';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchBadges,
  selectBadges,
  setBadgesForm,
  submitBadgeCorrection,
} from '@/lib/store/slices/badges/badgesSlice';
import { btnPrimary, formGrid } from '@/lib/ui-classes';

export function BadgesView() {
  const dispatch = useAppDispatch();
  const { summary, form, error, message } = useAppSelector(selectBadges);

  useEffect(() => {
    dispatch(fetchBadges());
  }, [dispatch]);

  function onSubmit() {
    if (!form.userId.trim() || !form.note.trim()) return;
    dispatch(
      submitBadgeCorrection({
        userId: form.userId.trim(),
        type: form.type,
        note: form.note.trim(),
      }),
    );
  }

  return (
    <AdminShell>
      <PageHeader
        title="Badges"
        description="Distribution and manual corrections"
        apiHint="GET /badges/summary · POST /badges/correction"
      />
      <AlertMessage error={error} success={message} />
      {summary ? (
        <div className="mb-6 max-w-xs">
          <MetricCard label="Total badges" value={summary.totalBadges} />
        </div>
      ) : null}
      <CardSection title="Manual badge correction">
        <div className={formGrid}>
          <FormField label="User ID">
            <TextInput value={form.userId} onChange={(e) => dispatch(setBadgesForm({ userId: e.target.value }))} />
          </FormField>
          <FormField label="Badge type">
            <TextInput value={form.type} onChange={(e) => dispatch(setBadgesForm({ type: e.target.value }))} />
          </FormField>
          <FormField label="Note">
            <TextInput value={form.note} onChange={(e) => dispatch(setBadgesForm({ note: e.target.value }))} />
          </FormField>
          <button type="button" onClick={onSubmit} className={`${btnPrimary} w-fit`}>
            Submit correction
          </button>
        </div>
      </CardSection>
      {summary ? (
        <div className="mt-6 space-y-6">
          <JsonPanel title="Distribution" data={summary.distribution} />
          <JsonPanel title="Recent events" data={summary.recentEvents} />
        </div>
      ) : null}
    </AdminShell>
  );
}
