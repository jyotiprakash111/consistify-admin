import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAllFeatureOverrides, getUserFeatureOverrides, patchUserFeatureOverrides } from '@/lib/api';
import { defaultFeatureOverrides } from '@/lib/feature-override-meta';
import type { FeatureOverrides } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export type OverrideRow = { userId: string; userName?: string } & FeatureOverrides;

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

export const fetchUserFeatureOverride = createAsyncThunk(
  'featureOverrides/fetchOne',
  async (userId: string, { rejectWithValue }) => {
    const res = await getUserFeatureOverrides(userId);
    if (!res.ok) return rejectWithValue(res.error);
    return {
      userId: res.data.userId,
      userName: res.data.userName,
      overrides: {
        walletEnabled: res.data.walletEnabled,
        badgeRewardsEnabled: res.data.badgeRewardsEnabled,
        emailNotificationsEnabled: res.data.emailNotificationsEnabled,
        pushNotificationsEnabled: res.data.pushNotificationsEnabled,
      } satisfies FeatureOverrides,
    };
  },
);

export const saveUserFeatureOverride = createAsyncThunk(
  'featureOverrides/save',
  async (
    { userId, overrides }: { userId: string; overrides: FeatureOverrides },
    { dispatch, rejectWithValue },
  ) => {
    const res = await patchUserFeatureOverrides(userId, overrides);
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchFeatureOverrides());
    return { userId, message: 'Feature overrides saved' };
  },
);

type FeatureOverridesState = AsyncSliceState & {
  rows: OverrideRow[];
  selectedUserId: string;
  selectedOverrides: FeatureOverrides | null;
  selectedUserName: string;
};

const initialState: FeatureOverridesState = {
  ...asyncInitial,
  rows: [],
  selectedUserId: '',
  selectedOverrides: null,
  selectedUserName: '',
};

const featureOverridesSlice = createSlice({
  name: 'featureOverrides',
  initialState,
  reducers: {
    setSelectedUserId(state, action: PayloadAction<string>) {
      state.selectedUserId = action.payload.trim();
      state.selectedOverrides = null;
      state.selectedUserName = '';
    },
    setSelectedOverridesDraft(state, action: PayloadAction<FeatureOverrides>) {
      state.selectedOverrides = action.payload;
    },
    updateRowOverrideDraft(
      state,
      action: PayloadAction<{ userId: string; overrides: FeatureOverrides }>,
    ) {
      const row = state.rows.find((r) => r.userId === action.payload.userId);
      if (row) Object.assign(row, action.payload.overrides);
    },
    clearFeatureOverridesMessages(state) {
      state.error = '';
      state.message = '';
    },
  },
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
      })
      .addCase(fetchUserFeatureOverride.fulfilled, (state, action) => {
        state.selectedUserId = action.payload.userId;
        state.selectedUserName = action.payload.userName ?? '';
        state.selectedOverrides = action.payload.overrides;
        state.status = 'succeeded';
      })
      .addCase(fetchUserFeatureOverride.rejected, (state, action) => {
        state.error = String(action.payload ?? 'Failed to load user overrides');
        state.selectedOverrides = { ...defaultFeatureOverrides };
      })
      .addCase(saveUserFeatureOverride.fulfilled, (state, action) => {
        state.message = action.payload.message;
        const row = state.rows.find((r) => r.userId === action.payload.userId);
        if (row && state.selectedOverrides) {
          Object.assign(row, state.selectedOverrides);
        }
      })
      .addCase(saveUserFeatureOverride.rejected, (state, action) => {
        state.error = String(action.payload);
      });
  },
});

export const {
  setSelectedUserId,
  setSelectedOverridesDraft,
  updateRowOverrideDraft,
  clearFeatureOverridesMessages,
} = featureOverridesSlice.actions;
export default featureOverridesSlice.reducer;

export const selectFeatureOverrides = (state: { featureOverrides: FeatureOverridesState }) =>
  state.featureOverrides;
