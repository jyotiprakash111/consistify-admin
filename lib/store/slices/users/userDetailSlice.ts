import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  approveExtraLeave,
  getUserDetail,
  getUserFeatureOverrides,
  getUserLeaves,
  getWalletTransactions,
  patchUser,
  patchUserFeatureOverrides,
  postBadgeCorrection,
  postWalletCredit,
} from '@/lib/api';
import { parseLeavesPayload } from '@/lib/leave-utils';
import { showErrorFlash, showSuccessFlash } from '@/lib/store/slices/ui/uiSlice';
import type { AdminUser, FeatureOverrides, UserLeaveRecord, UserLeaveSummary } from '@/lib/types/admin';
import type { PartnerRequestRow, SessionShareCodeRow } from '@/lib/types/session-invites';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';
import {
  filterTransactionsForUser,
  mergeWalletTransactions,
  normalizeWalletTransactions,
  type WalletTransactionRow,
} from '@/lib/wallet-transaction-utils';

export const fetchUserDetail = createAsyncThunk(
  'userDetail/fetch',
  async (userId: string, { rejectWithValue }) => {
    const [detailRes, overridesRes, walletTxRes, leavesRes] = await Promise.all([
      getUserDetail(userId),
      getUserFeatureOverrides(userId),
      getWalletTransactions({ limit: 100, userId }),
      getUserLeaves(userId),
    ]);
    if (!detailRes.ok) return rejectWithValue(detailRes.error);

    const user = detailRes.data.user;
    let leavePayload: Record<string, unknown> = {
      summary: detailRes.data.leaveSummary,
      leaves: detailRes.data.leaves,
    };
    if (leavesRes.ok) {
      leavePayload = { ...leavePayload, ...leavesRes.data };
    }
    const { summary: leaveSummary, leaves } = parseLeavesPayload(leavePayload, user);

    const detailTx = normalizeWalletTransactions(detailRes.data.transactions ?? []);
    const globalRaw = walletTxRes.ok
      ? filterTransactionsForUser(walletTxRes.data.transactions ?? [], userId)
      : [];
    const globalTx = normalizeWalletTransactions(globalRaw);
    const walletTransactions = mergeWalletTransactions(detailTx, globalTx);

    const overrides: FeatureOverrides | null = overridesRes.ok
      ? {
          walletEnabled: overridesRes.data.walletEnabled,
          badgeRewardsEnabled: overridesRes.data.badgeRewardsEnabled,
          emailNotificationsEnabled: overridesRes.data.emailNotificationsEnabled,
          pushNotificationsEnabled: overridesRes.data.pushNotificationsEnabled,
        }
      : null;

    return {
      user,
      sessions: detailRes.data.sessions ?? [],
      walletTransactions,
      ocrSubmissions: detailRes.data.ocrSubmissions ?? [],
      adminNotes: detailRes.data.adminNotes ?? [],
      partnerRequestsSent: detailRes.data.partnerRequestsSent ?? [],
      partnerRequestsReceived: detailRes.data.partnerRequestsReceived ?? [],
      sessionShareCodes: detailRes.data.sessionShareCodes ?? [],
      overrides,
      avatar: String(user.avatar ?? ''),
      leaveSummary,
      leaves,
    };
  },
);

export const toggleUserDisabled = createAsyncThunk(
  'userDetail/toggleDisabled',
  async (userId: string, { getState, dispatch, rejectWithValue }) => {
    const state = getState() as { userDetail: UserDetailState };
    const user = state.userDetail.user;
    if (!user) return rejectWithValue('No user loaded');
    const res = await patchUser(userId, { isDisabled: !user.isDisabled });
    if (!res.ok) {
      dispatch(showErrorFlash(res.error));
      return rejectWithValue(res.error);
    }
    await dispatch(fetchUserDetail(userId));
    const message = user.isDisabled
      ? 'User account enabled successfully'
      : 'User account disabled successfully';
    dispatch(showSuccessFlash(message));
    return message;
  },
);

