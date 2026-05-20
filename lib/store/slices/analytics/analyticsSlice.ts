import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAnalytics, getAnalyticsSubjects } from '@/lib/api';
import type { AnalyticsPayload, SubjectsAnalyticsPayload } from '@/lib/types/analytics';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchAnalytics = createAsyncThunk('analytics/fetch', async (_, { rejectWithValue }) => {
  const [aRes, sRes] = await Promise.all([getAnalytics(), getAnalyticsSubjects()]);
  if (!aRes.ok) return rejectWithValue(aRes.error);
  if (!sRes.ok) return rejectWithValue(sRes.error);
  return {
    analytics: aRes.data,
    subjects: sRes.data,
  };
});

type AnalyticsState = AsyncSliceState & {
  analytics: AnalyticsPayload | null;
  subjects: SubjectsAnalyticsPayload | null;
};

const initialState: AnalyticsState = {
  ...asyncInitial,
  analytics: null,
  subjects: null,
};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.analytics = action.payload.analytics;
        state.subjects = action.payload.subjects;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load analytics');
      });
  },
});

export default analyticsSlice.reducer;

export const selectAnalytics = (state: { analytics: AnalyticsState }) => state.analytics;
