export function formatInviteDate(value?: string | null) {
  if (!value?.trim()) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

export function partnerRequestStatusVariant(
  status: string,
): 'success' | 'warning' | 'danger' | 'neutral' {
  if (status === 'accepted') return 'success';
  if (status === 'pending') return 'warning';
  if (status === 'declined') return 'danger';
  return 'neutral';
}

export function shareCodeStatusLabel(isExpired: boolean) {
  return isExpired ? 'Expired' : 'Active';
}

export function shareCodeStatusVariant(isExpired: boolean): 'success' | 'neutral' {
  return isExpired ? 'neutral' : 'success';
}
