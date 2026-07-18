import { apiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';
import type { ApiSuccessResponse } from '@/types/api.types';
import type { KitchenAction, Order } from '@/types/order.types';

export const kitchenService = {
  async listActive(): Promise<Order[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<Order[]>>(API_ENDPOINTS.kitchen.active);
    return data.data;
  },

  async updateStatus(orderId: string, action: KitchenAction): Promise<Order> {
    const { data } = await apiClient.patch<ApiSuccessResponse<Order>>(
      API_ENDPOINTS.kitchen.status(orderId),
      {
        action,
      },
    );
    return data.data;
  },
};