export const updateUserAvatar = createAsyncThunk(
  'userDetail/updateAvatar',
  async ({ userId, avatar }: { userId: string; avatar: string }, { dispatch, rejectWithValue }) => {
    const res = await patchUser(userId, { avatar });
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchUserDetail(userId));
    return 'Avatar updated';
  },
);

export const addUserNote = createAsyncThunk(
  'userDetail/addNote',
  async ({ userId, note }: { userId: string; note: string }, { dispatch, rejectWithValue }) => {
    const res = await patchUser(userId, { adminNote: note });
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchUserDetail(userId));
    return 'Note added';
  },
);

export const adjustUserWallet = createAsyncThunk(
  'userDetail/walletAdjust',
  async (
    { userId, amount, reason }: { userId: string; amount: number; reason: string },
    { dispatch, rejectWithValue },
  ) => {
    const res = await patchUser(userId, { walletAdjustment: { amount, reason } });
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchUserDetail(userId));
    return 'Wallet adjusted';
  },
);

export const creditUserWallet = createAsyncThunk(
  'userDetail/walletCredit',
  async (
    { userId, amount, note }: { userId: string; amount: number; note: string },
    { dispatch, rejectWithValue },
  ) => {
    const res = await postWalletCredit({ userId, amount, note });
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchUserDetail(userId));
    return `Wallet credited. New balance: ₹${res.data.newBalance.toLocaleString('en-IN')}`;
  },
);

export const submitUserBadgeCorrection = createAsyncThunk(
  'userDetail/badgeCorrection',
  async (
    { userId, type, note }: { userId: string; type: string; note: string },
    { rejectWithValue },
  ) => {
    const res = await postBadgeCorrection({ userId, type, note });
    if (!res.ok) return rejectWithValue(res.error);
    return 'Badge correction submitted';
  },
);

export const saveUserFeatureOverrides = createAsyncThunk(
  'userDetail/saveOverrides',
  async (
    { userId, overrides }: { userId: string; overrides: FeatureOverrides },
    { dispatch, rejectWithValue },
  ) => {
    const res = await patchUserFeatureOverrides(userId, overrides);
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchUserDetail(userId));
    return 'Feature overrides saved';
  },
);

export const approveUserExtraLeave = createAsyncThunk(
  'userDetail/approveLeave',
  async (
    { userId, leaveId }: { userId: string; leaveId: string },
    { dispatch, rejectWithValue },
  ) => {
    const res = await approveExtraLeave(userId, leaveId);
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchUserDetail(userId));
    return 'Extra leave approved';
  },
);

type UserDetailState = AsyncSliceState & {
  userId: string;
  actionLoading: string | null;
  refreshing: boolean;
  user: AdminUser | null;
  sessions: Array<Record<string, unknown>>;
  walletTransactions: WalletTransactionRow[];
  ocrSubmissions: Array<Record<string, unknown>>;
  adminNotes: Array<{ id: string; text: string; createdAt: string }>;
  partnerRequestsSent: PartnerRequestRow[];
  partnerRequestsReceived: PartnerRequestRow[];
  sessionShareCodes: SessionShareCodeRow[];
  leaveSummary: UserLeaveSummary | null;
  leaves: UserLeaveRecord[];
  overrides: FeatureOverrides | null;
  form: {
    note: string;
    avatar: string;
    walletAmount: string;
    walletReason: string;
    walletCreditAmount: string;
    walletCreditNote: string;
    badgeType: string;
    badgeNote: string;
    leaveId: string;
  };
};

const initialState: UserDetailState = {
  ...asyncInitial,
  userId: '',
  actionLoading: null,
  refreshing: false,
  user: null,
  sessions: [],
  walletTransactions: [],
  ocrSubmissions: [],
  adminNotes: [],
  partnerRequestsSent: [],
  partnerRequestsReceived: [],
  sessionShareCodes: [],
  leaveSummary: null,
  leaves: [],
  overrides: null,
  form: {
    note: '',
    avatar: '',
    walletAmount: '0',
    walletReason: '',
    walletCreditAmount: '',
    walletCreditNote: '',
    badgeType: 'manual_correction',
    badgeNote: '',
    leaveId: '',
  },
};

