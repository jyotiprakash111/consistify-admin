import type { AdminUser } from '@/lib/types/admin';
import type { UsersListFilters } from '@/lib/store/slices/users/usersListSlice';
import { formatGender, getUserDisplayName } from '@/lib/user-display';

export function applyClientUserFilters(users: AdminUser[], filters: UsersListFilters): AdminUser[] {
  return users.filter((u) => {
    const q = filters.search.trim().toLowerCase();
    if (q) {
      const name = getUserDisplayName(u).toLowerCase();
      const email = (u.email ?? '').toLowerCase();
      const phone = (u.phone ?? '').toLowerCase();
      const userName = (u.userName ?? '').toLowerCase();
      const id = u.id.toLowerCase();
      const matches =
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        userName.includes(q) ||
        id.includes(q);
      if (!matches) return false;
    }

    if (filters.gender !== 'all') {
      const g = (u.gender ?? '').trim().toLowerCase();
      if (g !== filters.gender.toLowerCase()) return false;
    }

    if (filters.tier !== 'all' && u.subscriptionTier !== filters.tier) return false;

    if (filters.signupSource !== 'all' && (u.signupSource ?? '') !== filters.signupSource) {
      return false;
    }

    if (filters.status === 'disabled' && !u.isDisabled) return false;

    return true;
  });
}

export function uniqueTiers(users: AdminUser[]): string[] {
  const tiers = new Set(users.map((u) => u.subscriptionTier).filter(Boolean));
  return Array.from(tiers).sort();
}

export function uniqueSignupSources(users: AdminUser[]): string[] {
  const sources = new Set(users.map((u) => u.signupSource).filter(Boolean));
  return Array.from(sources).sort();
}
