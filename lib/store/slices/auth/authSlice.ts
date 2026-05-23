import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { adminLogin, adminLogout } from '@/lib/api';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const loginAdmin = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const res = await adminLogin(email, password);
    if (!res.ok) return rejectWithValue(res.error);
    return true;
  },
);

export const logoutAdmin = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  const res = await adminLogout();
  if (!res.ok) return rejectWithValue(res.error);
  return true;
});

type AuthState = AsyncSliceState & {
  email: string;
  password: string;
  isAuthenticated: boolean;
  logoutStatus: 'idle' | 'loading';
};

const initialState: AuthState = {
  ...asyncInitial,
  email: '',
  password: '',
  isAuthenticated: false,
  logoutStatus: 'idle',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoginEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setLoginPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    clearAuthMessages(state) {
      state.error = '';
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(loginAdmin.fulfilled, (state) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Login failed');
      })
      .addCase(logoutAdmin.pending, (state) => {
        state.logoutStatus = 'loading';
        state.error = '';
      })
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.logoutStatus = 'idle';
        state.isAuthenticated = false;
        state.email = '';
        state.password = '';
      })
      .addCase(logoutAdmin.rejected, (state, action) => {
        state.logoutStatus = 'idle';
        state.error = String(action.payload ?? 'Logout failed');
      });
  },
});

export const { setLoginEmail, setLoginPassword, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.status === 'loading';
export const selectLogoutLoading = (state: { auth: AuthState }) =>
  state.auth.logoutStatus === 'loading';
