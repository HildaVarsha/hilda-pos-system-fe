import { useApiQuery } from '@hooks/useApiQuery';
import { useApiMutation } from '@hooks/useApiMutation';
import { queryKeys } from '@constants/queryKeys';
import { billingService } from '../services/billing.service';
import type { PaymentMethod } from '@/types/order.types';

export function useInvoice(orderId: string | null) {
  return useApiQuery({
    queryKey: queryKeys.orders.detail(orderId ?? ''),
    queryFn: () => billingService.getInvoice(orderId as string),
    enabled: Boolean(orderId),
  });
}

export function useMarkServed() {
  return useApiMutation({
    mutationFn: (orderId: string) => billingService.markServed(orderId),
    invalidateKeys: [queryKeys.orders.all],
  });
}

export function useCompletePayment() {
  return useApiMutation({
    mutationFn: ({ orderId, method }: { orderId: string; method: PaymentMethod }) =>
      billingService.pay(orderId, method),
    invalidateKeys: [queryKeys.orders.all, queryKeys.tables.all, queryKeys.dashboard.summary],
    successMessage: 'Payment completed. Table is now available.',
  });
}
