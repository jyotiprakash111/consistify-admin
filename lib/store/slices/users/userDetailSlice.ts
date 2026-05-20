import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  approveExtraLeave,
  getUserDetail,
  getUserFeatureOverrides,
  patchUser,
  patchUserFeatureOverrides,
} from '@/lib/api';
import type { AdminUser, FeatureOverrides } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchUserDetail = createAsyncThunk(
  'userDetail/fetch',
  async (userId: string, { rejectWithValue }) => {
    const [detailRes, overridesRes] = await Promise.all([
      getUserDetail(userId),
      getUserFeatureOverrides(userId),
    ]);
    if (!detailRes.ok) return rejectWithValue(detailRes.error);
    const overrides: FeatureOverrides | null = overridesRes.ok
      ? {
          walletEnabled: overridesRes.data.walletEnabled,
          badgeRewardsEnabled: overridesRes.data.badgeRewardsEnabled,
          emailNotificationsEnabled: overridesRes.data.emailNotificationsEnabled,
          pushNotificationsEnabled: overridesRes.data.pushNotificationsEnabled,
        }
      : null;
    return {
      user: detailRes.data.user,
      sessions: detailRes.data.sessions ?? [],
      transactions: detailRes.data.transactions ?? [],
      ocrSubmissions: detailRes.data.ocrSubmissions ?? [],
      adminNotes: detailRes.data.adminNotes ?? [],
      overrides,
      avatar: String(detailRes.data.user.avatar ?? ''),
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
    if (!res.ok) return rejectWithValue(res.error);
    await dispatch(fetchUserDetail(userId));
    return user.isDisabled ? 'User enabled' : 'User disabled';
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
  async ({ userId, leaveId }: { userId: string; leaveId: string }, { rejectWithValue }) => {
    const res = await approveExtraLeave(userId, leaveId);
    if (!res.ok) return rejectWithValue(res.error);
    return 'Extra leave approved';
  },
);

type UserDetailState = AsyncSliceState & {
  userId: string;
  user: AdminUser | null;
  sessions: Array<Record<string, unknown>>;
  transactions: Array<Record<string, unknown>>;
  ocrSubmissions: Array<Record<string, unknown>>;
  adminNotes: Array<{ id: string; text: string; createdAt: string }>;
  overrides: FeatureOverrides | null;
  form: {
    note: string;
    avatar: string;
    walletAmount: string;
    walletReason: string;
    leaveId: string;
  };
};

const initialState: UserDetailState = {
  ...asyncInitial,
  userId: '',
  user: null,
  sessions: [],
  transactions: [],
  ocrSubmissions: [],
  adminNotes: [],
  overrides: null,
  form: {
    note: '',
    avatar: '',
    walletAmount: '0',
    walletReason: '',
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
    const setPending = (state: UserDetailState) => {
      state.status = 'loading';
      state.error = '';
    };
    const setMessage = (state: UserDetailState, msg: string) => {
      state.status = 'succeeded';
      state.message = msg;
    };

    builder
      .addCase(fetchUserDetail.pending, setPending)
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.sessions = action.payload.sessions;
        state.transactions = action.payload.transactions;
        state.ocrSubmissions = action.payload.ocrSubmissions;
        state.adminNotes = action.payload.adminNotes;
        state.overrides = action.payload.overrides;
        state.form.avatar = action.payload.avatar;
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load user');
      })
      .addCase(toggleUserDisabled.fulfilled, (state, action) => setMessage(state, action.payload))
      .addCase(toggleUserDisabled.rejected, (state, action) => {
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
