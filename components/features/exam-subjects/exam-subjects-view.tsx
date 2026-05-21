'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import { FormEvent, useEffect, useState } from 'react';
import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';
import { DataTable } from '@/components/ui/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { FormField, TextInput } from '@/components/ui/form-field';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  fetchExamSubjects,
  removeExamSubjectTemplate,
  saveExamSubjectTemplate,
  selectExamSubjects,
  setSelectedExamGroup,
} from '@/lib/store/slices/exam-subjects/examSubjectsSlice';
import type { ExamSubjectTemplate, SubjectQuadrant } from '@/lib/types/exam-subjects';
import { QUADRANT_OPTIONS } from '@/lib/types/exam-subjects';
import {
  btn,
  btnDanger,
  btnPrimary,
  formGrid,
  mutedText,
  panel,
  panelInset,
  select,
} from '@/lib/ui-classes';

type FormState = {
  id: string | null;
  name: string;
  quadrant: SubjectQuadrant;
  sortOrder: string;
};

const emptyForm = (examGroup: string): FormState => ({
  id: null,
  name: '',
  quadrant: 'UI',
  sortOrder: '',
});

export function ExamSubjectsView() {
  const dispatch = useAppDispatch();
  const {
    groups,
    templates,
    selectedExamGroup,
    status,
    saving,
    deletingId,
    error,
    message,
  } = useAppSelector(selectExamSubjects);
  const loading = status === 'loading';

  const [form, setForm] = useState<FormState>(() => emptyForm('NEET'));

  useEffect(() => {
    dispatch(fetchExamSubjects(selectedExamGroup));
  }, [dispatch, selectedExamGroup]);

  useEffect(() => {
    setForm(emptyForm(selectedExamGroup));
  }, [selectedExamGroup]);

  function onExamGroupChange(value: string) {
    dispatch(setSelectedExamGroup(value));
  }

  function startEdit(template: ExamSubjectTemplate) {
    setForm({
      id: template.id,
      name: template.name,
      quadrant: template.quadrant,
      sortOrder: String(template.sortOrder),
    });
  }

  function cancelEdit() {
    setForm(emptyForm(selectedExamGroup));
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const sortOrder = form.sortOrder.trim()
      ? Number(form.sortOrder)
      : templates.length;
    dispatch(
      saveExamSubjectTemplate({
        id: form.id ?? undefined,
        examGroup: selectedExamGroup,
        name,
        quadrant: form.quadrant,
        sortOrder: Number.isFinite(sortOrder) ? sortOrder : templates.length,
      }),
    ).then((result) => {
      if (saveExamSubjectTemplate.fulfilled.match(result)) {
        setForm(emptyForm(selectedExamGroup));
      }
    });
  }

  return (
    <AdminShell>
      <PageHeader
        title="Exam subject templates"
        description="Onboarding subject options per exam group — quadrant and sort order"
        apiHint="GET/POST/PATCH/DELETE /exam-subject-templates"
      />

      <AlertMessage error={error} success={message} />

      {loading ? (
        <>
          <div className={`${panel} mb-6 animate-pulse p-5`}>
            <div className="mb-3 h-3 w-24 rounded-md bg-slate-200 dark:bg-zinc-700" />
            <div className="h-10 max-w-md rounded-xl bg-slate-200 dark:bg-zinc-700" />
            <div className="mt-3 h-3 w-48 rounded-md bg-slate-200 dark:bg-zinc-700" />
          </div>

          <div className={`${panelInset} mb-6 animate-pulse p-5`}>
            <div className="mb-4 h-4 w-28 rounded-md bg-slate-200 dark:bg-zinc-700" />
            <div className={`${formGrid} max-w-lg`}>
              <div className="h-16 rounded-xl bg-slate-200 dark:bg-zinc-700" />
              <div className="h-16 rounded-xl bg-slate-200 dark:bg-zinc-700" />
              <div className="h-16 rounded-xl bg-slate-200 dark:bg-zinc-700" />
              <div className="h-10 w-32 rounded-xl bg-slate-200 dark:bg-zinc-700" />
            </div>
          </div>

          <div className={panel}>
            <div className="flex items-center gap-2 border-b border-slate-200/60 px-5 py-4 dark:border-zinc-800">
              <div className="size-4 rounded-md bg-slate-200 dark:bg-zinc-700" />
              <div className="h-4 w-20 animate-pulse rounded-md bg-slate-200 dark:bg-zinc-700" />
            </div>
            <div className="p-5">
              <DataTableSkeleton columns={4} rows={8} />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={`${panel} mb-6 p-5`}>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
              Exam group
            </label>
            <select
              className={`${select} max-w-md`}
              value={selectedExamGroup}
              onChange={(e) => onExamGroupChange(e.target.value)}
            >
              {groups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <p className={`${mutedText} mt-2 text-xs`}>
              {templates.length} subject{templates.length === 1 ? '' : 's'} for {selectedExamGroup}
            </p>
          </div>

          <div className={`${panelInset} mb-6 p-5`}>
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-zinc-100">
              {form.id ? (
                <>
                  <Pencil className="size-4 text-indigo-600" strokeWidth={2} />
                  Edit subject
                </>
              ) : (
                <>
                  <Plus className="size-4 text-indigo-600" strokeWidth={2} />
                  Add subject
                </>
              )}
            </h2>
            <form className={formGrid} onSubmit={onSubmit}>
              <FormField label="Name">
                <TextInput
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Physics"
                  required
                />
              </FormField>
              <FormField label="Quadrant">
                <select
                  className={select}
                  value={form.quadrant}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, quadrant: e.target.value as SubjectQuadrant }))
                  }
                >
                  {QUADRANT_OPTIONS.map((q) => (
                    <option key={q.value} value={q.value}>
                      {q.label}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Sort order">
                <TextInput
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setForm((f) => ({ ...f, sortOrder: e.target.value }))}
                  placeholder="Auto if empty"
                />
              </FormField>
              <div className="flex flex-wrap gap-2">
                <button type="submit" className={btnPrimary} disabled={saving}>
                  {saving ? 'Saving…' : form.id ? 'Update' : 'Add subject'}
                </button>
                {form.id ? (
                  <button type="button" className={btn} onClick={cancelEdit}>
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </div>

          <div className={panel}>
            <div className="flex items-center gap-2 border-b border-slate-200/60 px-5 py-4 dark:border-zinc-800">
              <BookOpen className="size-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2} />
              <h2 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">Subjects</h2>
            </div>
            <div className="p-5 pt-0">
              <DataTable
                rows={templates}
                rowKey={(t) => t.id}
                emptyMessage={`No templates for ${selectedExamGroup}. Add subjects above.`}
                columns={[
                  { key: 'order', header: '#', render: (t) => t.sortOrder },
                  { key: 'name', header: 'Name', render: (t) => t.name },
                  {
                    key: 'quadrant',
                    header: 'Quadrant',
                    render: (t) => {
                      const label = QUADRANT_OPTIONS.find((q) => q.value === t.quadrant)?.label;
                      return (
                        <span title={label}>
                          <span className="font-mono text-xs font-semibold">{t.quadrant}</span>
                        </span>
                      );
                    },
                  },
                  {
                    key: 'actions',
                    header: '',
                    render: (t) => (
                      <div className="flex justify-end gap-2">
                        <button type="button" className={btn} onClick={() => startEdit(t)}>
                          <Pencil className="size-3.5" strokeWidth={2} />
                          Edit
                        </button>
                        <button
                          type="button"
                          className={btnDanger}
                          disabled={deletingId === t.id}
                          onClick={() =>
                            dispatch(
                              removeExamSubjectTemplate({ id: t.id, examGroup: selectedExamGroup }),
                            )
                          }
                        >
                          <Trash2 className="size-3.5" strokeWidth={2} />
                          {deletingId === t.id ? '…' : 'Delete'}
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </>
      )}
      </AdminShell>
  );
}
