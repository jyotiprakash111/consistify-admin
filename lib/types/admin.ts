export type FeatureOverrides = {
  walletEnabled: boolean;
  badgeRewardsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
};

export type AdminUser = {
  id: string;
  name?: string;
  userName?: string;
  phone: string;
  email: string;
  gender?: string;
  avatar: string;
  subscriptionTier: string;
  registeredAt: string;
  walletBalance: number;
  refundEligibleAmount: number;
  totalFineCollected: number;
  currentStreakDays: number;
  partnerMatchCount: number;
  complianceRate: number;
  lastActiveAt: string;
  isActive: boolean;
  isDisabled: boolean;
  signupSource: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  lastDeviceType: string;
  lastAppVersion: string;
  lastLocation: string;
  tags: string[];
  walletEnabled?: boolean;
  badgeRewardsEnabled?: boolean;
  emailNotificationsEnabled?: boolean;
  pushNotificationsEnabled?: boolean;
  leavesAllowed?: number;
  totalLeavesAllowed?: number;
  leavesUsed?: number;
  leavesRemaining?: number;
};

export type UserLeaveRecord = {
  id: string;
  status: string;
  type?: string;
  reason?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  createdAt?: string;
  isExtra?: boolean;
};

export type UserLeaveSummary = {
  totalAllowed: number;
  used: number;
  remaining: number;
  extraApproved?: number;
  pending?: number;
};

export type SystemConfig = {
  wallet: {
    enabled: boolean;
    depositAmountInRupees: number;
    sessionFailureFine: number;
    phubFine: number;
  };
  sessions: {
    maintenanceMode: boolean;
    maxSessionMinutes: number;
    phubTiltAngle: number;
    phubTimeoutSeconds: number;
  };
  gamification: {
    badgesEnabled: boolean;
    coinsEnabled: boolean;
    sprintModeEnabled: boolean;
  };
  avatar: {
    slowOnTilt: boolean;
    fallOnTimeout: boolean;
    celebrationEnabled: boolean;
  };
  notifications: { emailEnabled: boolean; pushEnabled: boolean };
  payment: {
    provider: string;
    mode: 'test' | 'live';
    currency: string;
    minDepositInRupees: number;
    maxDepositInRupees: number;
    upiEnabled: boolean;
    cardsEnabled: boolean;
  };
};

export type PendingExtraLeave = {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  examGroup: string;
  leaveDate: string;
  monthKey: string;
  reason: string;
  createdAt: string;
};

export type FineCollectionUser = {
  userId: string;
  userName: string;
  plan: string;
  walletBalance: number;
  fineCollected: number;
  applicableToday: number;
  difference: number;
};

export type AdminLog = {
  id: string;
  action: string;
  userId: string | null;
  details: unknown;
  createdAt: string;
};
