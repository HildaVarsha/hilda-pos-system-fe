import { useQuery, type UseQueryOptions, type QueryKey } from '@tanstack/react-query';
import type { NormalizedApiError } from '@api/client';

/**
 * Thin wrapper around `useQuery` that fixes the error type to
 * `NormalizedApiError` (see api/client.ts) so every feature hook gets
 * `error.message` / `error.fieldErrors` typed for free, instead of each
 * feature re-declaring `useQuery<T, AxiosError>`.
 *
 * Feature hooks call this, they never call `useQuery` directly:
 *
 * ```ts
 * export function useMenuItems(params: MenuListParams) {
 *   return useApiQuery({
 *     queryKey: queryKeys.menu.list(params),
 *     queryFn: () => menuService.list(params),
 *   });
 * }
 * ```
 */
export function useApiQuery<TData>(
  options: UseQueryOptions<TData, NormalizedApiError, TData, QueryKey>,
) {
  return useQuery(options);
}
