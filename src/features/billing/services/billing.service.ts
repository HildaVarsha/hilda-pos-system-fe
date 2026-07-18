import { apiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';
import type { ApiSuccessResponse } from '@/types/api.types';
import type { Order, PaymentMethod } from '@/types/order.types';

export const billingService = {
  async getInvoice(orderId: string): Promise<Order> {
    const { data } = await apiClient.get<ApiSuccessResponse<Order>>(
      API_ENDPOINTS.billing.invoice(orderId),
    );
    return data.data;
  },

  async markServed(orderId: string): Promise<Order> {
    const { data } = await apiClient.post<ApiSuccessResponse<Order>>(
      API_ENDPOINTS.billing.served(orderId),
    );
    return data.data;
  },

  async pay(orderId: string, method: PaymentMethod): Promise<Order> {
    const { data } = await apiClient.post<ApiSuccessResponse<Order>>(
      API_ENDPOINTS.billing.pay(orderId),
      {
        method,
      },
    );
    return data.data;
  },
};