const userDetailSlice = createSlice({
  name: 'userDetail',
  initialState,
  reducers: {
    setUserDetailId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    setUserDetailForm(state, action: PayloadAction<Partial<UserDetailState['form']>>) {
      state.form = { ...state.form, ...action.payload };
    },
    setUserOverridesDraft(state, action: PayloadAction<FeatureOverrides>) {
      state.overrides = action.payload;
    },
    clearUserDetailMessages(state) {
      state.error = '';
      state.message = '';
    },
    resetUserDetail(state) {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    const setMessage = (state: UserDetailState, msg: string) => {
      state.status = 'succeeded';
      state.message = msg;
    };

    builder
      .addCase(fetchUserDetail.pending, (state) => {
        state.error = '';
        if (state.user) {
          state.refreshing = true;
        } else {
          state.status = 'loading';
        }
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.refreshing = false;
        state.user = action.payload.user;
        state.sessions = action.payload.sessions;
        state.walletTransactions = action.payload.walletTransactions;
        state.ocrSubmissions = action.payload.ocrSubmissions;
        state.adminNotes = action.payload.adminNotes;
        state.partnerRequestsSent = action.payload.partnerRequestsSent;
        state.partnerRequestsReceived = action.payload.partnerRequestsReceived;
        state.sessionShareCodes = action.payload.sessionShareCodes;
        state.leaveSummary = action.payload.leaveSummary;
        state.leaves = action.payload.leaves;
        state.overrides = action.payload.overrides;
        state.form.avatar = action.payload.avatar;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.refreshing = false;
        state.error = String(action.payload ?? 'Failed to load user');
      })
      .addCase(toggleUserDisabled.pending, (state) => {
        state.actionLoading = 'toggleDisabled';
        state.error = '';
      })
      .addCase(toggleUserDisabled.fulfilled, (state) => {
        state.actionLoading = null;
        state.status = 'succeeded';
        state.message = '';
      })
      .addCase(toggleUserDisabled.rejected, (state, action) => {
        state.actionLoading = null;
        state.status = 'succeeded';
        state.error = String(action.payload);
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => setMessage(state, action.payload))
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.error = String(action.payload);
      })
      .addCase(addUserNote.fulfilled, (state, action) => {
        setMessage(state, action.payload);
        state.form.note = '';
      })
      .addCase(addUserNote.rejected, (state, action) => {
        state.error = String(action.payload);
      })
      .addCase(adjustUserWallet.fulfilled, (state, action) => {
        setMessage(state, action.payload);
        state.form.walletAmount = '0';
        state.form.walletReason = '';
      })
      .addCase(adjustUserWallet.rejected, (state, action) => {
        state.error = String(action.payload);
      })
      .addCase(creditUserWallet.fulfilled, (state, action) => {
        setMessage(state, action.payload);
        state.form.walletCreditAmount = '';
        state.form.walletCreditNote = '';
      })
      .addCase(creditUserWallet.rejected, (state, action) => {
        state.error = String(action.payload);
      })
      .addCase(submitUserBadgeCorrection.fulfilled, (state, action) => {
        setMessage(state, action.payload);
        state.form.badgeNote = '';
      })
      .addCase(submitUserBadgeCorrection.rejected, (state, action) => {
        state.error = String(action.payload);
      })
      .addCase(saveUserFeatureOverrides.fulfilled, (state, action) => setMessage(state, action.payload))
      .addCase(saveUserFeatureOverrides.rejected, (state, action) => {
        state.error = String(action.payload);
      })
      .addCase(approveUserExtraLeave.fulfilled, (state, action) => {
        setMessage(state, action.payload);
        state.form.leaveId = '';
      })
      .addCase(approveUserExtraLeave.rejected, (state, action) => {
        state.error = String(action.payload);
      });
  },
});

export const {
  setUserDetailId,
  setUserDetailForm,
  setUserOverridesDraft,
  clearUserDetailMessages,
  resetUserDetail,
} = userDetailSlice.actions;
export default userDetailSlice.reducer;

export const selectUserDetail = (state: { userDetail: UserDetailState }) => state.userDetail;
