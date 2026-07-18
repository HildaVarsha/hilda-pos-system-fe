import { useApiQuery } from '@hooks/useApiQuery';
import { useApiMutation } from '@hooks/useApiMutation';
import { queryKeys } from '@constants/queryKeys';
import { kitchenService } from '../services/kitchen.service';
import type { KitchenAction } from '@/types/order.types';

export function useActiveKitchenOrders() {
  return useApiQuery({
    queryKey: queryKeys.kitchen.active,
    queryFn: () => kitchenService.listActive(),
    refetchInterval: 10_000,
  });
}

export function useUpdateKitchenStatus() {
  return useApiMutation({
    mutationFn: ({ orderId, action }: { orderId: string; action: KitchenAction }) =>
      kitchenService.updateStatus(orderId, action),
    invalidateKeys: [queryKeys.kitchen.active, queryKeys.orders.all, queryKeys.dashboard.summary],
  });
}
