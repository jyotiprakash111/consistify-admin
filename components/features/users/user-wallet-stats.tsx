'use client';

import { StatMini } from '@/components/features/users/user-profile-ui';
import { formatInr } from '@/lib/wallet-transaction-utils';
import type { AdminUser } from '@/lib/types/admin';

export function UserWalletStats({ user }: { user: AdminUser }) {
  const compliance =
    typeof user.complianceRate === 'number'
      ? `${Math.round(user.complianceRate)}%`
      : '—';

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <StatMini label="Wallet balance" value={formatInr(user.walletBalance)} />
      <StatMini label="Fines collected" value={formatInr(user.totalFineCollected)} />
      <StatMini label="Current streak" value={user.currentStreakDays} suffix="days" />
      <StatMini label="Compliance" value={compliance} />
    </div>
  );
}
