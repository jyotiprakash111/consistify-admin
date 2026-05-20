import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllFeatureOverrides } from '@/lib/api';
import type { FeatureOverrides } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export type OverrideRow = { userId: string } & FeatureOverrides;

export const fetchFeatureOverrides = createAsyncThunk(
  'featureOverrides/fetch',
  async (_, { rejectWithValue }) => {
    const res = await getAllFeatureOverrides();
    if (!res.ok) return rejectWithValue(res.error);
    return Object.entries(res.data.overrides ?? {}).map(([userId, flags]) => ({
      userId,
      ...flags,
    })) as OverrideRow[];
  },
);

type FeatureOverridesState = AsyncSliceState & {
  rows: OverrideRow[];
};

const initialState: FeatureOverridesState = {
  ...asyncInitial,
  rows: [],
};

const featureOverridesSlice = createSlice({
  name: 'featureOverrides',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatureOverrides.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchFeatureOverrides.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.rows = action.payload;
      })
      .addCase(fetchFeatureOverrides.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load overrides');
      });
  },
});

export default featureOverridesSlice.reducer;

export const selectFeatureOverrides = (state: { featureOverrides: FeatureOverridesState }) =>
  state.featureOverrides;
