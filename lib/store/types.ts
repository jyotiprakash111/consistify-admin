import type { ApiResult } from '@/lib/api';

export type RequestStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

export type AsyncSliceState = {
  status: RequestStatus;
  error: string;
  message: string;
};

export const asyncInitial: AsyncSliceState = {
  status: 'idle',
  error: '',
  message: '',
};

export function apiError<T>(result: ApiResult<T>): string {
  return result.ok ? '' : result.error;
}
