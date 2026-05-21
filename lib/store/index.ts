import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/lib/store/slices/auth/authSlice';
import dashboardReducer from '@/lib/store/slices/dashboard/dashboardSlice';
import usersListReducer from '@/lib/store/slices/users/usersListSlice';
import userDetailReducer from '@/lib/store/slices/users/userDetailSlice';
import featureOverridesReducer from '@/lib/store/slices/users/featureOverridesSlice';
import fineCollectionReducer from '@/lib/store/slices/fine-collection/fineCollectionSlice';
import walletReducer from '@/lib/store/slices/wallet/walletSlice';
import ocrReducer from '@/lib/store/slices/ocr/ocrSlice';
import badgesReducer from '@/lib/store/slices/badges/badgesSlice';
import analyticsReducer from '@/lib/store/slices/analytics/analyticsSlice';
import settingsReducer from '@/lib/store/slices/settings/settingsSlice';
import logsReducer from '@/lib/store/slices/logs/logsSlice';
import sessionInvitesReducer from '@/lib/store/slices/session-invites/sessionInvitesSlice';
import extraLeavesReducer from '@/lib/store/slices/extra-leaves/extraLeavesSlice';
import examSubjectsReducer from '@/lib/store/slices/exam-subjects/examSubjectsSlice';
import uiReducer from '@/lib/store/slices/ui/uiSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      ui: uiReducer,
      auth: authReducer,
      dashboard: dashboardReducer,
      usersList: usersListReducer,
      userDetail: userDetailReducer,
      featureOverrides: featureOverridesReducer,
      fineCollection: fineCollectionReducer,
      wallet: walletReducer,
      ocr: ocrReducer,
      badges: badgesReducer,
      analytics: analyticsReducer,
      settings: settingsReducer,
      logs: logsReducer,
      sessionInvites: sessionInvitesReducer,
      extraLeaves: extraLeavesReducer,
      examSubjects: examSubjectsReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
