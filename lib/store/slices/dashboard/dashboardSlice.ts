import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getDashboard } from '@/lib/api';
import type { DashboardMetrics } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchDashboard = createAsyncThunk(
  'dashboard/fetch',
  async (_, { rejectWithValue }) => {
    const res = await getDashboard();
    if (!res.ok) return rejectWithValue(res.error);
    return res.data.metrics;
  },
);

type DashboardState = AsyncSliceState & {
  metrics: DashboardMetrics | null;
};

const initialState: DashboardState = {
  ...asyncInitial,
  metrics: null,
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
        state.metrics = action.payload;
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
