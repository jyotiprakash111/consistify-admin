import {
  Award,
  BarChart3,
  BookOpen,
  CalendarClock,
  FileText,
  LayoutDashboard,
  LogOut,
  Scale,
  ScanLine,
  Send,
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
  '/session-invites': Send,
  '/extra-leaves': CalendarClock,
  '/exam-subjects': BookOpen,
  '/badges': Award,
  '/analytics': BarChart3,
  '/settings': Settings,
  '/logs': FileText,
};

export const LogoutIcon = LogOut;
