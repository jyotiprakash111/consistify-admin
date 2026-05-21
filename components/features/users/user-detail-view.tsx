'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { AlertMessage } from '@/components/ui/alert-message';
import { CardSection } from '@/components/ui/card-section';
import { CheckboxField, FormField, TextAreaInput, TextInput } from '@/components/ui/form-field';
import { JsonPanel } from '@/components/ui/json-panel';
import { LoadingState } from '@/components/ui/loading-state';
import { PageHeader } from '@/components/ui/page-header';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  addUserNote,
  adjustUserWallet,
  approveUserExtraLeave,
  fetchUserDetail,
  resetUserDetail,
  saveUserFeatureOverrides,
  selectUserDetail,
  setUserDetailForm,
  setUserOverridesDraft,
  toggleUserDisabled,
  updateUserAvatar,
} from '@/lib/store/slices/users/userDetailSlice';
import { btn, btnDanger, btnPrimary, formGrid, mutedText } from '@/lib/ui-classes';

export function UserDetailView() {
  const params = useParams<{ id: string }>();
  const userId = String(params?.id ?? '');
  const dispatch = useAppDispatch();
  const {
    user,
    sessions,
    walletTransactions,
    ocrSubmissions,
    adminNotes,
    overrides,
    form,
    error,
    message,
    status,
  } = useAppSelector(selectUserDetail);

  useEffect(() => {
    if (userId) dispatch(fetchUserDetail(userId));
    return () => {
      dispatch(resetUserDetail());
    };
  }, [dispatch, userId]);

  return (
    <AdminShell>
      <PageHeader
        title="User profile"
        description={user?.phone ?? userId}
        apiHint="GET /users/:id · PATCH /users/:id"
        actions={
          <Link href="/users" className={`${btn} text-sm`}>
            Back to users
          </Link>
        }
      />
      <AlertMessage error={error} success={message} />
      {status === 'loading' && !user ? (
        <LoadingState />
      ) : user ? (
        <div className="space-y-6">
          <CardSection title="Summary">
            <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <div>Email: {user.email}</div>
              <div>Wallet: {user.walletBalance}</div>
              <div>Streak: {user.currentStreakDays} days</div>
              <div>Compliance: {user.complianceRate}%</div>
              <div>Fines collected: {user.totalFineCollected}</div>
              <div>Tags: {user.tags?.join(', ') || '—'}</div>
            </div>
            <button
              type="button"
              onClick={() => dispatch(toggleUserDisabled(userId))}
              className={`${user.isDisabled ? btnPrimary : btnDanger} mt-4`}
            >
              {user.isDisabled ? 'Enable user' : 'Disable user'}
            </button>
          </CardSection>

          <CardSection title="Feature overrides">
            <p className={`${mutedText} mb-3`}>PATCH /users/:id/feature-overrides</p>
            {overrides ? (
              <div className="space-y-2">
                <CheckboxField
                  label="Wallet enabled"
                  checked={overrides.walletEnabled}
                  onChange={(v) => dispatch(setUserOverridesDraft({ ...overrides, walletEnabled: v }))}
                />
                <CheckboxField
                  label="Badge rewards enabled"
                  checked={overrides.badgeRewardsEnabled}
                  onChange={(v) => dispatch(setUserOverridesDraft({ ...overrides, badgeRewardsEnabled: v }))}
                />
                <CheckboxField
                  label="Email notifications"
                  checked={overrides.emailNotificationsEnabled}
                  onChange={(v) =>
                    dispatch(setUserOverridesDraft({ ...overrides, emailNotificationsEnabled: v }))
                  }
                />
                <CheckboxField
                  label="Push notifications"
                  checked={overrides.pushNotificationsEnabled}
                  onChange={(v) =>
                    dispatch(setUserOverridesDraft({ ...overrides, pushNotificationsEnabled: v }))
                  }
                />
                <button
                  type="button"
                  onClick={() => dispatch(saveUserFeatureOverrides({ userId, overrides }))}
                  className={`${btnPrimary} mt-2`}
                >
                  Save overrides
                </button>
              </div>
            ) : (
              <LoadingState label="Loading overrides..." />
            )}
          </CardSection>

          <CardSection title="Avatar">
            <div className={formGrid}>
              <TextInput
                value={form.avatar}
                onChange={(e) => dispatch(setUserDetailForm({ avatar: e.target.value }))}
                placeholder="avatar id"
              />
              <button
                type="button"
                onClick={() => dispatch(updateUserAvatar({ userId, avatar: form.avatar }))}
                className={`${btnPrimary} w-fit`}
              >
                Update avatar
              </button>
            </div>
          </CardSection>

          <CardSection title="Wallet adjustment">
            <div className={formGrid}>
              <FormField label="Amount (+/-)">
                <TextInput
                  value={form.walletAmount}
                  onChange={(e) => dispatch(setUserDetailForm({ walletAmount: e.target.value }))}
                />
              </FormField>
              <FormField label="Reason">
                <TextInput
                  value={form.walletReason}
                  onChange={(e) => dispatch(setUserDetailForm({ walletReason: e.target.value }))}
                />
              </FormField>
              <button
                type="button"
                onClick={() => {
                  const amount = Number(form.walletAmount);
                  if (!Number.isFinite(amount)) return;
                  if (!form.walletReason.trim()) return;
                  dispatch(adjustUserWallet({ userId, amount, reason: form.walletReason.trim() }));
                }}
                className={`${btnPrimary} w-fit`}
              >
                Apply adjustment
              </button>
            </div>
          </CardSection>

          <CardSection title="Admin note">
            <div className={formGrid}>
              <TextAreaInput
                value={form.note}
                onChange={(e) => dispatch(setUserDetailForm({ note: e.target.value }))}
                rows={3}
              />
              <button
                type="button"
                onClick={() => {
                  const trimmed = form.note.trim();
                  if (trimmed) dispatch(addUserNote({ userId, note: trimmed }));
                }}
                className={`${btnPrimary} w-fit`}
              >
                Add note
              </button>
            </div>
          </CardSection>

          <CardSection title="Approve extra leave">
            <p className={`${mutedText} mb-2`}>POST /users/:userId/leaves/:leaveId/approve-extra</p>
            <div className={formGrid}>
              <FormField label="Leave ID">
                <TextInput
                  value={form.leaveId}
                  onChange={(e) => dispatch(setUserDetailForm({ leaveId: e.target.value }))}
                />
              </FormField>
              <button
                type="button"
                onClick={() => {
                  if (form.leaveId.trim()) {
                    dispatch(approveUserExtraLeave({ userId, leaveId: form.leaveId.trim() }));
                  }
                }}
                className={`${btnPrimary} w-fit`}
              >
                Approve extra leave
              </button>
            </div>
          </CardSection>

          <JsonPanel title="Admin notes" data={adminNotes} />
          <JsonPanel title="Sessions" data={sessions} />
          <JsonPanel title="Transactions" data={walletTransactions} />
          <JsonPanel title="OCR submissions" data={ocrSubmissions} />
        </div>
      ) : null}
    </AdminShell>
  );
}
