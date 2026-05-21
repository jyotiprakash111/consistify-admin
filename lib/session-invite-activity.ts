import type { PartnerRequestRow, SessionShareCodeRow } from '@/lib/types/session-invites';
import {
  partnerRequestStatusVariant,
  shareCodeStatusLabel,
  shareCodeStatusVariant,
} from '@/lib/session-invite-utils';

export type InviteTab = 'all' | 'in_app' | 'share_link';

export type SessionInviteActivityRow = {
  id: string;
  kind: 'in_app' | 'share_link';
  createdAt: string;
  statusLabel: string;
  statusVariant: 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  primaryLabel: string;
  primaryUserId: string;
  secondaryLabel: string;
  secondaryUserId?: string;
  code?: string;
  joinUrl?: string;
  note?: string | null;
};

export function buildInviteActivityRows(
  partnerRequests: PartnerRequestRow[],
  shareCodes: SessionShareCodeRow[],
): SessionInviteActivityRow[] {
  const fromPartners: SessionInviteActivityRow[] = partnerRequests.map((r) => ({
    id: `pr-${r.id}`,
    kind: 'in_app',
    createdAt: r.createdAt,
    statusLabel: r.status,
    statusVariant: partnerRequestStatusVariant(r.status),
    primaryLabel: r.fromUserName,
    primaryUserId: r.fromUserId,
    secondaryLabel: r.toUserName,
    secondaryUserId: r.toUserId,
  }));

  const fromShares: SessionInviteActivityRow[] = shareCodes.map((r) => ({
    id: `sc-${r.id}`,
    kind: 'share_link',
    createdAt: r.createdAt,
    statusLabel: shareCodeStatusLabel(r.isExpired),
    statusVariant: shareCodeStatusVariant(r.isExpired),
    primaryLabel: r.hostName,
    primaryUserId: r.userId,
    secondaryLabel: 'Share code',
    code: r.code,
    joinUrl: r.webJoinUrl,
    note: r.note,
  }));

  return [...fromPartners, ...fromShares].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function filterActivityByTab(rows: SessionInviteActivityRow[], tab: InviteTab) {
  if (tab === 'all') return rows;
  return rows.filter((r) => r.kind === tab);
}
