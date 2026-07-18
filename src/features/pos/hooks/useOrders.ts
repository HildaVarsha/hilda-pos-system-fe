import { useApiQuery } from '@hooks/useApiQuery';
import { useApiMutation } from '@hooks/useApiMutation';
import { queryKeys } from '@constants/queryKeys';
import { orderService, type OrderListParams } from '../services/order.service';
import type { CreateOrderInput } from '@/types/order.types';

/** Active (non-final) orders — used to know which tables have an order in
 * progress and to surface a "Bill" action once one reaches READY/SERVED. */
export function useActiveOrders() {
  return useApiQuery({
    queryKey: queryKeys.orders.list({ active: true }),
    queryFn: () => orderService.list({ pageSize: 100 }),
    select: (result) => ({
      ...result,
      items: result.items.filter((order) => !['COMPLETED', 'CANCELLED'].includes(order.status)),
    }),
    refetchInterval: 15_000,
  });
}

export function useOrders(params: OrderListParams) {
  return useApiQuery({
    queryKey: queryKeys.orders.list(params),
    queryFn: () => orderService.list(params),
  });
}

export function useCreateOrder() {
  return useApiMutation({
    mutationFn: (input: CreateOrderInput) => orderService.create(input),
    invalidateKeys: [queryKeys.orders.all, queryKeys.tables.all, queryKeys.kitchen.active],
    successMessage: 'Order sent to kitchen',
  });
}

export function useCancelOrder() {
  return useApiMutation({
    mutationFn: (id: string) => orderService.cancel(id),
    invalidateKeys: [queryKeys.orders.all, queryKeys.tables.all, queryKeys.kitchen.active],
    successMessage: 'Order cancelled',
  });
}
