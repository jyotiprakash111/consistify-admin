import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSystemConfig, updateSystemConfig } from '@/lib/api';
import type { SystemConfig } from '@/lib/types/admin';
import { asyncInitial, type AsyncSliceState } from '@/lib/store/types';

export const fetchSystemConfig = createAsyncThunk('settings/fetch', async (_, { rejectWithValue }) => {
  const res = await getSystemConfig();
  if (!res.ok) return rejectWithValue(res.error);
  return res.data;
});

export const saveSystemConfig = createAsyncThunk(
  'settings/save',
  async (config: SystemConfig, { rejectWithValue }) => {
    const res = await updateSystemConfig(config);
    if (!res.ok) return rejectWithValue(res.error);
    return 'Config saved';
  },
);

export const saveSystemConfigRaw = createAsyncThunk(
  'settings/saveRaw',
  async (rawJson: string, { rejectWithValue }) => {
    try {
      const payload = JSON.parse(rawJson) as SystemConfig;
      const res = await updateSystemConfig(payload);
      if (!res.ok) return rejectWithValue(res.error);
      return { message: 'Raw JSON saved', config: payload };
    } catch {
      return rejectWithValue('Invalid JSON');
    }
  },
);

type SettingsState = AsyncSliceState & {
  config: SystemConfig | null;
  rawJson: string;
};

const initialState: SettingsState = {
  ...asyncInitial,
  config: null,
  rawJson: '{}',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSystemConfig(state, action: PayloadAction<SystemConfig>) {
      state.config = action.payload;
    },
    setSettingsRawJson(state, action: PayloadAction<string>) {
      state.rawJson = action.payload;
    },
    patchConfigSection(
      state,
      action: PayloadAction<{ section: keyof SystemConfig; key: string; value: boolean | number }>,
    ) {
      if (!state.config) return;
      const { section, key, value } = action.payload;
      state.config = {
        ...state.config,
        [section]: { ...(state.config[section] as Record<string, unknown>), [key]: value },
      } as SystemConfig;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemConfig.pending, (state) => {
        state.status = 'loading';
        state.error = '';
      })
      .addCase(fetchSystemConfig.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.config = action.payload;
        state.rawJson = JSON.stringify(action.payload, null, 2);
      })
      .addCase(fetchSystemConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load config');
      })
      .addCase(saveSystemConfig.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(saveSystemConfig.rejected, (state, action) => {
        state.error = String(action.payload);
      })
      .addCase(saveSystemConfigRaw.fulfilled, (state, action) => {
        state.message = action.payload.message;
        state.config = action.payload.config;
        state.rawJson = JSON.stringify(action.payload.config, null, 2);
      })
      .addCase(saveSystemConfigRaw.rejected, (state, action) => {
        state.error = String(action.payload);
      });
  },
});

export const { setSystemConfig, setSettingsRawJson, patchConfigSection } = settingsSlice.actions;
export default settingsSlice.reducer;

export const selectSettings = (state: { settings: SettingsState }) => state.settings;
