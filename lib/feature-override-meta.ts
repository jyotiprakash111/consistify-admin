import type { FeatureOverrides } from '@/lib/types/admin';

export type FeatureOverrideKey = keyof FeatureOverrides;

export type FeatureOverrideMeta = {
  key: FeatureOverrideKey;
  label: string;
  description: string;
  globalHint?: string;
};

export const FEATURE_OVERRIDE_ITEMS: FeatureOverrideMeta[] = [
  {
    key: 'walletEnabled',
    label: 'Wallet',
    description: 'Deposits, balance, and wallet-based fines for this user',
    globalHint: 'Requires global wallet enabled in System config',
  },
  {
    key: 'badgeRewardsEnabled',
    label: 'Badge rewards',
    description: 'Earn and redeem badge rewards in the app',
    globalHint: 'Requires global badges enabled in Gamification',
  },
  {
    key: 'emailNotificationsEnabled',
    label: 'Email notifications',
    description: 'Transactional and reminder emails',
    globalHint: 'Requires global email notifications enabled',
  },
  {
    key: 'pushNotificationsEnabled',
    label: 'Push notifications',
    description: 'Mobile push alerts and session reminders',
    globalHint: 'Requires global push notifications enabled',
  },
];

export const defaultFeatureOverrides: FeatureOverrides = {
  walletEnabled: true,
  badgeRewardsEnabled: true,
  emailNotificationsEnabled: true,
  pushNotificationsEnabled: true,
};
