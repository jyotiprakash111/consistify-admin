import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDashboard } from '@/lib/api';
import { normalizeDashboardPayload } from '@/lib/dashboard/normalize-dashboard-payload';
import type { DashboardPayload } from '@/lib/types/dashboard';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetch',
  async (_, { rejectWithValue }) => {
    const res = await getDashboard();
    if (!res.ok) return rejectWithValue(res.error);
    return normalizeDashboardPayload(res.data);
  },
);

type DashboardState = AsyncSliceState & {
  data: DashboardPayload | null;
};

const initialState: DashboardState = {
  ...asyncInitial,
  data: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearDashboardError(state) {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load dashboard');
      });
  },
});

export const { clearDashboardError } = dashboardSlice.actions;
export default dashboardSlice.reducer;

export const selectDashboard = (state: { dashboard: DashboardState }) => state.dashboard;

export const selectDashboardData = (state: { dashboard: DashboardState }) =>
  state.dashboard.data;

export const selectDashboardMetrics = (state: { dashboard: DashboardState }) =>
  state.dashboard.data?.metrics ?? null;
