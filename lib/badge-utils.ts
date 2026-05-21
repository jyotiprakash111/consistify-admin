import type { BadgeEvent, BadgeWinner } from '@/lib/types/badges';
import { getUserDisplayName } from '@/lib/user-display';
import type { AdminUser } from '@/lib/types/admin';

function pickString(...values: unknown[]): string {
  for (const v of values) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

export function normalizeBadgeEvent(raw: Record<string, unknown>, index: number): BadgeEvent {
  return {
    id: pickString(raw.id, raw._id, raw.eventId) || `badge-event-${index}`,
    userId: pickString(raw.userId, raw.user_id, raw.uid),
    userName: pickString(raw.userName, raw.user_name, raw.name),
    type: pickString(raw.type, raw.badgeType, raw.badge_type) || 'unknown',
    earnedAt: pickString(raw.earnedAt, raw.createdAt, raw.timestamp, raw.date),
    note: pickString(raw.note, raw.description, raw.reason) || undefined,
  };
}

export function normalizeBadgeEvents(items: Array<Record<string, unknown>>): BadgeEvent[] {
  return items.map((item, index) => normalizeBadgeEvent(item, index));
}

export function resolveUserName(
  userId: string,
  eventName: string,
  usersById: Map<string, AdminUser>,
): string {
  if (eventName) return eventName;
  const user = usersById.get(userId);
  if (user) return getUserDisplayName(user);
  return userId || 'Unknown user';
}

export function computeTopWinners(
  events: BadgeEvent[],
  usersById: Map<string, AdminUser>,
  limit = 5,
): BadgeWinner[] {
  const byUser = new Map<
    string,
    { badgeCount: number; types: Map<string, number>; lastEarnedAt?: string; userName: string }
  >();

  for (const event of events) {
    if (!event.userId) continue;
    const name = resolveUserName(event.userId, event.userName, usersById);
    const entry = byUser.get(event.userId) ?? {
      badgeCount: 0,
      types: new Map<string, number>(),
      userName: name,
    };
    entry.badgeCount += 1;
    entry.types.set(event.type, (entry.types.get(event.type) ?? 0) + 1);
    if (event.earnedAt && (!entry.lastEarnedAt || event.earnedAt > entry.lastEarnedAt)) {
      entry.lastEarnedAt = event.earnedAt;
    }
    byUser.set(event.userId, entry);
  }

  return Array.from(byUser.entries())
    .map(([userId, data]) => {
      let topBadgeType = '—';
      let topCount = 0;
      for (const [type, count] of data.types) {
        if (count > topCount) {
          topCount = count;
          topBadgeType = type;
        }
      }
      return {
        userId,
        userName: data.userName,
        badgeCount: data.badgeCount,
        topBadgeType,
        lastEarnedAt: data.lastEarnedAt,
      };
    })
    .sort((a, b) => b.badgeCount - a.badgeCount)
    .slice(0, limit);
}

export function getUserBadgeEvents(events: BadgeEvent[], userId: string): BadgeEvent[] {
  if (!userId) return [];
  return events
    .filter((e) => e.userId === userId)
    .sort((a, b) => (b.earnedAt || '').localeCompare(a.earnedAt || ''));
}

export function formatBadgeDate(value?: string) {
  if (!value?.trim()) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}
