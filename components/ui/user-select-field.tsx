'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { FormField, SelectInput, TextInput } from '@/components/ui/form-field';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import {
  defaultUsersListFilters,
  fetchUsersList,
} from '@/lib/store/slices/users/usersListSlice';
import type { AdminUser } from '@/lib/types/admin';
import { getUserDisplayName } from '@/lib/user-display';
import { inputShell, mutedText } from '@/lib/ui-classes';

export type UserSelectFieldProps = {
  value: string;
  onChange: (userId: string, user: AdminUser | null) => void;
  label?: string;
  /** Show wallet balance for the selected user */
  showWalletBalance?: boolean;
  /** Called when a user is picked from the dropdown */
  onUserSelect?: (user: AdminUser) => void;
  className?: string;
  /** Shorter labels and inline search + select layout */
  compact?: boolean;
  /** Fused search + select with chip for selection */
  modern?: boolean;
  /** Full-width search with dropdown list (no side select) */
  combobox?: boolean;
};

function formatUserOptionLabel(
  user: AdminUser,
  showWalletBalance: boolean,
  compact: boolean,
) {
  const name = getUserDisplayName(user);
  const phone = user.phone?.trim();
  const wallet = showWalletBalance
    ? ` · ₹${user.walletBalance.toLocaleString('en-IN')}`
    : '';
  if (compact) {
    if (phone) return `${name} · ${phone}${wallet}`;
    return `${name}${wallet}`;
  }
  const idHint = user.id.length > 12 ? `${user.id.slice(0, 8)}…` : user.id;
  if (phone) return `${name} — ${phone}${wallet} (${idHint})`;
  return `${name}${wallet} (${idHint})`;
}

