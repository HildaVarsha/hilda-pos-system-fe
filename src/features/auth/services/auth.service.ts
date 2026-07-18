import { apiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';
import type { ApiSuccessResponse } from '@/types/api.types';
import type { AuthResponse, LoginInput, User } from '@/types/auth.types';

export const authService = {
  async login(input: LoginInput): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiSuccessResponse<AuthResponse>>(
      API_ENDPOINTS.auth.login,
      input,
    );
    return data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.auth.logout);
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiSuccessResponse<User>>(API_ENDPOINTS.auth.me);
    return data.data;
  },
};
