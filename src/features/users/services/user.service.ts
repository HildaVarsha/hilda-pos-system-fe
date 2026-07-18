import { apiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';
import type { ApiSuccessResponse, PaginatedResult } from '@/types/api.types';
import type { Role, User } from '@/types/auth.types';

export interface CreateStaffInput {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateStaffInput {
  name?: string;
  role?: Role;
}

export const userService = {
  async list(params: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<PaginatedResult<User>> {
    const { data } = await apiClient.get<ApiSuccessResponse<User[]>>(API_ENDPOINTS.users.base, {
      params,
    });
    return { items: data.data, meta: data.meta?.pagination as PaginatedResult<User>['meta'] };
  },

  async create(input: CreateStaffInput): Promise<User> {
    const { data } = await apiClient.post<ApiSuccessResponse<User>>(
      API_ENDPOINTS.users.base,
      input,
    );
    return data.data;
  },

  async update(id: string, input: UpdateStaffInput): Promise<User> {
    const { data } = await apiClient.put<ApiSuccessResponse<User>>(
      API_ENDPOINTS.users.byId(id),
      input,
    );
    return data.data;
  },

  async resetPassword(id: string, newPassword: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.users.resetPassword(id), { newPassword });
  },

  async deactivate(id: string): Promise<User> {
    const { data } = await apiClient.post<ApiSuccessResponse<User>>(
      API_ENDPOINTS.users.deactivate(id),
    );
    return data.data;
  },

  async reactivate(id: string): Promise<User> {
    const { data } = await apiClient.post<ApiSuccessResponse<User>>(
      API_ENDPOINTS.users.reactivate(id),
    );
    return data.data;
  },
};
