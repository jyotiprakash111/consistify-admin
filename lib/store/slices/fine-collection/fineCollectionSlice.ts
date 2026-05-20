import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getFineCollectionSummary, getFineCollectionUsers } from '@/lib/api';
import type { FineCollectionUser } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchFineCollection = createAsyncThunk(
  'fineCollection/fetch',
  async (_, { rejectWithValue }) => {
    const [summaryRes, usersRes] = await Promise.all([
      getFineCollectionSummary(),
      getFineCollectionUsers(),
    ]);
    if (!summaryRes.ok) return rejectWithValue(summaryRes.error);
    if (!usersRes.ok) return rejectWithValue(usersRes.error);
    return {
      summary: summaryRes.data,
      users: usersRes.data.users ?? [],
    };
  },
);

type FineCollectionState = AsyncSliceState & {
  summary: {
    totalWalletBalance: number;
    totalFineCollected: number;
    totalApplicableToday: number;
    differenceAsOfToday: number;
    descriptions: Record<string, string>;
  } | null;
  users: FineCollectionUser[];
};

const initialState: FineCollectionState = {
  ...asyncInitial,
  summary: null,
  users: [],
};

const fineCollectionSlice = createSlice({
  name: 'fineCollection',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFineCollection.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchFineCollection.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.summary = action.payload.summary;
        state.users = action.payload.users;
      })
      .addCase(fetchFineCollection.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load fine collection');
      });
  },
});

export default fineCollectionSlice.reducer;

export const selectFineCollection = (state: { fineCollection: FineCollectionState }) =>
  state.fineCollection;
