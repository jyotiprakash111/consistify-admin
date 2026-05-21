import type { SystemConfig } from '@/lib/types/admin';

/** Client-side checks before PUT /systemconfig (mirrors key backend rules). */
export function validateSystemConfig(config: SystemConfig): string | null {
  const { wallet, sessions, payment } = config;

  if (wallet.depositAmountInRupees < 0) {
    return 'Default deposit must be zero or positive.';
  }
  if (wallet.sessionFailureFine < 0 || wallet.phubFine < 0) {
    return 'Fine amounts must be zero or positive.';
  }
  if (sessions.maxSessionMinutes < 1) {
    return 'Max session length must be at least 1 minute.';
  }
  if (sessions.phubTiltAngle < 1 || sessions.phubTiltAngle > 90) {
    return 'Phone tilt angle must be between 1 and 90.';
  }
  if (sessions.phubTimeoutSeconds < 1) {
    return 'Tilt timeout must be at least 1 second.';
  }
  if (payment.minDepositInRupees > payment.maxDepositInRupees) {
    return 'Min deposit cannot be greater than max deposit.';
  }
  if (!payment.provider.trim()) {
    return 'Payment provider is required.';
  }
  if (!payment.currency.trim()) {
    return 'Currency is required.';
  }
  return null;
}
