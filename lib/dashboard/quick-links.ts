import type { LucideIcon } from 'lucide-react';
import { navIconMap } from '@/lib/nav-icons';

export type DashboardQuickLink = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

const linkDefs: Array<{
  href: string;
  label: string;
  description: string;
}> = [
  { href: '/users', label: 'Users', description: 'Search, profile & leaves' },
  { href: '/leaves', label: 'Leaves', description: 'Approve & review leave records' },
  { href: '/wallet', label: 'Wallet', description: 'Credits & transactions' },
  { href: '/fine-collection', label: 'Fine collection', description: 'Balances & fines' },
  { href: '/ocr', label: 'OCR', description: 'Submissions & corrections' },
  { href: '/analytics', label: 'Analytics', description: 'Growth & retention' },
];

/** Curated shortcuts for the dashboard — not every nav item, only high-traffic ops. */
export const DASHBOARD_QUICK_LINKS: DashboardQuickLink[] = linkDefs.map((item) => ({
  ...item,
  icon: navIconMap[item.href] ?? navIconMap['/dashboard'],
}));
