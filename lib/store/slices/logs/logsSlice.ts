import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getLogs } from '@/lib/api';
import type { AdminLog } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchLogs = createAsyncThunk(
  'logs/fetch',
  async (actionFilter: string, { rejectWithValue }) => {
    const res = await getLogs({
      action: actionFilter.trim() || undefined,
      limit: 100,
    });
    if (!res.ok) return rejectWithValue(res.error);
    return res.data.logs ?? [];
  },
);

type LogsState = AsyncSliceState & {
  logs: AdminLog[];
  actionFilter: string;
};

const initialState: LogsState = {
  ...asyncInitial,
  logs: [],
  actionFilter: '',
};

const logsSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setLogsActionFilter(state, action: PayloadAction<string>) {
      state.actionFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogs.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchLogs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.logs = action.payload;
      })
      .addCase(fetchLogs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load logs');
      });
  },
});

export const { setLogsActionFilter } = logsSlice.actions;
export default logsSlice.reducer;

export const selectLogs = (state: { logs: LogsState }) => state.logs;
