'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { NetworkErrorBanner } from '@/components/ui/network-error-banner';
import {
  NETWORK_ERROR_EVENT,
  NETWORK_OK_EVENT,
  emitNetworkOk,
  isBrowserOffline,
} from '@/lib/network-events';

type NetworkContextValue = {
  isOffline: boolean;
  hasNetworkError: boolean;
  dismissApiError: () => void;
};

const NetworkContext = createContext<NetworkContextValue | null>(null);

export function useNetworkStatus() {
  const ctx = useContext(NetworkContext);
  if (!ctx) {
    throw new Error('useNetworkStatus must be used within NetworkProvider');
  }
  return ctx;
}

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [apiNetworkError, setApiNetworkError] = useState(false);
  const [mounted, setMounted] = useState(false);

  const syncOffline = useCallback(() => {
    setIsOffline(isBrowserOffline());
  }, []);

  useEffect(() => {
    setMounted(true);
    syncOffline();

    const onOnline = () => {
      setIsOffline(false);
      setApiNetworkError(false);
      emitNetworkOk();
    };
    const onOffline = () => {
      setIsOffline(true);
      setApiNetworkError(true);
    };
    const onApiError = () => setApiNetworkError(true);
    const onApiOk = () => {
      if (!isBrowserOffline()) setApiNetworkError(false);
    };

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener(NETWORK_ERROR_EVENT, onApiError);
    window.addEventListener(NETWORK_OK_EVENT, onApiOk);

    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener(NETWORK_ERROR_EVENT, onApiError);
      window.removeEventListener(NETWORK_OK_EVENT, onApiOk);
    };
  }, [syncOffline]);

  const showBanner = mounted && (isOffline || apiNetworkError);

  const onRetry = useCallback(() => {
    syncOffline();
    if (!isBrowserOffline()) {
      setApiNetworkError(false);
      emitNetworkOk();
    }
  }, [syncOffline]);

  const value = useMemo<NetworkContextValue>(
    () => ({
      isOffline,
      hasNetworkError: isOffline || apiNetworkError,
      dismissApiError: () => setApiNetworkError(false),
    }),
    [isOffline, apiNetworkError],
  );

  return (
    <NetworkContext.Provider value={value}>
      {showBanner ? <NetworkErrorBanner offline={isOffline} onRetry={onRetry} /> : null}
      <div className={showBanner ? 'pt-[4.25rem]' : undefined}>{children}</div>
    </NetworkContext.Provider>
  );
}
