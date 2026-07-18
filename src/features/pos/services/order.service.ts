import { apiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';
import type { ApiSuccessResponse, PaginatedResult } from '@/types/api.types';
import type { CreateOrderInput, Order, OrderStatus } from '@/types/order.types';

export interface OrderListParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
}

export const orderService = {
  async list(params: OrderListParams): Promise<PaginatedResult<Order>> {
    const { data } = await apiClient.get<ApiSuccessResponse<Order[]>>(API_ENDPOINTS.orders.base, {
      params,
    });
    return { items: data.data, meta: data.meta?.pagination as PaginatedResult<Order>['meta'] };
  },

  async getById(id: string): Promise<Order> {
    const { data } = await apiClient.get<ApiSuccessResponse<Order>>(API_ENDPOINTS.orders.byId(id));
    return data.data;
  },

  async create(input: CreateOrderInput): Promise<Order> {
    const { data } = await apiClient.post<ApiSuccessResponse<Order>>(
      API_ENDPOINTS.orders.base,
      input,
    );
    return data.data;
  },

  async cancel(id: string): Promise<Order> {
    const { data } = await apiClient.post<ApiSuccessResponse<Order>>(
      API_ENDPOINTS.orders.cancel(id),
    );
    return data.data;
  },
};
