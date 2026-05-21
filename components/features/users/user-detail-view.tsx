'use client';

import { AdminShell } from '@/components/layout/admin-shell';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { AlertMessage } from '@/components/ui/alert-message';
import { PageHeader } from '@/components/ui/page-header';
import { UserAdminNotesSection } from '@/components/features/users/user-admin-notes-section';
import { UserDetailOpsPanel } from '@/components/features/users/user-detail-ops-panel';
import { UserDetailSkeleton } from '@/components/features/users/user-detail-skeleton';
import { UserLeaveSection } from '@/components/features/users/user-leave-section';
import { UserOcrTable } from '@/components/features/users/user-ocr-table';
import { UserPendingExtraLeaves } from '@/components/features/users/user-pending-extra-leaves';
import {
  CollapsibleDataPanel,
  DeviceSection,
  ProfileDetailsGrid,
  ProfileHero,
} from '@/components/features/users/user-profile-ui';
import { UserSessionsTable } from '@/components/features/users/user-sessions-table';
import { UserSessionInvitesSection } from '@/components/features/users/user-session-invites-section';
import { UserWalletStats } from '@/components/features/users/user-wallet-stats';
import { WalletTransactionsTable } from '@/components/features/users/wallet-transactions-table';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  addUserNote,
  adjustUserWallet,
  approveUserExtraLeave,
  creditUserWallet,
  fetchUserDetail,
  resetUserDetail,
  resetUserOverridesDraft,
  saveUserFeatureOverrides,
  selectOverridesDirty,
  selectUserDetail,
  setUserDetailForm,
  setUserOverridesDraft,
  submitUserBadgeCorrection,
  toggleUserDisabled,
  updateUserAvatar,
} from '@/lib/store/slices/users/userDetailSlice';
import { getUserDisplayName } from '@/lib/user-display';
import type { UserLeaveSummary } from '@/lib/types/admin';
import { btn, linkAccent } from '@/lib/ui-classes';

const emptyLeaveSummary: UserLeaveSummary = {
  totalAllowed: 0,
  used: 0,
  remaining: 0,
};

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
    partnerRequestsSent,
    partnerRequestsReceived,
    sessionShareCodes,
    leaveSummary,
    leaves,
    overrides,
    form,
    error,
    message,
    status,
    refreshing,
    actionLoading,
  } = useAppSelector(selectUserDetail);
  const overridesDirty = useAppSelector(selectOverridesDirty);

  useEffect(() => {
    if (userId) dispatch(fetchUserDetail(userId));
    return () => {
      dispatch(resetUserDetail());
    };
  }, [dispatch, userId]);

  const loading = status === 'loading' && !user;
  const displayName = user ? getUserDisplayName(user) : userId;

  return (
    <AdminShell>
      <PageHeader
        title="User profile"
        description={user?.phone ?? displayName}
        apiHint="GET /users/:id · PATCH /users/:id"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <Link
                href={`/logs?userId=${encodeURIComponent(userId)}`}
                className={`${btn} text-sm`}
              >
                Activity logs
              </Link>
            ) : null}
            <button
              type="button"
              className={btn}
              disabled={loading || refreshing}
              onClick={() => dispatch(fetchUserDetail(userId))}
              aria-label="Refresh profile"
            >
              <RefreshCw
                className={`size-4 ${refreshing ? 'animate-spin' : ''}`}
                strokeWidth={2}
              />
            </button>
            <Link href="/users" className={`${btn} text-sm`}>
              Back to users
            </Link>
          </div>
        }
      />
      <AlertMessage error={error} success={message} />

      {loading ? (
        <UserDetailSkeleton />
      ) : user ? (
        <div className="space-y-6">
          <ProfileHero user={user} />
          <UserWalletStats user={user} />
          <DeviceSection user={user} />
          <ProfileDetailsGrid user={user} />

          <UserDetailOpsPanel
            isDisabled={Boolean(user.isDisabled)}
            overrides={overrides}
            overridesDirty={overridesDirty}
            form={form}
            actionLoading={actionLoading}
            onOverridesChange={(next) => dispatch(setUserOverridesDraft(next))}
            onSaveOverrides={() => {
              if (overrides) {
                dispatch(saveUserFeatureOverrides({ userId, overrides }));
              }
            }}
            onResetOverrides={() => dispatch(resetUserOverridesDraft())}
            onFormChange={(patch) => dispatch(setUserDetailForm(patch))}
            onUpdateAvatar={() => dispatch(updateUserAvatar({ userId, avatar: form.avatar }))}
            onAddNote={() => {
              const trimmed = form.note.trim();
              if (trimmed) dispatch(addUserNote({ userId, note: trimmed }));
            }}
            onWalletAdjust={() => {
              const amount = Number(form.walletAmount);
              if (!Number.isFinite(amount)) return;
              const reason = form.walletReason.trim();
              if (!reason) return;
              dispatch(adjustUserWallet({ userId, amount, reason }));
            }}
            onWalletCredit={() => {
              const amount = Number(form.walletCreditAmount);
              if (!Number.isFinite(amount) || amount <= 0) return;
              const note = form.walletCreditNote.trim() || 'Manual credit';
              dispatch(creditUserWallet({ userId, amount, note }));
            }}
            onBadgeCorrection={() => {
              const type = form.badgeType.trim();
              const note = form.badgeNote.trim();
              if (!type || !note) return;
              dispatch(submitUserBadgeCorrection({ userId, type, note }));
            }}
            onToggleDisabled={() => dispatch(toggleUserDisabled(userId))}
          />

          <UserPendingExtraLeaves
            leaves={leaves}
            actionLoading={actionLoading === 'approveLeave'}
            onApprove={(leaveId) => dispatch(approveUserExtraLeave({ userId, leaveId }))}
          />

          <UserLeaveSection
            summary={leaveSummary ?? emptyLeaveSummary}
            leaves={leaves}
            loading={refreshing}
          />

          <WalletTransactionsTable
            transactions={walletTransactions}
            loading={refreshing}
          />

          <UserSessionInvitesSection
            userId={userId}
            sent={partnerRequestsSent}
            received={partnerRequestsReceived}
            shareCodes={sessionShareCodes}
            loading={refreshing}
          />

          <UserAdminNotesSection notes={adminNotes} />
          <UserSessionsTable sessions={sessions} />
          <UserOcrTable submissions={ocrSubmissions} />

          <p className="text-center text-xs text-slate-500 dark:text-zinc-500">
            <Link href={`/extra-leaves`} className={linkAccent}>
              Extra leaves queue
            </Link>
            {' · '}
            <Link href={`/wallet?userId=${encodeURIComponent(userId)}`} className={linkAccent}>
              Wallet admin
            </Link>
          </p>

          <CollapsibleDataPanel title="Raw profile payload" count={1} data={user} />
        </div>
      ) : status === 'failed' ? (
        <p className="text-sm text-rose-600 dark:text-rose-400">
          Could not load this user. Check the ID or try refresh.
        </p>
      ) : null}
    </AdminShell>
  );
}
