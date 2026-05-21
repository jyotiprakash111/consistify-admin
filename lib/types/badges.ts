export type BadgeDistributionItem = {
  type: string;
  count: number;
};

export type BadgeEvent = {
  id: string;
  userId: string;
  userName: string;
  type: string;
  earnedAt: string;
  note?: string;
};

export type BadgeWinner = {
  userId: string;
  userName: string;
  badgeCount: number;
  topBadgeType: string;
  lastEarnedAt?: string;
};

export type BadgeSummaryPayload = {
  totalBadges: number;
  distribution: BadgeDistributionItem[];
  recentEvents: BadgeEvent[];
  topWinners: BadgeWinner[];
};
