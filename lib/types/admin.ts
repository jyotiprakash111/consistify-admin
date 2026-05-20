export type FeatureOverrides = {
  walletEnabled: boolean;
  badgeRewardsEnabled: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
};

export type DashboardMetrics = {
  totalUsers: number;
  activeToday: number;
  focusSessionsToday: number;
  focusSessionsWeek: number;
  totalFocusTimeHours: number;
  totalWalletDeposits: number;
  totalActiveBalances: number;
  failedIncompleteSessions: number;
};

export type AdminUser = {
  id: string;
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
