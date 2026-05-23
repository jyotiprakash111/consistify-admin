import {
  Award,
  BarChart3,
  BookOpen,
  CalendarDays,
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
  '/leaves': CalendarDays,
  '/exam-subjects': BookOpen,
  '/badges': Award,
  '/analytics': BarChart3,
  '/settings': Settings,
  '/logs': FileText,
};

export const LogoutIcon = LogOut;