export function UserSelectField({
  value,
  onChange,
  label = 'User',
  showWalletBalance = false,
  onUserSelect,
  className = '',
  compact = false,
  modern = false,
  combobox = false,
}: UserSelectFieldProps) {
  const dispatch = useAppDispatch();
  const { users, status } = useAppSelector((s) => s.usersList);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (users.length === 0 && status !== 'loading') {
      dispatch(fetchUsersList(defaultUsersListFilters));
    }
  }, [dispatch, users.length, status]);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) =>
      getUserDisplayName(a).localeCompare(getUserDisplayName(b), 'en', { sensitivity: 'base' }),
    );
  }, [users]);

  const filteredUsers = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return sortedUsers;
    return sortedUsers.filter(
      (u) =>
        u.id.toLowerCase().includes(q) ||
        u.phone?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        getUserDisplayName(u).toLowerCase().includes(q),
    );
  }, [sortedUsers, filter]);

  const selectedUser = useMemo(
    () => users.find((u) => u.id === value) ?? null,
    [users, value],
  );

  function handleSelect(userId: string) {
    const user = users.find((u) => u.id === userId) ?? null;
    onChange(userId, user);
    if (user) onUserSelect?.(user);
  }

  const loading = status === 'loading' && users.length === 0;
  const [listOpen, setListOpen] = useState(false);

  const searchInput = (
    <TextInput
      embedded={modern || combobox}
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      placeholder={
        modern || compact || combobox
          ? 'Search by name, phone, or email'
          : 'Filter by name, phone, email, or ID'
      }
      disabled={loading}
      onFocus={() => combobox && setListOpen(true)}
    />
  );

  const userSelect = (
    <SelectInput
      value={value}
      onChange={(e) => handleSelect(e.target.value)}
      disabled={loading || filteredUsers.length === 0}
      embedded={modern}
      className={modern ? 'sm:max-w-[14rem]' : undefined}
    >
      <option value="">{loading ? 'Loading…' : 'All users'}</option>
      {filteredUsers.map((user) => (
        <option key={user.id} value={user.id}>
          {formatUserOptionLabel(user, showWalletBalance, compact || modern)}
        </option>
      ))}
    </SelectInput>
  );

  if (combobox) {
    const showList = listOpen && !loading && (filter.trim() || !value);
    return (
      <div className={`grid gap-2 ${className}`}>
        {label ? (
          <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{label}</span>
        ) : null}
        <div
          className="relative"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
              setListOpen(false);
            }
          }}
        >
          <div className={inputShell}>
            <Search
              className="size-4 shrink-0 text-slate-400 dark:text-zinc-500"
              strokeWidth={2}
            />
            {selectedUser && !filter.trim() ? (
              <span className="inline-flex min-w-0 flex-1 items-center gap-1">
                <span className="truncate text-sm font-medium text-slate-800 dark:text-zinc-200">
                  {getUserDisplayName(selectedUser)}
                  {selectedUser.phone ? (
                    <span className="font-normal text-slate-500 dark:text-zinc-500">
                      {' '}
                      · {selectedUser.phone}
                    </span>
                  ) : null}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    handleSelect('');
                    setFilter('');
                  }}
                  className="shrink-0 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-zinc-800"
                  aria-label="Clear user"
                >
                  <X className="size-4" strokeWidth={2} />
                </button>
              </span>
            ) : (
              searchInput
            )}
          </div>
          {showList ? (
            <ul
              className="absolute z-20 mt-1 max-h-52 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
              role="listbox"
            >
              <li>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    handleSelect('');
                    setFilter('');
                    setListOpen(false);
                  }}
                >
                  All users
                </button>
              </li>
              {filteredUsers.slice(0, 50).map((user) => (
                <li key={user.id}>
                  <button
                    type="button"
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-indigo-50 dark:hover:bg-indigo-500/10 ${
                      value === user.id
                        ? 'bg-indigo-50 font-medium text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200'
                        : 'text-slate-800 dark:text-zinc-200'
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      handleSelect(user.id);
                      setFilter('');
                      setListOpen(false);
                    }}
                  >
                    {formatUserOptionLabel(user, showWalletBalance, true)}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    );
  }

  if (modern) {
    return (
      <div className={`grid gap-2 ${className}`}>
        {label ? (
          <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">{label}</span>
        ) : null}
        <div className={`${inputShell} overflow-hidden`}>
          <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
            <Search
              className="size-4 shrink-0 text-slate-400 dark:text-zinc-500"
              strokeWidth={2}
            />
            {selectedUser ? (
              <span className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md bg-indigo-50 py-0.5 pl-2 pr-1 text-sm font-medium text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-200">
                <span className="truncate">
                  {getUserDisplayName(selectedUser)}
                  {selectedUser.phone ? ` · ${selectedUser.phone}` : ''}
                </span>
                <button
                  type="button"
                  onClick={() => handleSelect('')}
                  className="shrink-0 rounded p-0.5 text-indigo-600 hover:bg-indigo-100 dark:text-indigo-300 dark:hover:bg-indigo-500/20"
                  aria-label="Clear user filter"
                >
                  <X className="size-3.5" strokeWidth={2} />
                </button>
              </span>
            ) : (
              searchInput
            )}
          </div>
          <div className="flex shrink-0 items-center border-l border-slate-200 dark:border-zinc-700">
            {userSelect}
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`grid gap-1.5 ${className}`}>
        {label ? (
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-500">
            {label}
          </span>
        ) : null}
        <div className="grid gap-2 sm:grid-cols-2">
          {searchInput}
          {userSelect}
        </div>
        {selectedUser ? (
          <p className={`${mutedText} truncate text-xs`} title={selectedUser.id}>
            ID: <span className="font-mono">{selectedUser.id}</span>
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className={`grid gap-2 ${className}`}>
      <FormField label={label}>
        {searchInput}
      </FormField>
      {userSelect}
      {selectedUser ? (
        <p className={`${mutedText} text-xs`}>
          User ID: <span className="font-mono text-slate-600 dark:text-zinc-400">{selectedUser.id}</span>
          {showWalletBalance ? (
            <>
              {' '}
              · Wallet:{' '}
              <span className="font-medium text-slate-700 dark:text-zinc-300">
                ₹{selectedUser.walletBalance.toLocaleString('en-IN')}
              </span>
            </>
          ) : null}
        </p>
      ) : (
        <p className={`${mutedText} text-xs`}>
          {filteredUsers.length === 0 && !loading
            ? 'No users match your filter.'
            : 'Choose a user by name; the ID is applied automatically.'}
        </p>
      )}
    </div>
  );
}
