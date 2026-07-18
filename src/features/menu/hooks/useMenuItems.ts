import { useApiQuery } from '@hooks/useApiQuery';
import { useApiMutation } from '@hooks/useApiMutation';
import { queryKeys } from '@constants/queryKeys';
import { menuService, type MenuListParams } from '../services/menu.service';
import type { CreateMenuItemInput, UpdateMenuItemInput } from '@/types/menu.types';

export function useMenuItems(params: MenuListParams) {
  return useApiQuery({
    queryKey: queryKeys.menu.list(params),
    queryFn: () => menuService.list(params),
  });
}

export function useCreateMenuItem() {
  return useApiMutation({
    mutationFn: (input: CreateMenuItemInput) => menuService.create(input),
    invalidateKeys: [queryKeys.menu.all],
    successMessage: 'Menu item created',
  });
}

export function useUpdateMenuItem() {
  return useApiMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateMenuItemInput }) =>
      menuService.update(id, input),
    invalidateKeys: [queryKeys.menu.all],
    successMessage: 'Menu item updated',
  });
}

export function useDeleteMenuItem() {
  return useApiMutation({
    mutationFn: (id: string) => menuService.delete(id),
    invalidateKeys: [queryKeys.menu.all],
    successMessage: 'Menu item deleted',
  });
}
