import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getBadgeSummary, postBadgeCorrection } from '@/lib/api';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchBadges = createAsyncThunk('badges/fetch', async (_, { rejectWithValue }) => {
  const res = await getBadgeSummary();
  if (!res.ok) return rejectWithValue(res.error);
  return {
    totalBadges: res.data.totalBadges,
    distribution: res.data.distribution ?? [],
    recentEvents: res.data.recentEvents ?? [],
  };
});

export const submitBadgeCorrection = createAsyncThunk(
  'badges/correct',
  async (
    { userId, type, note }: { userId: string; type: string; note: string },
    { dispatch, rejectWithValue },
  ) => {
    const res = await postBadgeCorrection({ userId, type, note });
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchBadges());
    return 'Badge correction logged';
  },
);

type BadgesState = AsyncSliceState & {
  summary: {
    totalBadges: number;
    distribution: Array<{ type: string; count: number }>;
    recentEvents: Array<Record<string, unknown>>;
  } | null;
  form: { userId: string; type: string; note: string };
};

const initialState: BadgesState = {
  ...asyncInitial,
  summary: null,
  form: { userId: '', type: 'streak_3', note: '' },
};

const badgesSlice = createSlice({
  name: 'badges',
  initialState,
  reducers: {
    setBadgesForm(state, action: PayloadAction<Partial<BadgesState['form']>>) {
      state.form = { ...state.form, ...action.payload };
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
      })
      .addCase(fetchBadges.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load badges');
      })
      .addCase(submitBadgeCorrection.fulfilled, (state, action) => {
        state.message = action.payload;
        state.form.note = '';
      })
      .addCase(submitBadgeCorrection.rejected, (state, action) => {
        state.error = String(action.payload);
      });
  },
});

export const { setBadgesForm } = badgesSlice.actions;
export default badgesSlice.reducer;

export const selectBadges = (state: { badges: BadgesState }) => state.badges;
