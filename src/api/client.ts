import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { env } from '@constants/env';
import { useAuthStore } from '@store/auth.store';
import type { ApiErrorResponse } from '@/types/api.types';
import type { AuthResponse } from '@/types/auth.types';

/**
 * The single Axios instance used by every feature service.
 * Feature services (`features/<x>/services/<x>.service.ts`) must import
 * this client rather than calling `axios` directly, so auth headers,
 * base URL, and error normalization are applied uniformly everywhere.
 *
 * `withCredentials` is enabled because the refresh token is delivered as
 * an httpOnly cookie, scoped to `/api/v1/auth` by the backend.
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

/**
 * Multiple requests can 401 at once (e.g. Dashboard fires 4 queries in
 * parallel right after the access token expires). Without this, each one
 * would independently hit `/auth/refresh`, racing to rotate the same
 * refresh token — the loser gets a "token revoked" error. `refreshPromise`
 * ensures only one refresh call is ever in flight; everyone else awaits it.
 */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  refreshPromise ??= (async () => {
    try {
      const response = await axios.post<{ data: AuthResponse }>(
        `${env.apiBaseUrl}/auth/refresh`,
        {},
        { withCredentials: true },
      );
      const { user, accessToken } = response.data.data;
      useAuthStore.getState().setAuth(user, accessToken);
      return accessToken;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as
      (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        return await apiClient.request(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
        window.location.assign('/login');
        return Promise.reject(normalizeApiError(error));
      }
    }

    return Promise.reject(normalizeApiError(error));
  },
);

/**
 * A real `Error` subclass (not a plain object) carrying the normalized
 * fields every UI layer consumes, so `throw`/`Promise.reject` sites stay
 * lint-clean and `instanceof Error` checks elsewhere in the app keep working.
 */
export class NormalizedApiError extends Error {
  public readonly statusCode: number;
  public readonly fieldErrors?: Record<string, string[] | undefined>;

  constructor(
    statusCode: number,
    message: string,
    fieldErrors?: Record<string, string[] | undefined>,
  ) {
    super(message);
    this.name = 'NormalizedApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    Object.setPrototypeOf(this, NormalizedApiError.prototype);
  }
}

/**
 * Converts any Axios error (network failure, timeout, or a structured
 * `{ success: false, message, errors }` payload from the backend) into one
 * predictable shape so UI code never has to branch on `error.response?.data?.message`.
 */
export function normalizeApiError(error: AxiosError<ApiErrorResponse>): NormalizedApiError {
  if (error.response) {
    const { status, data } = error.response;
    return new NormalizedApiError(
      status,
      data?.message ?? 'Something went wrong. Please try again.',
      data?.errors as Record<string, string[] | undefined> | undefined,
    );
  }

  if (error.request) {
    return new NormalizedApiError(
      0,
      'Unable to reach the server. Check your connection and try again.',
    );
  }

  return new NormalizedApiError(0, error.message || 'An unexpected error occurred.');
}
