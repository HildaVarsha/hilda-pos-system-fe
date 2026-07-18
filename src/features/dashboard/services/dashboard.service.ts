import { apiClient } from '@api/client';
import { API_ENDPOINTS } from '@api/endpoints';
import type { ApiSuccessResponse } from '@/types/api.types';
import type { DashboardSummary } from '@/types/dashboard.types';

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const { data } = await apiClient.get<ApiSuccessResponse<DashboardSummary>>(
      API_ENDPOINTS.dashboard.summary,
    );
    return data.data;
  },
};
