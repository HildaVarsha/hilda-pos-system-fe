import { apiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';
import type { ApiSuccessResponse } from '@/types/api.types';
import type { CreateTableInput, RestaurantTable, TableStatus } from '@/types/table.types';

export const tableService = {
  async list(): Promise<RestaurantTable[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<RestaurantTable[]>>(
      API_ENDPOINTS.tables.base,
    );
    return data.data;
  },

  async create(input: CreateTableInput): Promise<RestaurantTable> {
    const { data } = await apiClient.post<ApiSuccessResponse<RestaurantTable>>(
      API_ENDPOINTS.tables.base,
      input,
    );
    return data.data;
  },

  async updateStatus(id: string, status: TableStatus): Promise<RestaurantTable> {
    const { data } = await apiClient.patch<ApiSuccessResponse<RestaurantTable>>(
      API_ENDPOINTS.tables.status(id),
      { status },
    );
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.tables.byId(id));
  },
};
