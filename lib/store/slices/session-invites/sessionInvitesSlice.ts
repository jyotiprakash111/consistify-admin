import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getSessionInvitesSummary,
  getSessionPartnerRequests,
  getSessionShareCodes,
} from '@/lib/api';
import type {
  PartnerRequestRow,
  SessionInvitesSummary,
  SessionShareCodeRow,
} from '@/lib/types/session-invites';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export type SessionInvitesFilters = {
  status: string;
  userId: string;
  activeShareCodesOnly: boolean;
};

const defaultFilters: SessionInvitesFilters = {
  status: 'all',
  userId: '',
  activeShareCodesOnly: false,
};

export const fetchSessionInvites = createAsyncThunk(
  'sessionInvites/fetch',
  async (filters: SessionInvitesFilters, { rejectWithValue }) => {
    const userId = filters.userId.trim();
    const [summaryRes, requestsRes, codesRes] = await Promise.all([
      getSessionInvitesSummary(),
      getSessionPartnerRequests({
        status: filters.status,
        userId: userId || undefined,
        limit: 100,
      }),
      getSessionShareCodes({
        userId: userId || undefined,
        activeOnly: filters.activeShareCodesOnly,
        limit: 100,
      }),
    ]);
    if (!summaryRes.ok) return rejectWithValue(summaryRes.error);
    if (!requestsRes.ok) return rejectWithValue(requestsRes.error);
    if (!codesRes.ok) return rejectWithValue(codesRes.error);
    return {
      summary: summaryRes.data.summary,
      recentPartnerRequests: summaryRes.data.recentPartnerRequests,
      recentShareCodes: summaryRes.data.recentShareCodes,
      partnerRequests: requestsRes.data.requests,
      shareCodes: codesRes.data.shareCodes,
    };
  },
);

type SessionInvitesState = AsyncSliceState & {
  summary: SessionInvitesSummary | null;
  recentPartnerRequests: PartnerRequestRow[];
  recentShareCodes: SessionShareCodeRow[];
  partnerRequests: PartnerRequestRow[];
  shareCodes: SessionShareCodeRow[];
  filters: SessionInvitesFilters;
};

const initialState: SessionInvitesState = {
  ...asyncInitial,
  summary: null,
  recentPartnerRequests: [],
  recentShareCodes: [],
  partnerRequests: [],
  shareCodes: [],
  filters: defaultFilters,
};

const sessionInvitesSlice = createSlice({
  name: 'sessionInvites',
  initialState,
  reducers: {
    setSessionInvitesFilters(state, action: { payload: Partial<SessionInvitesFilters> }) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetSessionInvitesFilters(state) {
      state.filters = defaultFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionInvites.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchSessionInvites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload.summary;
        state.recentPartnerRequests = action.payload.recentPartnerRequests;
        state.recentShareCodes = action.payload.recentShareCodes;
        state.partnerRequests = action.payload.partnerRequests;
        state.shareCodes = action.payload.shareCodes;
      })
      .addCase(fetchSessionInvites.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load session invites');
      });
  },
});

export const { setSessionInvitesFilters, resetSessionInvitesFilters } = sessionInvitesSlice.actions;
export default sessionInvitesSlice.reducer;

export const selectSessionInvites = (state: { sessionInvites: SessionInvitesState }) =>
  state.sessionInvites;
