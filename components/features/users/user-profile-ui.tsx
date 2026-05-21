import {
  BadgeCheck,
  Calendar,
  Clock,
  Globe,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  User,
} from 'lucide-react';
import type { AdminUser } from '@/lib/types/admin';
import { formatGender, getUserDisplayName } from '@/lib/user-display';
import { card, mutedText } from '@/lib/ui-classes';

export { formatGender };

export function formatDate(value?: string) {
  if (!value?.trim()) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function UserAvatarDisplay({
  user,
  size = 'md',
}: {
  user: AdminUser;
  size?: 'md' | 'lg';
}) {
  const avatar = user.avatar?.trim() ?? '';
  const isImageUrl = /^https?:\/\//i.test(avatar);
  const sizeClass = size === 'lg' ? 'size-20 text-lg' : 'size-12 text-sm';

  if (isImageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt=""
        className={`${sizeClass} shrink-0 rounded-2xl object-cover ring-2 ring-indigo-500/20`}
      />
    );
  }

  const initials = avatar
    ? avatar.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase() || '?'
    : user.phone?.replace(/\D/g, '').slice(-2) || '?';

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white shadow-lg shadow-indigo-500/25`}
    >
      {initials}
    </div>
  );
}

export function StatusBadge({
  label,
  variant,
}: {
  label: string;
  variant: 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
}) {
  const styles = {
    success: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    warning: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    danger: 'bg-rose-500/10 text-rose-700 dark:text-rose-400',
    neutral: 'bg-slate-500/10 text-slate-600 dark:text-zinc-400',
    accent: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
  };
  return (
    <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${styles[variant]}`}>
      {label}
    </span>
  );
}

export function VerificationBadge({ verified, label }: { verified: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-xs font-medium ${
        verified
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          : 'bg-slate-500/10 text-slate-500 dark:text-zinc-500'
      }`}
    >
      <BadgeCheck className="size-3.5" strokeWidth={2} />
      {label} {verified ? 'verified' : 'unverified'}
    </span>
  );
}

export function DetailItem({
  label,
  value,
  icon: Icon,
  highlight,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3.5 ${
        highlight
          ? 'border-indigo-200/80 bg-indigo-50/50 dark:border-indigo-500/30 dark:bg-indigo-500/5'
          : 'border-slate-200/70 bg-slate-50/50 dark:border-zinc-800 dark:bg-zinc-900/50'
      }`}
    >
      <div className="mb-1 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-zinc-500">
        {Icon ? <Icon className="size-3.5" strokeWidth={2} /> : null}
        {label}
      </div>
      <div className="text-sm font-medium text-slate-900 dark:text-zinc-100">{value}</div>
    </div>
  );
}

export function StatMini({
  label,
  value,
  suffix,
}: {
  label: string;
  value: string | number;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className={`${mutedText} text-xs`}>{label}</div>
      <div className="mt-0.5 text-xl font-bold tabular-nums text-slate-900 dark:text-white">
        {value}
        {suffix ? <span className="ml-0.5 text-sm font-normal text-slate-500">{suffix}</span> : null}
      </div>
    </div>
  );
}

export function CollapsibleDataPanel({
  title,
  count,
  data,
}: {
  title: string;
  count: number;
  data: unknown;
}) {
  return (
    <details className={`${card} group`}>
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
        <span className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
          {title}
        </span>
        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 group-open:bg-indigo-500/10 group-open:text-indigo-700 dark:bg-zinc-800 dark:text-zinc-400 dark:group-open:text-indigo-400">
          {count} records
        </span>
      </summary>
      <pre className="mt-4 max-h-80 overflow-auto rounded-xl border border-slate-200/70 bg-slate-50/80 p-4 font-mono text-xs leading-relaxed text-slate-800 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </details>
  );
}

export function ProfileHero({ user }: { user: AdminUser }) {
  const statusVariant = user.isDisabled ? 'danger' : user.isActive ? 'success' : 'warning';
  const statusLabel = user.isDisabled ? 'Disabled' : user.isActive ? 'Active' : 'Inactive';

  return (
    <div className={`${card} flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between`}>
      <div className="flex items-center gap-5">
        <UserAvatarDisplay user={user} size="lg" />
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            {user.phone || user.id}
          </h2>
          <p className="mt-0.5 text-sm font-medium text-slate-700 dark:text-zinc-300">
            {getUserDisplayName(user)}
          </p>
          <p className="text-sm text-slate-500 dark:text-zinc-400">{user.email || 'No email'}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge label={statusLabel} variant={statusVariant} />
            <StatusBadge label={user.subscriptionTier || 'free'} variant="accent" />
            {user.gender ? (
              <StatusBadge label={formatGender(user.gender)} variant="neutral" />
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <VerificationBadge verified={user.phoneVerified} label="Phone" />
        <VerificationBadge verified={user.emailVerified} label="Email" />
      </div>
    </div>
  );
}

export function DeviceSection({ user }: { user: AdminUser }) {
  const deviceType = user.lastDeviceType?.trim() || '—';
  const appVersion = user.lastAppVersion?.trim() || '—';
  const location = user.lastLocation?.trim() || '—';

  return (
    <section className={`${card} ring-1 ring-indigo-500/15`}>
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400">
          <Smartphone className="size-4" strokeWidth={2} />
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
            Device & environment
          </h3>
          <p className="text-xs text-slate-500 dark:text-zinc-500">Last known client and location</p>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DetailItem label="Device type" value={deviceType} icon={Smartphone} highlight />
        <DetailItem label="App version" value={appVersion} icon={Globe} />
        <DetailItem label="Last location" value={location} icon={MapPin} />
        <DetailItem label="Last active" value={formatDate(user.lastActiveAt)} icon={Clock} highlight />
      </div>
    </section>
  );
}

export function ProfileDetailsGrid({ user }: { user: AdminUser }) {
  return (
    <section className={card}>
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
        Profile & account
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <DetailItem label="User ID" value={<span className="font-mono text-xs">{user.id}</span>} icon={User} />
        <DetailItem label="Phone" value={user.phone || '—'} icon={Phone} />
        <DetailItem label="Email" value={user.email || '—'} icon={Mail} />
        <DetailItem label="Gender" value={formatGender(user.gender)} icon={User} />
        <DetailItem label="Avatar type" value={user.avatar?.trim() || '—'} icon={User} />
        <DetailItem label="Signup source" value={user.signupSource || '—'} icon={Globe} />
        <DetailItem label="Registered" value={formatDate(user.registeredAt)} icon={Calendar} />
        <DetailItem
          label="Tags"
          value={
            user.tags?.length ? (
              <div className="flex flex-wrap gap-1.5">
                {user.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-slate-200/80 px-2 py-0.5 text-xs font-medium dark:bg-zinc-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              '—'
            )
          }
        />
      </div>
    </section>
  );
}
