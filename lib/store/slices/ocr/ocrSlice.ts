import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOcrSubmissions, patchOcrSubmission } from '@/lib/api';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

type OcrStatus = 'pending' | 'approved' | 'review' | 'fined';

export const fetchOcrSubmissions = createAsyncThunk(
  'ocr/fetch',
  async (filters: { status: string; userId: string }, { rejectWithValue }) => {
    const res = await getOcrSubmissions({
      status: filters.status,
      userId: filters.userId.trim() || undefined,
      limit: 100,
    });
    if (!res.ok) return rejectWithValue(res.error);
    return res.data.submissions ?? [];
  },
);

export const updateOcrStatus = createAsyncThunk(
  'ocr/updateStatus',
  async (
    { id, status, filters }: { id: string; status: OcrStatus; filters: { status: string; userId: string } },
    { dispatch, rejectWithValue },
  ) => {
    const res = await patchOcrSubmission(id, { status });
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchOcrSubmissions(filters));
    return `Updated ${id} → ${status}`;
  },
);

type OcrState = AsyncSliceState & {
  submissions: Array<Record<string, unknown>>;
  filters: { status: string; userId: string };
};

const initialState: OcrState = {
  ...asyncInitial,
  submissions: [],
  filters: { status: 'all', userId: '' },
};

const ocrSlice = createSlice({
  name: 'ocr',
  initialState,
  reducers: {
    setOcrFilters(state, action: PayloadAction<Partial<OcrState['filters']>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOcrSubmissions.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchOcrSubmissions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = action.payload;
      })
      .addCase(fetchOcrSubmissions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load OCR');
      })
      .addCase(updateOcrStatus.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(updateOcrStatus.rejected, (state, action) => {
        state.error = String(action.payload);
      });
  },
});

export const { setOcrFilters } = ocrSlice.actions;
export default ocrSlice.reducer;

export const selectOcr = (state: { ocr: OcrState }) => state.ocr;
