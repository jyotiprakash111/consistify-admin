import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUsers } from '@/lib/api';
import type { AdminUser } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export type UsersListFilters = {
  search: string;
  gender: string;
  tier: string;
  signupSource: string;
  status: string;
  walletFilter: string;
  sort: string;
  order: string;
};

export const defaultUsersListFilters: UsersListFilters = {
  search: '',
  gender: 'all',
  tier: 'all',
  signupSource: 'all',
  status: 'all',
  walletFilter: 'all',
  sort: 'streak',
  order: 'desc',
};

export const fetchUsersList = createAsyncThunk(
  'usersList/fetch',
  async (filters: UsersListFilters, { rejectWithValue }) => {
    const params = new URLSearchParams();
    const search = filters.search.trim();
    const phoneDigits = search.replace(/\D/g, '');
    if (phoneDigits.length >= 4) params.set('phone', phoneDigits);
    if (filters.gender !== 'all') params.set('gender', filters.gender);
    if (filters.tier !== 'all') params.set('tier', filters.tier);
    if (filters.signupSource !== 'all') params.set('signupSource', filters.signupSource);
    if (filters.status !== 'all') params.set('status', filters.status);
    params.set('walletFilter', filters.walletFilter);
    params.set('sort', filters.sort);
    params.set('order', filters.order);
    const res = await getUsers(params.toString());
    if (!res.ok) return rejectWithValue(res.error);
    return res.data.users ?? [];
  },
);

type UsersListState = AsyncSliceState & {
  users: AdminUser[];
  filters: UsersListFilters;
};

const initialState: UsersListState = {
  ...asyncInitial,
  users: [],
  filters: { ...defaultUsersListFilters },
};

const usersListSlice = createSlice({
  name: 'usersList',
  initialState,
  reducers: {
    setUsersFilter(state, action: PayloadAction<Partial<UsersListFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetUsersFilters(state) {
      state.filters = { ...defaultUsersListFilters };
    },
    clearUsersListError(state) {
      state.error = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersList.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchUsersList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsersList.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load users');
      });
  },
});

export const { setUsersFilter, resetUsersFilters, clearUsersListError } = usersListSlice.actions;
export default usersListSlice.reducer;

export const selectUsersList = (state: { usersList: UsersListState }) => state.usersList;
