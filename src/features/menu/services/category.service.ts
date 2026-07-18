import { apiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';
import type { ApiSuccessResponse } from '@/types/api.types';
import type { Category, CreateCategoryInput } from '@/types/menu.types';

export const categoryService = {
  async list(): Promise<Category[]> {
    const { data } = await apiClient.get<ApiSuccessResponse<Category[]>>(
      API_ENDPOINTS.categories.base,
    );
    return data.data;
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    const { data } = await apiClient.post<ApiSuccessResponse<Category>>(
      API_ENDPOINTS.categories.base,
      input,
    );
    return data.data;
  },
};
