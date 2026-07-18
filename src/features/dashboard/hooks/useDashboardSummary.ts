import { useApiQuery } from '@hooks/useApiQuery';
import { queryKeys } from '@constants/queryKeys';
import { dashboardService } from '../services/dashboard.service';

export function useDashboardSummary() {
  return useApiQuery({
    queryKey: queryKeys.dashboard.summary,
    queryFn: () => dashboardService.getSummary(),
    refetchInterval: 30_000,
  });
}
