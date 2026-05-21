import type { AdminUser, UserLeaveRecord, UserLeaveSummary } from '@/lib/types/admin';

function pickNumber(...values: unknown[]): number | null {
  for (const v of values) {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return null;
}

function pickString(...values: unknown[]): string {
  for (const v of values) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

const USED_STATUSES = new Set(['approved', 'used', 'completed', 'taken', 'active']);
const PENDING_STATUSES = new Set(['pending', 'requested', 'awaiting']);

export function normalizeLeaveRecord(raw: Record<string, unknown>, index: number): UserLeaveRecord {
  return {
    id: pickString(raw.id, raw._id, raw.leaveId) || `leave-${index}`,
    status: pickString(raw.status, raw.state) || 'unknown',
    type: pickString(raw.type, raw.leaveType) || undefined,
    reason: pickString(raw.reason, raw.note, raw.description) || undefined,
    startDate: pickString(raw.startDate, raw.from, raw.start) || undefined,
    endDate: pickString(raw.endDate, raw.to, raw.end) || undefined,
    days: pickNumber(raw.days, raw.dayCount, raw.durationDays) ?? undefined,
    createdAt: pickString(raw.createdAt, raw.requestedAt, raw.date) || undefined,
    isExtra: Boolean(raw.isExtra ?? raw.extra ?? raw.extraLeave),
  };
}

export function normalizeLeaveRecords(items: Array<Record<string, unknown>>): UserLeaveRecord[] {
  return items.map((item, index) => normalizeLeaveRecord(item, index));
}

export function normalizeLeaveSummary(
  raw: Record<string, unknown> | null | undefined,
  leaves: UserLeaveRecord[],
  user?: AdminUser | null,
): UserLeaveSummary {
  const fromApi = raw ?? {};
  const usedFromLeaves = leaves.filter((l) =>
    USED_STATUSES.has(l.status.toLowerCase()),
  ).length;
  const pendingFromLeaves = leaves.filter((l) =>
    PENDING_STATUSES.has(l.status.toLowerCase()),
  ).length;

  const totalAllowed =
    pickNumber(
      fromApi.totalAllowed,
      fromApi.allowed,
      fromApi.leavesAllowed,
      fromApi.quota,
      fromApi.total,
      user?.leavesAllowed,
      user?.totalLeavesAllowed,
    ) ?? 0;

  const used =
    pickNumber(
      fromApi.used,
      fromApi.leavesUsed,
      fromApi.taken,
      fromApi.usedCount,
    ) ?? usedFromLeaves;

  const remaining =
    pickNumber(
      fromApi.remaining,
      fromApi.leavesRemaining,
      fromApi.left,
      fromApi.remainingCount,
    ) ?? Math.max(0, totalAllowed - used);

  const extraApproved =
    pickNumber(fromApi.extraApproved, fromApi.extraLeaves) ??
    leaves.filter((l) => l.isExtra && USED_STATUSES.has(l.status.toLowerCase())).length;

  const pending =
    pickNumber(fromApi.pending, fromApi.pendingCount) ?? pendingFromLeaves;

  return {
    totalAllowed,
    used,
    remaining,
    extraApproved,
    pending,
  };
}

export function parseLeavesPayload(
  data: Record<string, unknown>,
  user?: AdminUser | null,
): { summary: UserLeaveSummary; leaves: UserLeaveRecord[] } {
  const rawLeaves = (data.leaves ?? data.leaveHistory ?? data.records ?? []) as Array<
    Record<string, unknown>
  >;
  const leaves = Array.isArray(rawLeaves) ? normalizeLeaveRecords(rawLeaves) : [];
  const summaryRaw = (data.summary ?? data.leaveSummary ?? data.stats ?? data) as Record<
    string,
    unknown
  >;
  const summary = normalizeLeaveSummary(summaryRaw, leaves, user);
  return { summary, leaves };
}
