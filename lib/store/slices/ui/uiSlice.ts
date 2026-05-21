import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FlashType = 'success' | 'error';

export type FlashMessage = {
  message: string;
  type: FlashType;
};

type UiState = {
  flash: FlashMessage | null;
};

const initialState: UiState = {
  flash: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showFlash(state, action: PayloadAction<FlashMessage>) {
      state.flash = action.payload;
    },
    showSuccessFlash(state, action: PayloadAction<string>) {
      state.flash = { message: action.payload, type: 'success' };
    },
    showErrorFlash(state, action: PayloadAction<string>) {
      state.flash = { message: action.payload, type: 'error' };
    },
    clearFlash(state) {
      state.flash = null;
    },
  },
});

export const { showFlash, showSuccessFlash, showErrorFlash, clearFlash } = uiSlice.actions;
export default uiSlice.reducer;

export const selectFlash = (state: { ui: UiState }) => state.ui.flash;
