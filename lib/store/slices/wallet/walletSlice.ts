import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getWalletOverview, getWalletTransactions, postWalletCredit } from '@/lib/api';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchWallet = createAsyncThunk('wallet/fetch', async (_, { rejectWithValue }) => {
  const [overviewRes, txRes] = await Promise.all([
    getWalletOverview(),
    getWalletTransactions({ limit: 50 }),
  ]);
  if (!overviewRes.ok) return rejectWithValue(overviewRes.error);
  if (!txRes.ok) return rejectWithValue(txRes.error);
  return {
    overview: {
      totalDeposits: overviewRes.data.totalDeposits,
      totalActiveBalances: overviewRes.data.totalActiveBalances,
    },
    transactions: txRes.data.transactions ?? [],
  };
});

export const submitWalletCredit = createAsyncThunk(
  'wallet/credit',
  async (
    { userId, amount, note }: { userId: string; amount: number; note: string },
    { dispatch, rejectWithValue },
  ) => {
    const res = await postWalletCredit({ userId, amount, note });
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchWallet());
    return `${res.data.message}. New balance: ${res.data.newBalance}`;
  },
);

type WalletState = AsyncSliceState & {
  overview: { totalDeposits: number; totalActiveBalances: number } | null;
  transactions: Array<Record<string, unknown>>;
  form: { userId: string; amount: string; note: string };
};

const initialState: WalletState = {
  ...asyncInitial,
  overview: null,
  transactions: [],
  form: { userId: '', amount: '0', note: '' },
};

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletForm(state, action: PayloadAction<Partial<WalletState['form']>>) {
      state.form = { ...state.form, ...action.payload };
    },
    clearWalletMessages(state) {
      state.error = '';
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWallet.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchWallet.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.overview = action.payload.overview;
        state.transactions = action.payload.transactions;
      })
      .addCase(fetchWallet.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load wallet');
      })
      .addCase(submitWalletCredit.pending, (state) => {
        state.status = 'loading';
        state.error = '';
        state.message = '';
      })
      .addCase(submitWalletCredit.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.message = action.payload;
        state.form = { userId: '', amount: '0', note: '' };
      })
      .addCase(submitWalletCredit.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Credit failed');
      });
  },
});

export const { setWalletForm, clearWalletMessages } = walletSlice.actions;
export default walletSlice.reducer;

export const selectWallet = (state: { wallet: WalletState }) => state.wallet;
