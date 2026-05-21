import type { AdminUser } from '@/lib/types/admin';

/** Display name from API fields or sensible fallbacks. */
export function getUserDisplayName(user: AdminUser): string {
  const name = user.name?.trim() || user.userName?.trim();
  if (name) return name;
  if (user.email?.trim()) {
    const local = user.email.split('@')[0]?.trim();
    if (local) return local;
  }
  return user.phone?.trim() || '—';
}

export function formatGender(gender?: string) {
  if (!gender?.trim()) return '—';
  const g = gender.trim();
  return g.charAt(0).toUpperCase() + g.slice(1).toLowerCase();
}

export function getUserStatusLabel(user: AdminUser) {
  if (user.isDisabled) return 'Disabled';
  if (user.isActive) return 'Active';
  return 'Inactive';
}
