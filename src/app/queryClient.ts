import { QueryClient } from '@tanstack/react-query';
import { NormalizedApiError } from '@api/client';

/**
 * Single QueryClient instance for the whole app. Defaults favor a POS
 * environment where staff act on near-real-time data (orders, tables,
 * kitchen queue): short `staleTime`, no refetch storms on window focus
 * changes mid-order, and no retries on 4xx client errors.
 *
 * Mutation error toasts are NOT configured globally here — they're
 * handled per-call by `useApiMutation` (see hooks/useApiMutation.ts),
 * so a caller can opt out via `showErrorToast: false` when it renders
 * its own inline error UI instead.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) => {
        // Never retry client errors (4xx) — only transient network/5xx issues.
        if (
          error instanceof NormalizedApiError &&
          error.statusCode >= 400 &&
          error.statusCode < 500
        ) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});
