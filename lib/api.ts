import type { AnalyticsPayload, SubjectsAnalyticsPayload } from '@/lib/types/analytics';
import type {
  AdminLog,
  AdminUser,
  DashboardMetrics,
  FeatureOverrides,
  FineCollectionUser,
  SystemConfig,
} from '@/lib/types/admin';

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status: number };

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const response = await fetch(`/api/admin${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
      ...options,
    });

    const text = await response.text();
    let body: unknown = undefined;
    try {
      body = text ? JSON.parse(text) : undefined;
    } catch {
      body = undefined;
    }

    if (!response.ok) {
      const err =
        (body as { error?: string; message?: string } | undefined)?.error ??
        (body as { error?: string; message?: string } | undefined)?.message ??
        `${response.status} ${response.statusText}`;
      return { ok: false, error: err, status: response.status };
    }

    return { ok: true, data: body as T };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Network error',
      status: 0,
    };
  }
}

// Auth
export function adminLogin(email: string, password: string) {
  return request<{ success: boolean; token: string }>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function adminLogout() {
  return request<{ success: boolean }>('/logout', { method: 'POST' });
}

// Dashboard
export function getDashboard() {
  return request<{ success: boolean; metrics: DashboardMetrics }>('/dashboard');
}

// Users
export function getUsers(query = '') {
  return request<{ success: boolean; users: AdminUser[] }>(`/users${query ? `?${query}` : ''}`);
}

export function getUserDetail(userId: string) {
  return request<{
    success: boolean;
    user: AdminUser;
    sessions: Array<Record<string, unknown>>;
    transactions: Array<Record<string, unknown>>;
    ocrSubmissions: Array<Record<string, unknown>>;
    adminNotes: Array<{ id: string; text: string; createdAt: string }>;
  }>(`/users/${encodeURIComponent(userId)}`);
}

export function patchUser(
  userId: string,
  payload: {
    isDisabled?: boolean;
    avatar?: string;
    adminNote?: string;
    walletAdjustment?: { amount: number; reason: string };
  },
) {
  return request<{ success: boolean; user: AdminUser }>(`/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export function getAllFeatureOverrides() {
  return request<{ success: boolean; overrides: Record<string, FeatureOverrides> }>(
    '/users/feature-overrides',
  );
}

export function getUserFeatureOverrides(userId: string) {
  return request<{ success: boolean; userId: string; userName: string } & FeatureOverrides>(
    `/users/${encodeURIComponent(userId)}/feature-overrides`,
  );
}

export function patchUserFeatureOverrides(userId: string, payload: Partial<FeatureOverrides>) {
  return request<{ success: boolean } & FeatureOverrides>(
    `/users/${encodeURIComponent(userId)}/feature-overrides`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  );
}

export function approveExtraLeave(userId: string, leaveId: string) {
  return request<{ success: boolean }>(
    `/users/${encodeURIComponent(userId)}/leaves/${encodeURIComponent(leaveId)}/approve-extra`,
    { method: 'POST' },
  );
}

// Fine collection
export function getFineCollectionSummary() {
  return request<{
    success: boolean;
    totalWalletBalance: number;
    totalFineCollected: number;
    totalApplicableToday: number;
    differenceAsOfToday: number;
    descriptions: Record<string, string>;
  }>('/fine-collection/summary');
}

export function getFineCollectionUsers() {
  return request<{
    success: boolean;
    users: FineCollectionUser[];
    totalAccounts: number;
  }>('/fine-collection/users');
}

// Wallet
export function getWalletOverview() {
  return request<{
    success: boolean;
    totalDeposits: number;
    totalActiveBalances: number;
  }>('/wallet/overview');
}

export function getWalletTransactions(params?: { limit?: number; cursor?: string }) {
  const search = new URLSearchParams();
  if (params?.limit) search.set('limit', String(params.limit));
  if (params?.cursor) search.set('cursor', params.cursor);
  const query = search.toString();
  return request<{
    success: boolean;
    transactions: Array<Record<string, unknown>>;
    nextCursor: string | null;
  }>(`/wallet/transactions${query ? `?${query}` : ''}`);
}

export function postWalletCredit(payload: { userId: string; amount: number; note: string }) {
  return request<{ success: boolean; message: string; newBalance: number }>('/wallet/credit', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// OCR
export function getOcrSubmissions(params?: { status?: string; userId?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.status) search.set('status', params.status);
  if (params?.userId) search.set('userId', params.userId);
  if (params?.limit) search.set('limit', String(params.limit));
  const query = search.toString();
  return request<{ success: boolean; submissions: Array<Record<string, unknown>> }>(
    `/ocr/submissions${query ? `?${query}` : ''}`,
  );
}

export function patchOcrSubmission(
  id: string,
  payload: {
    status?: 'pending' | 'approved' | 'review' | 'fined';
    manualCorrection?: { questionsSolved?: number; accuracyPercent?: number; note?: string };
  },
) {
  return request<{ success: boolean; submission: Record<string, unknown> }>(
    `/ocr/submissions/${encodeURIComponent(id)}`,
    { method: 'PATCH', body: JSON.stringify(payload) },
  );
}

// Analytics
export function getAnalytics() {
  return request<AnalyticsPayload>('/analytics');
}

export function getAnalyticsSubjects() {
  return request<SubjectsAnalyticsPayload>('/analytics/subjects');
}

// Badges
export function getBadgeSummary() {
  return request<{
    success: boolean;
    totalBadges: number;
    distribution: Array<{ type: string; count: number }>;
    recentEvents: Array<Record<string, unknown>>;
  }>('/badges/summary');
}

export function postBadgeCorrection(payload: { userId: string; type: string; note: string }) {
  return request<{ success: boolean; correction: Record<string, unknown> }>('/badges/correction', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// System config
export function getSystemConfig() {
  return request<SystemConfig>('/systemconfig');
}

export function updateSystemConfig(payload: SystemConfig) {
  return request<{ success: boolean }>('/systemconfig', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

// Logs
export function getLogs(params?: { action?: string; limit?: number }) {
  const search = new URLSearchParams();
  if (params?.action) search.set('action', params.action);
  if (params?.limit) search.set('limit', String(params.limit));
  const query = search.toString();
  return request<{ success: boolean; logs: AdminLog[] }>(`/logs${query ? `?${query}` : ''}`);
}
