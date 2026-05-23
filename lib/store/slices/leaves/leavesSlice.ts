import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { approveExtraLeaveById, getAdminLeaves } from '@/lib/api';
import type { AdminLeaveRow, LeaveKind } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export type LeavesTab = 'pending' | 'all';
export type LeavesKindFilter = LeaveKind | 'all';

export const fetchLeaves = createAsyncThunk(
  'leaves/fetch',
  async (
    { tab, kindFilter }: { tab: LeavesTab; kindFilter: LeavesKindFilter },
    { rejectWithValue },
  ) => {
    const kind =
      tab === 'pending' ? 'extra_pending' : kindFilter === 'all' ? 'all' : kindFilter;
    const res = await getAdminLeaves({ kind, limit: 100 });
    if (!res.ok) return rejectWithValue(res.error);
    return {
      tab,
      kindFilter,
      total: res.data.total,
      pendingTotal: res.data.pendingTotal,
      leaves: res.data.leaves ?? [],
    };
  },
);

export const approveLeave = createAsyncThunk(
  'leaves/approve',
  async (leaveId: string, { rejectWithValue, dispatch, getState }) => {
    const res = await approveExtraLeaveById(leaveId);
    if (!res.ok) return rejectWithValue(res.error);

    const state = getState() as { leaves: LeavesState };
    const { activeTab, kindFilter } = state.leaves;
    await dispatch(fetchLeaves({ tab: activeTab, kindFilter }));
    return leaveId;
  },
);

type LeavesState = AsyncSliceState & {
  activeTab: LeavesTab;
  kindFilter: LeavesKindFilter;
  total: number;
  pendingTotal: number;
  leaves: AdminLeaveRow[];
  approvingId: string | null;
  /** Ignore fulfilled responses from superseded fetches (tab/filter race). */
  activeRequestId: string | null;
};

const initialState: LeavesState = {
  ...asyncInitial,
  activeTab: 'pending',
  kindFilter: 'all',
  total: 0,
  pendingTotal: 0,
  leaves: [],
  approvingId: null,
  activeRequestId: null,
};

const leavesSlice = createSlice({
  name: 'leaves',
  initialState,
  reducers: {
    setLeavesTab(state, action: PayloadAction<LeavesTab>) {
      state.activeTab = action.payload;
      state.leaves = [];
      state.status = 'loading';
    },
    setLeavesKindFilter(state, action: PayloadAction<LeavesKindFilter>) {
      state.kindFilter = action.payload;
      state.leaves = [];
      state.status = 'loading';
    },
    clearLeavesMessage(state) {
      state.message = '';
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state, action) => {
        state.status = 'loading';
        state.error = '';
        state.leaves = [];
        state.activeRequestId = action.meta.requestId;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        if (action.meta.requestId !== state.activeRequestId) return;
        state.status = 'succeeded';
        state.activeTab = action.payload.tab;
        state.kindFilter = action.payload.kindFilter;
        state.total = action.payload.total;
        state.pendingTotal = action.payload.pendingTotal;
        state.leaves = action.payload.leaves;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        if (action.meta.requestId !== state.activeRequestId) return;
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load leaves');
      })
      .addCase(approveLeave.pending, (state, action) => {
        state.approvingId = action.meta.arg;
        state.error = '';
      })
      .addCase(approveLeave.fulfilled, (state) => {
        state.approvingId = null;
        state.message = 'Leave approved.';
      })
      .addCase(approveLeave.rejected, (state, action) => {
        state.approvingId = null;
        state.error = String(action.payload ?? 'Failed to approve leave');
      });
  },
});

export const { setLeavesTab, setLeavesKindFilter, clearLeavesMessage } = leavesSlice.actions;
export default leavesSlice.reducer;

export const selectLeaves = (state: { leaves: LeavesState }) => state.leaves;
