import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { approveExtraLeaveById, getExtraPendingLeaves } from '@/lib/api';
import type { PendingExtraLeave } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchExtraLeaveQueue = createAsyncThunk(
  'extraLeaves/fetchQueue',
  async (_, { rejectWithValue }) => {
    const res = await getExtraPendingLeaves(100);
    if (!res.ok) return rejectWithValue(res.error);
    return { total: res.data.total, leaves: res.data.leaves ?? [] };
  },
);

export const approveQueuedExtraLeave = createAsyncThunk(
  'extraLeaves/approve',
  async (leaveId: string, { rejectWithValue, dispatch }) => {
    const res = await approveExtraLeaveById(leaveId);
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchExtraLeaveQueue());
    return leaveId;
  },
);

type ExtraLeavesState = AsyncSliceState & {
  total: number;
  leaves: PendingExtraLeave[];
  approvingId: string | null;
};

const initialState: ExtraLeavesState = {
  ...asyncInitial,
  total: 0,
  leaves: [],
  approvingId: null,
};

const extraLeavesSlice = createSlice({
  name: 'extraLeaves',
  initialState,
  reducers: {
    clearExtraLeavesMessage(state) {
      state.message = '';
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExtraLeaveQueue.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchExtraLeaveQueue.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.total = action.payload.total;
        state.leaves = action.payload.leaves;
      })
      .addCase(fetchExtraLeaveQueue.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load leave queue');
      })
      .addCase(approveQueuedExtraLeave.pending, (state, action) => {
        state.approvingId = action.meta.arg;
        state.error = '';
      })
      .addCase(approveQueuedExtraLeave.fulfilled, (state) => {
        state.approvingId = null;
        state.message = 'Extra leave approved.';
      })
      .addCase(approveQueuedExtraLeave.rejected, (state, action) => {
        state.approvingId = null;
        state.error = String(action.payload ?? 'Failed to approve leave');
      });
  },
});

export const { clearExtraLeavesMessage } = extraLeavesSlice.actions;
export default extraLeavesSlice.reducer;

export const selectExtraLeaves = (state: { extraLeaves: ExtraLeavesState }) => state.extraLeaves;
