import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getSystemConfig, updateSystemConfig } from '@/lib/api';
import { cloneConfig, configsEqual } from '@/lib/settings/config-utils';
import type { ConfigSectionKey } from '@/lib/settings/config-sections';
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
    return config;
  },
);

export const saveSystemConfigRaw = createAsyncThunk(
  'settings/saveRaw',
  async (rawJson: string, { rejectWithValue }) => {
    try {
      const payload = JSON.parse(rawJson) as SystemConfig;
      const res = await updateSystemConfig(payload);
      if (!res.ok) return rejectWithValue(res.error);
      return payload;
    } catch {
      return rejectWithValue('Invalid JSON');
    }
  },
);

type SettingsState = AsyncSliceState & {
  config: SystemConfig | null;
  initialConfig: SystemConfig | null;
  rawJson: string;
  saving: boolean;
};

const initialState: SettingsState = {
  ...asyncInitial,
  config: null,
  initialConfig: null,
  rawJson: '{}',
  saving: false,
};

function applySavedConfig(state: SettingsState, config: SystemConfig) {
  state.config = config;
  state.initialConfig = cloneConfig(config);
  state.rawJson = JSON.stringify(config, null, 2);
  state.message = 'Config saved';
  state.error = '';
}

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
    patchConfigField(
      state,
      action: PayloadAction<{
        section: ConfigSectionKey;
        key: string;
        value: string | number | boolean;
      }>,
    ) {
      if (!state.config) return;
      const { section, key, value } = action.payload;
      state.config = {
        ...state.config,
        [section]: {
          ...(state.config[section] as Record<string, unknown>),
          [key]: value,
        },
      } as SystemConfig;
    },
    resetSettingsDraft(state) {
      if (!state.initialConfig) return;
      state.config = cloneConfig(state.initialConfig);
      state.rawJson = JSON.stringify(state.initialConfig, null, 2);
      state.error = '';
      state.message = '';
    },
    clearSettingsMessages(state) {
      state.error = '';
      state.message = '';
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
        applySavedConfig(state, action.payload);
        state.message = '';
      })
      .addCase(fetchSystemConfig.rejected, (state, action) => {
        state.status = 'failed';
        state.error = String(action.payload ?? 'Failed to load config');
      })
      .addCase(saveSystemConfig.pending, (state) => {
        state.saving = true;
        state.error = '';
        state.message = '';
      })
      .addCase(saveSystemConfig.fulfilled, (state, action) => {
        state.saving = false;
        applySavedConfig(state, action.payload);
      })
      .addCase(saveSystemConfig.rejected, (state, action) => {
        state.saving = false;
        state.error = String(action.payload ?? 'Save failed');
      })
      .addCase(saveSystemConfigRaw.pending, (state) => {
        state.saving = true;
        state.error = '';
        state.message = '';
      })
      .addCase(saveSystemConfigRaw.fulfilled, (state, action) => {
        state.saving = false;
        applySavedConfig(state, action.payload);
      })
      .addCase(saveSystemConfigRaw.rejected, (state, action) => {
        state.saving = false;
        state.error = String(action.payload ?? 'Save failed');
      });
  },
});

export const {
  setSystemConfig,
  setSettingsRawJson,
  patchConfigField,
  resetSettingsDraft,
  clearSettingsMessages,
} = settingsSlice.actions;
export default settingsSlice.reducer;

export const selectSettings = (state: { settings: SettingsState }) => state.settings;

export const selectSettingsDirty = (state: { settings: SettingsState }) =>
  !configsEqual(state.settings.config, state.settings.initialConfig);
