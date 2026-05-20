import {
  Award,
  BarChart3,
  FileText,
  LayoutDashboard,
  LogOut,
  Scale,
  ScanLine,
  Settings,
  SlidersHorizontal,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export const navIconMap: Record<string, LucideIcon> = {
  '/dashboard': LayoutDashboard,
  '/users': Users,
  '/users/feature-overrides': SlidersHorizontal,
  '/fine-collection': Scale,
  '/wallet': Wallet,
  '/ocr': ScanLine,
  '/badges': Award,
  '/analytics': BarChart3,
  '/settings': Settings,
  '/logs': FileText,
};

export const LogoutIcon = LogOut;
