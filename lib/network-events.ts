/** Custom events for global network status (browser + API layer). */
export const NETWORK_ERROR_EVENT = 'persistify:network-error';
export const NETWORK_OK_EVENT = 'persistify:network-ok';

export function emitNetworkError() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NETWORK_ERROR_EVENT));
}

export function emitNetworkOk() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(NETWORK_OK_EVENT));
}

export function isBrowserOffline() {
  return typeof navigator !== 'undefined' && !navigator.onLine;
}
