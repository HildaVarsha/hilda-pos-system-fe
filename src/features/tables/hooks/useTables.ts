import { useApiQuery } from '@hooks/useApiQuery';
import { useApiMutation } from '@hooks/useApiMutation';
import { queryKeys } from '@constants/queryKeys';
import { tableService } from '../services/table.service';
import type { CreateTableInput, TableStatus } from '@/types/table.types';

export function useTables() {
  return useApiQuery({
    queryKey: queryKeys.tables.all,
    queryFn: () => tableService.list(),
    refetchInterval: 15_000,
  });
}

export function useCreateTable() {
  return useApiMutation({
    mutationFn: (input: CreateTableInput) => tableService.create(input),
    invalidateKeys: [queryKeys.tables.all],
    successMessage: 'Table added',
  });
}

export function useUpdateTableStatus() {
  return useApiMutation({
    mutationFn: ({ id, status }: { id: string; status: TableStatus }) =>
      tableService.updateStatus(id, status),
    invalidateKeys: [queryKeys.tables.all],
  });
}

export function useDeleteTable() {
  return useApiMutation({
    mutationFn: (id: string) => tableService.delete(id),
    invalidateKeys: [queryKeys.tables.all],
    successMessage: 'Table removed',
  });
}
