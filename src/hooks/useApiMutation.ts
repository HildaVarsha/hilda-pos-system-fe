import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
  type QueryKey,
} from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { NormalizedApiError } from '@api/client';

interface UseApiMutationExtras {
  /** Query key branches to invalidate on success (e.g. queryKeys.menu.all). */
  invalidateKeys?: QueryKey[];
  /** Shown via react-hot-toast on success. Omit to stay silent. */
  successMessage?: string;
  /**
   * Shown via react-hot-toast on failure. Defaults to the normalized
   * server error message. Pass `false` to suppress the toast entirely
   * (e.g. when the caller renders inline field errors instead).
   */
  showErrorToast?: boolean;
}

/**
 * Thin wrapper around `useMutation` that standardizes three things every
 * mutation in this app needs: typed errors, cache invalidation, and toast
 * feedback — so feature hooks stay one-liners:
 *
 * ```ts
 * export function useCreateMenuItem() {
 *   return useApiMutation({
 *     mutationFn: menuService.create,
 *     invalidateKeys: [queryKeys.menu.all],
 *     successMessage: 'Menu item created',
 *   });
 * }
 * ```
 */
export function useApiMutation<TData, TVariables>(
  options: UseMutationOptions<TData, NormalizedApiError, TVariables> & UseApiMutationExtras,
) {
  const { invalidateKeys, successMessage, showErrorToast = true, ...mutationOptions } = options;
  const queryClient = useQueryClient();

  return useMutation<TData, NormalizedApiError, TVariables>({
    ...mutationOptions,
    onSuccess: (data, variables, onMutateResult, context) => {
      invalidateKeys?.forEach((key) => {
        void queryClient.invalidateQueries({ queryKey: key });
      });
      if (successMessage) {
        toast.success(successMessage);
      }
      options.onSuccess?.(data, variables, onMutateResult, context);
    },
    onError: (error, variables, onMutateResult, context) => {
      if (showErrorToast) {
        toast.error(error.message);
      }
      options.onError?.(error, variables, onMutateResult, context);
    },
  });
}
