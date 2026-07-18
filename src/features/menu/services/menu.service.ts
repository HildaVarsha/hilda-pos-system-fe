import { apiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';
import type { ApiSuccessResponse, PaginatedResult } from '@/types/api.types';
import type { CreateMenuItemInput, MenuItem, UpdateMenuItemInput } from '@/types/menu.types';

export interface MenuListParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  foodType?: string;
  isAvailable?: boolean;
}

export const menuService = {
  async list(params: MenuListParams): Promise<PaginatedResult<MenuItem>> {
    const { data } = await apiClient.get<ApiSuccessResponse<MenuItem[]>>(API_ENDPOINTS.menu.base, {
      params,
    });
    return { items: data.data, meta: data.meta?.pagination as PaginatedResult<MenuItem>['meta'] };
  },

  async create(input: CreateMenuItemInput): Promise<MenuItem> {
    const { data } = await apiClient.post<ApiSuccessResponse<MenuItem>>(
      API_ENDPOINTS.menu.base,
      input,
    );
    return data.data;
  },

  async update(id: string, input: UpdateMenuItemInput): Promise<MenuItem> {
    const { data } = await apiClient.put<ApiSuccessResponse<MenuItem>>(
      API_ENDPOINTS.menu.byId(id),
      input,
    );
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.menu.byId(id));
  },
};
