'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { UserCog } from 'lucide-react';
import {
  FeatureOverrideFields,
  FeatureOverrideLegend,
} from '@/components/features/users/feature-override-fields';
import { AlertMessage } from '@/components/ui/alert-message';
import { DataTable } from '@/components/ui/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { UserSelectField } from '@/components/ui/user-select-field';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { FEATURE_OVERRIDE_ITEMS } from '@/lib/feature-override-meta';
import {
  defaultUsersListFilters,
  fetchUsersList,
} from '@/lib/store/slices/users/usersListSlice';
import {
  fetchFeatureOverrides,
  fetchUserFeatureOverride,
  saveUserFeatureOverride,
  selectFeatureOverrides,
  setSelectedOverridesDraft,
  setSelectedUserId,
  updateRowOverrideDraft,
} from '@/lib/store/slices/users/featureOverridesSlice';
import type { FeatureOverrides } from '@/lib/types/admin';
import type { OverrideRow } from '@/lib/store/slices/users/featureOverridesSlice';
import { btn, btnPrimary, card, linkAccent, mutedText, sectionTitle } from '@/lib/ui-classes';

export function UserFeatureControls() {
  const dispatch = useAppDispatch();
  const {
    rows,
    selectedUserId,
    selectedOverrides,
    selectedUserName,
    error,
    message,
    status,
  } = useAppSelector(selectFeatureOverrides);
  const [rowSavingId, setRowSavingId] = useState<string | null>(null);

  const isLoading = status === 'loading' && rows.length === 0;

  useEffect(() => {
    dispatch(fetchFeatureOverrides());
    dispatch(fetchUsersList(defaultUsersListFilters));
  }, [dispatch]);

  function onSaveSelected() {
    if (!selectedUserId.trim() || !selectedOverrides) return;
    dispatch(
      saveUserFeatureOverride({ userId: selectedUserId.trim(), overrides: selectedOverrides }),
    );
  }

  async function onSaveRow(userId: string, overrides: FeatureOverrides) {
    setRowSavingId(userId);
    await dispatch(saveUserFeatureOverride({ userId, overrides }));
    setRowSavingId(null);
  }

  return (
    <div className="space-y-6">
      <FeatureOverrideLegend />
      <AlertMessage error={error} success={message} />

      <section className={card}>
        <div className="mb-4 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
            <UserCog className="size-4" strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
              Enable / disable features for a user
            </h3>
            <p className={`${mutedText} text-xs`}>PATCH /users/:id/feature-overrides</p>
          </div>
        </div>

        <div className="max-w-xl">
          <UserSelectField
            label="Select user"
            value={selectedUserId}
            onChange={(userId) => {
              dispatch(setSelectedUserId(userId));
              if (userId) dispatch(fetchUserFeatureOverride(userId));
            }}
          />
        </div>

        {selectedOverrides ? (
          <div className="mt-6 border-t border-slate-200/70 pt-6 dark:border-zinc-800">
            <p className="mb-3 text-sm font-medium text-slate-900 dark:text-white">
              Features for{' '}
              <span className="text-indigo-600 dark:text-indigo-400">
                {selectedUserName || selectedUserId}
              </span>
            </p>
            <FeatureOverrideFields
              overrides={selectedOverrides}
              onChange={(next) => dispatch(setSelectedOverridesDraft(next))}
            />
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={onSaveSelected} className={btnPrimary}>
                Save for this user
              </button>
              <Link href={`/users/${selectedUserId}`} className={btn}>
                Open full profile
              </Link>
            </div>
          </div>
        ) : null}
      </section>

      <section>
        <h3 className={sectionTitle}>All users with overrides</h3>
        <p className={`${mutedText} mb-4 text-sm`}>
          Toggle features inline and save per row. Users without overrides can be configured above.
        </p>
        {isLoading ? (
          <DataTableSkeleton columns={6} rows={6} />
        ) : (
          <DataTable
            rows={rows}
            rowKey={(r) => r.userId}
            emptyMessage="No per-user overrides yet. Load a user above to create settings."
            columns={[
              {
                key: 'user',
                header: 'User',
                render: (r: OverrideRow) => (
                  <Link href={`/users/${r.userId}`} className={linkAccent}>
                    {r.userName || r.userId}
                  </Link>
                ),
              },
              ...FEATURE_OVERRIDE_ITEMS.map((item) => ({
                key: item.key,
                header: item.label,
                render: (r: OverrideRow) => (
                  <input
                    type="checkbox"
                    className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/30 dark:border-zinc-600 dark:bg-zinc-900"
                    checked={r[item.key]}
                    onChange={(e) =>
                      dispatch(
                        updateRowOverrideDraft({
                          userId: r.userId,
                          overrides: {
                            walletEnabled: r.walletEnabled,
                            badgeRewardsEnabled: r.badgeRewardsEnabled,
                            emailNotificationsEnabled: r.emailNotificationsEnabled,
                            pushNotificationsEnabled: r.pushNotificationsEnabled,
                            [item.key]: e.target.checked,
                          },
                        }),
                      )
                    }
                    aria-label={`${item.label} for ${r.userId}`}
                  />
                ),
              })),
              {
                key: 'save',
                header: '',
                render: (r: OverrideRow) => (
                  <button
                    type="button"
                    disabled={rowSavingId === r.userId}
                    onClick={() =>
                      onSaveRow(r.userId, {
                        walletEnabled: r.walletEnabled,
                        badgeRewardsEnabled: r.badgeRewardsEnabled,
                        emailNotificationsEnabled: r.emailNotificationsEnabled,
                        pushNotificationsEnabled: r.pushNotificationsEnabled,
                      })
                    }
                    className={`${btnPrimary} !px-2.5 !py-1.5 text-xs`}
                  >
                    {rowSavingId === r.userId ? 'Saving…' : 'Save'}
                  </button>
                ),
              },
            ]}
          />
        )}
      </section>
    </div>
  );
}
