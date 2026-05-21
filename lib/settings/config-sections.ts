import type { LucideIcon } from 'lucide-react';
import { Bell, CreditCard, Gamepad2, Timer, UserCircle, Wallet } from 'lucide-react';
import type { SystemConfig } from '@/lib/types/admin';

export type ConfigSectionKey = keyof SystemConfig;

export type DangerousFieldKind = 'maintenance' | 'payment-live';

export type ConfigFieldDef = {
  section: ConfigSectionKey;
  key: string;
  label: string;
  type: 'boolean' | 'number' | 'select' | 'text';
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  description?: string;
  dangerous?: DangerousFieldKind;
};

export type ConfigSectionDef = {
  id: ConfigSectionKey;
  title: string;
  description: string;
  icon: LucideIcon;
  fields: ConfigFieldDef[];
};

export const SYSTEM_CONFIG_SECTIONS: ConfigSectionDef[] = [
  {
    id: 'wallet',
    title: 'Wallet',
    description: 'Deposits, fines, and wallet availability',
    icon: Wallet,
    fields: [
      { section: 'wallet', key: 'enabled', label: 'Wallet enabled', type: 'boolean' },
      {
        section: 'wallet',
        key: 'depositAmountInRupees',
        label: 'Default deposit (₹)',
        type: 'number',
        min: 0,
        step: 1,
      },
      {
        section: 'wallet',
        key: 'sessionFailureFine',
        label: 'Session failure fine (₹)',
        type: 'number',
        min: 0,
        step: 1,
      },
      {
        section: 'wallet',
        key: 'phubFine',
        label: 'Phone tilt fine (₹)',
        type: 'number',
        min: 0,
        step: 1,
      },
    ],
  },
  {
    id: 'sessions',
    title: 'Sessions',
    description: 'Focus timer limits and maintenance',
    icon: Timer,
    fields: [
      {
        section: 'sessions',
        key: 'maintenanceMode',
        label: 'Maintenance mode',
        type: 'boolean',
        description: 'Blocks new sessions for all users',
        dangerous: 'maintenance',
      },
      {
        section: 'sessions',
        key: 'maxSessionMinutes',
        label: 'Max session length (minutes)',
        type: 'number',
        min: 1,
        max: 480,
        step: 1,
      },
      {
        section: 'sessions',
        key: 'phubTiltAngle',
        label: 'Phone tilt angle (°)',
        type: 'number',
        min: 1,
        max: 90,
        step: 1,
      },
      {
        section: 'sessions',
        key: 'phubTimeoutSeconds',
        label: 'Tilt timeout (seconds)',
        type: 'number',
        min: 1,
        max: 300,
        step: 1,
      },
    ],
  },
  {
    id: 'gamification',
    title: 'Gamification',
    description: 'Badges, coins, and sprint mode',
    icon: Gamepad2,
    fields: [
      { section: 'gamification', key: 'badgesEnabled', label: 'Badges enabled', type: 'boolean' },
      { section: 'gamification', key: 'coinsEnabled', label: 'Coins enabled', type: 'boolean' },
      {
        section: 'gamification',
        key: 'sprintModeEnabled',
        label: 'Sprint mode enabled',
        type: 'boolean',
      },
    ],
  },
  {
    id: 'avatar',
    title: 'Avatar',
    description: 'In-session avatar behaviour',
    icon: UserCircle,
    fields: [
      { section: 'avatar', key: 'slowOnTilt', label: 'Slow down on tilt', type: 'boolean' },
      { section: 'avatar', key: 'fallOnTimeout', label: 'Fall on tilt timeout', type: 'boolean' },
      {
        section: 'avatar',
        key: 'celebrationEnabled',
        label: 'Celebration animations',
        type: 'boolean',
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Global notification channels',
    icon: Bell,
    fields: [
      {
        section: 'notifications',
        key: 'emailEnabled',
        label: 'Email notifications',
        type: 'boolean',
      },
      { section: 'notifications', key: 'pushEnabled', label: 'Push notifications', type: 'boolean' },
    ],
  },
  {
    id: 'payment',
    title: 'Payment',
    description: 'Razorpay and deposit limits',
    icon: CreditCard,
    fields: [
      { section: 'payment', key: 'provider', label: 'Provider', type: 'text' },
      {
        section: 'payment',
        key: 'mode',
        label: 'Mode',
        type: 'select',
        options: [
          { value: 'test', label: 'Test' },
          { value: 'live', label: 'Live' },
        ],
        dangerous: 'payment-live',
      },
      { section: 'payment', key: 'currency', label: 'Currency', type: 'text' },
      {
        section: 'payment',
        key: 'minDepositInRupees',
        label: 'Min deposit (₹)',
        type: 'number',
        min: 0,
        step: 1,
      },
      {
        section: 'payment',
        key: 'maxDepositInRupees',
        label: 'Max deposit (₹)',
        type: 'number',
        min: 0,
        step: 1,
      },
      { section: 'payment', key: 'upiEnabled', label: 'UPI enabled', type: 'boolean' },
      { section: 'payment', key: 'cardsEnabled', label: 'Cards enabled', type: 'boolean' },
    ],
  },
];
