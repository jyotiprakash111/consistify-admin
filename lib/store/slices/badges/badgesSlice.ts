import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getBadgeSummary, getUserBadges, postBadgeCorrection } from '@/lib/api';
import {
  computeTopWinners,
  getUserBadgeEvents,
  normalizeBadgeEvents,
} from '@/lib/badge-utils';
import { showErrorFlash, showSuccessFlash } from '@/lib/store/slices/ui/uiSlice';
import type { BadgeEvent, BadgeSummaryPayload } from '@/lib/types/badges';
import type { AdminUser } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';
import { defaultUsersListFilters, fetchUsersList } from '@/lib/store/slices/users/usersListSlice';
import type { RootState } from '@/lib/store';

export const fetchBadges = createAsyncThunk(
  'badges/fetch',
  async (_, { dispatch, getState, rejectWithValue }) => {
    const state = getState() as RootState;
    if (state.usersList.users.length === 0) {
      await dispatch(fetchUsersList(defaultUsersListFilters));
    }

    const res = await getBadgeSummary();
    if (!res.ok) return rejectWithValue(res.error);

    const usersById = new Map(
      (getState() as RootState).usersList.users.map((u) => [u.id, u]),
    );
    const recentEvents = normalizeBadgeEvents(res.data.recentEvents ?? []);
    const topWinners =
      res.data.topWinners && Array.isArray(res.data.topWinners)
        ? normalizeTopWinnersFromApi(res.data.topWinners, usersById)
        : computeTopWinners(recentEvents, usersById);

    return {
      totalBadges: res.data.totalBadges,
      distribution: res.data.distribution ?? [],
      recentEvents,
      topWinners,
    } satisfies BadgeSummaryPayload;
  },
);

function normalizeTopWinnersFromApi(
  raw: Array<Record<string, unknown>>,
  usersById: Map<string, AdminUser>,
) {
  return raw.map((item, index) => {
    const userId = String(item.userId ?? item.user_id ?? `winner-${index}`);
    const user = usersById.get(userId);
    return {
      userId,
      userName: String(item.userName ?? item.user_name ?? user?.phone ?? userId),
      badgeCount: Number(item.badgeCount ?? item.count ?? 0),
      topBadgeType: String(item.topBadgeType ?? item.type ?? '—'),
      lastEarnedAt: item.lastEarnedAt ? String(item.lastEarnedAt) : undefined,
    };
  });
}

export const fetchUserBadgeHistory = createAsyncThunk(
  'badges/fetchUserHistory',
  async (userId: string, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const summary = state.badges.summary;
    const fromSummary = summary ? getUserBadgeEvents(summary.recentEvents, userId) : [];

    const res = await getUserBadges(userId);
    if (res.ok) {
      const apiEvents = normalizeBadgeEvents(res.data.badges ?? res.data.events ?? []);
      const merged = mergeBadgeEvents(fromSummary, apiEvents);
      return { userId, events: merged };
    }

    if (fromSummary.length > 0) {
      return { userId, events: fromSummary };
    }

    if (!res.ok && res.status !== 404) {
      return rejectWithValue(res.error);
    }

    return { userId, events: [] };
  },
);

function mergeBadgeEvents(a: BadgeEvent[], b: BadgeEvent[]) {
  const seen = new Set<string>();
  const merged = [...a, ...b];
  return merged.filter((e) => {
    const key = e.id || `${e.type}-${e.earnedAt}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export const submitBadgeCorrection = createAsyncThunk(
  'badges/correct',
  async (
    { userId, type, note }: { userId: string; type: string; note: string },
    { dispatch, rejectWithValue },
  ) => {
    const res = await postBadgeCorrection({ userId, type, note });
    if (!res.ok) {
      dispatch(showErrorFlash(res.error));
      return rejectWithValue(res.error);
    }
    await dispatch(fetchBadges());
    if (userId) await dispatch(fetchUserBadgeHistory(userId));
    dispatch(showSuccessFlash('Badge correction saved'));
    return 'Badge correction logged';
  },
);

type BadgesState = AsyncSliceState & {
  summary: BadgeSummaryPayload | null;
  selectedUserId: string;
  userBadgeEvents: BadgeEvent[];
  userBadgesLoading: boolean;
  form: { userId: string; type: string; note: string };
  actionLoading: string | null;
};

const initialState: BadgesState = {
  ...asyncInitial,
  summary: null,
  selectedUserId: '',
  userBadgeEvents: [],
  userBadgesLoading: false,
  form: { userId: '', type: 'streak_3', note: '' },
  actionLoading: null,
};

const badgesSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    setBadgesForm(state, action: PayloadAction<Partial<BadgesState['form']>>) {
      state.form = { ...state.form, ...action.payload };
    },
    setSelectedBadgeUser(state, action: PayloadAction<string>) {
      state.selectedUserId = action.payload;
      state.form.userId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBadges.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchBadges.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload;
        if (!state.selectedUserId && action.payload.topWinners[0]) {
          state.selectedUserId = action.payload.topWinners[0].userId;
          state.form.userId = action.payload.topWinners[0].userId;
        }
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load badges');
      })
      .addCase(fetchUserBadgeHistory.pending, (state) => {
        state.userBadgesLoading = true;
      })
      .addCase(fetchUserBadgeHistory.fulfilled, (state, action) => {
        state.userBadgesLoading = false;
        state.selectedUserId = action.payload.userId;
        state.userBadgeEvents = action.payload.events;
      })
      .addCase(fetchUserBadgeHistory.rejected, (state, action) => {
        state.userBadgesLoading = false;
        state.error = String(action.payload ?? 'Failed to load user badges');
      })
      .addCase(submitBadgeCorrection.pending, (state) => {
        state.actionLoading = 'correction';
      })
      .addCase(submitBadgeCorrection.fulfilled, (state) => {
        state.actionLoading = null;
        state.message = '';
        state.form.note = '';
      })
      .addCase(submitBadgeCorrection.rejected, (state, action) => {
        state.actionLoading = null;
        state.error = String(action.payload);
      });
  },
});

export const { setBadgesForm, setSelectedBadgeUser } = badgesSlice.actions;
export default badgesSlice.reducer;

export const selectBadges = (state: { badges: BadgesState }) => state.badges;
