import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUsers } from '@/lib/api';
import type { AdminUser } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export type UsersListFilters = {
  phone: string;
  status: string;
  walletFilter: string;
  sort: string;
  order: string;
};

export const fetchUsersList = createAsyncThunk(
  'usersList/fetch',
  async (filters: UsersListFilters, { rejectWithValue }) => {
    const params = new URLSearchParams();
    if (filters.phone.trim()) params.set('phone', filters.phone.trim());
    params.set('status', filters.status);
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
  filters: {
    phone: '',
    status: 'all',
    walletFilter: 'all',
    sort: 'streak',
    order: 'desc',
  },
};

const usersListSlice = createSlice({
  name: 'usersList',
  initialState,
  reducers: {
    setUsersFilter(state, action: PayloadAction<Partial<UsersListFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
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

export const { setUsersFilter, clearUsersListError } = usersListSlice.actions;
export default usersListSlice.reducer;

export const selectUsersList = (state: { usersList: UsersListState }) => state.usersList;
