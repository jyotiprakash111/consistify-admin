export type WalletTransactionRow = {
  id: string;
  type: string;
  amount: number | null;
  balanceAfter: number | null;
  note: string;
  createdAt: string;
  userId: string;
};

function pickNumber(...values: unknown[]): number | null {
  for (const v of values) {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
  }
  return null;
}

function pickString(...values: unknown[]): string {
  for (const v of values) {
    if (typeof v === 'string' && v.trim()) return v.trim();
  }
  return '';
}

export function normalizeWalletTransaction(
  raw: Record<string, unknown>,
  index: number,
): WalletTransactionRow {
  const id = pickString(raw.id, raw._id, raw.transactionId) || `tx-${index}`;
  const amount = pickNumber(
    raw.amount,
    raw.amountInRupees,
    raw.value,
    raw.delta,
    raw.walletAdjustment,
  );
  const balanceAfter = pickNumber(
    raw.balanceAfter,
    raw.balance,
    raw.newBalance,
    raw.walletBalance,
  );
  const createdAt = pickString(
    raw.createdAt,
    raw.timestamp,
    raw.date,
    raw.occurredAt,
  );
  const note = pickString(
    raw.note,
    raw.reason,
    raw.description,
    raw.memo,
    raw.adminNote,
  );
  const type = pickString(raw.type, raw.kind, raw.transactionType, raw.action) || 'transaction';
  const userId = pickString(raw.userId, raw.user_id, raw.uid);

  return {
    id,
    type,
    amount,
    balanceAfter,
    note,
    createdAt,
    userId,
  };
}

export function normalizeWalletTransactions(
  items: Array<Record<string, unknown>>,
): WalletTransactionRow[] {
  return items.map((item, index) => normalizeWalletTransaction(item, index));
}

export function filterTransactionsForUser(
  items: Array<Record<string, unknown>>,
  userId: string,
): Array<Record<string, unknown>> {
  const uid = userId.trim();
  if (!uid) return items;
  return items.filter((item) => {
    const rowUserId = pickString(item.userId, item.user_id, item.uid);
    return !rowUserId || rowUserId === uid;
  });
}

export function mergeWalletTransactions(
  ...lists: WalletTransactionRow[][]
): WalletTransactionRow[] {
  const seen = new Set<string>();
  const merged: WalletTransactionRow[] = [];
  for (const list of lists) {
    for (const row of list) {
      const key = row.id || `${row.createdAt}-${row.amount}-${row.type}`;
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(row);
    }
  }
  return merged.sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return tb - ta;
  });
}

export function formatInr(amount: number | null) {
  if (amount === null) return '—';
  const prefix = amount >= 0 ? '+' : '';
  return `${prefix}₹${Math.abs(amount).toLocaleString('en-IN')}`;
}
