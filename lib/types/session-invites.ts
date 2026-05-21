export type PartnerRequestRow = {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUserName: string;
  toUserName: string;
  status: string;
  inviteType: 'in_app';
  createdAt: string;
  updatedAt: string;
};

export type SessionShareCodeRow = {
  id: string;
  userId: string;
  hostName: string;
  code: string;
  startsAt: string | null;
  endsAt: string | null;
  note: string | null;
  expiresAt: string | null;
  createdAt: string;
  isExpired: boolean;
  inviteType: 'share_link';
  shareChannels: ('whatsapp' | 'telegram' | 'other')[];
  deepLink: string;
  webJoinUrl?: string;
};

export type SessionInvitesSummary = {
  partnerRequests: {
    pending: number;
    accepted: number;
    declined: number;
    total: number;
  };
  shareCodes: {
    active: number;
    total: number;
  };
  note: string;
};
