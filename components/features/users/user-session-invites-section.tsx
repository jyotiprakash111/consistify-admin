'use client';

import Link from 'next/link';
import { CardSection } from '@/components/ui/card-section';
import { DataTable } from '@/components/ui/data-table';
import { DataTableSkeleton } from '@/components/ui/data-table-skeleton';
import { StatusBadge } from '@/components/features/users/user-profile-ui';
import type { PartnerRequestRow, SessionShareCodeRow } from '@/lib/types/session-invites';
import {
  formatInviteDate,
  partnerRequestStatusVariant,
  shareCodeStatusLabel,
  shareCodeStatusVariant,
} from '@/lib/session-invite-utils';
import { linkAccent, mutedText } from '@/lib/ui-classes';

type UserSessionInvitesSectionProps = {
  userId: string;
  sent: PartnerRequestRow[];
  received: PartnerRequestRow[];
  shareCodes: SessionShareCodeRow[];
  loading?: boolean;
};

export function UserSessionInvitesSection({
  userId,
  sent,
  received,
  shareCodes,
  loading,
}: UserSessionInvitesSectionProps) {
  if (loading) {
    return (
      <CardSection title="Session invites">
        <DataTableSkeleton columns={5} rows={4} />
      </CardSection>
    );
  }

  const hasAny = sent.length > 0 || received.length > 0 || shareCodes.length > 0;

  return (
    <CardSection
      title="Session invites"
      className="space-y-6"
    >
      <p className={`${mutedText} -mt-2 text-sm`}>
        Partner invites and share codes for joint focus sessions.{' '}
        <Link href={`/session-invites?userId=${encodeURIComponent(userId)}`} className={linkAccent}>
          View all session invites →
        </Link>
      </p>

      {!hasAny ? (
        <p className={`${mutedText} text-sm`}>No session invites or share codes for this user.</p>
      ) : null}

      {sent.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-800 dark:text-zinc-200">
            Sent in-app invites ({sent.length})
          </h4>
          <DataTable
            rows={sent}
            rowKey={(r) => r.id}
            emptyMessage="None"
            columns={[
              {
                key: 'to',
                header: 'To',
                render: (r) => (
                  <Link href={`/users/${r.toUserId}`} className={linkAccent}>
                    {r.toUserName}
                  </Link>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <StatusBadge
                    label={r.status}
                    variant={partnerRequestStatusVariant(r.status)}
                  />
                ),
              },
              { key: 'sent', header: 'Sent', render: (r) => formatInviteDate(r.createdAt) },
            ]}
          />
        </div>
      ) : null}

      {received.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-800 dark:text-zinc-200">
            Received in-app invites ({received.length})
          </h4>
          <DataTable
            rows={received}
            rowKey={(r) => r.id}
            emptyMessage="None"
            columns={[
              {
                key: 'from',
                header: 'From',
                render: (r) => (
                  <Link href={`/users/${r.fromUserId}`} className={linkAccent}>
                    {r.fromUserName}
                  </Link>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <StatusBadge
                    label={r.status}
                    variant={partnerRequestStatusVariant(r.status)}
                  />
                ),
              },
              { key: 'sent', header: 'Received', render: (r) => formatInviteDate(r.createdAt) },
            ]}
          />
        </div>
      ) : null}

      {shareCodes.length > 0 ? (
        <div>
          <h4 className="mb-2 text-sm font-semibold text-slate-800 dark:text-zinc-200">
            Share codes (WhatsApp / Telegram / link) ({shareCodes.length})
          </h4>
          <DataTable
            rows={shareCodes}
            rowKey={(r) => r.id}
            emptyMessage="None"
            columns={[
              {
                key: 'code',
                header: 'Code',
                render: (r) => (
                  <span className="font-mono text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                    {r.code}
                  </span>
                ),
              },
              {
                key: 'status',
                header: 'Status',
                render: (r) => (
                  <StatusBadge
                    label={shareCodeStatusLabel(r.isExpired)}
                    variant={shareCodeStatusVariant(r.isExpired)}
                  />
                ),
              },
              { key: 'created', header: 'Created', render: (r) => formatInviteDate(r.createdAt) },
              { key: 'expires', header: 'Expires', render: (r) => formatInviteDate(r.expiresAt) },
              {
                key: 'note',
                header: 'Note',
                render: (r) => r.note?.trim() || '—',
              },
            ]}
          />
        </div>
      ) : null}
    </CardSection>
  );
}
