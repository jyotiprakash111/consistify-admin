'use client';

import { useEffect } from 'react';
import { AdminShell } from '@/components/layout/admin-shell';
import { AlertMessage } from '@/components/ui/alert-message';
import { FilterBar } from '@/components/ui/filter-bar';
import { SelectInput, TextInput } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchOcrSubmissions,
  selectOcr,
  setOcrFilters,
  updateOcrStatus,
} from '@/lib/store/slices/ocr/ocrSlice';
import { btn, btnDanger, btnSuccess, card, listGrid, mutedText } from '@/lib/ui-classes';

export function OcrModerationView() {
  const dispatch = useAppDispatch();
  const { submissions, filters, error, message } = useAppSelector(selectOcr);

  useEffect(() => {
    dispatch(fetchOcrSubmissions(filters));
  }, [dispatch]);

  function onApply() {
    dispatch(fetchOcrSubmissions(filters));
  }

  function quickUpdate(id: string, status: 'pending' | 'approved' | 'review' | 'fined') {
    dispatch(updateOcrStatus({ id, status, filters }));
  }

  return (
    <AdminShell>
      <PageHeader
        title="OCR moderation"
        description="Review submissions and update status"
        apiHint="GET /ocr/submissions · PATCH /ocr/submissions/:id"
      />
      <AlertMessage error={error} success={message} />
      <FilterBar onApply={onApply}>
        <SelectInput value={filters.status} onChange={(e) => dispatch(setOcrFilters({ status: e.target.value }))}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="review">Review</option>
          <option value="fined">Fined</option>
        </SelectInput>
        <TextInput
          value={filters.userId}
          onChange={(e) => dispatch(setOcrFilters({ userId: e.target.value }))}
          placeholder="Filter by userId"
        />
      </FilterBar>
      <div className={listGrid}>
        {submissions.map((item) => (
          <div key={String(item.id)} className={card}>
            <strong className="text-slate-900 dark:text-slate-100">{String(item.id)}</strong>
            <div className={`${mutedText} mt-1`}>
              user: {String(item.userId)} · status: {String(item.status)} · solved:{' '}
              {String(item.questionsSolved ?? '-')} · accuracy: {String(item.accuracyPercent ?? '-')}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={() => quickUpdate(String(item.id), 'approved')} className={btnSuccess}>
                Approve
              </button>
              <button type="button" onClick={() => quickUpdate(String(item.id), 'review')} className={btn}>
                Review
              </button>
              <button type="button" onClick={() => quickUpdate(String(item.id), 'fined')} className={btnDanger}>
                Fine
              </button>
            </div>
          </div>
        ))}
      </div>
      {submissions.length === 0 ? <p className="mt-4 text-sm text-slate-500">No submissions</p> : null}
    </AdminShell>
  );
}
