import { useApiQuery } from '@hooks/useApiQuery';
import { useApiMutation } from '@hooks/useApiMutation';
import { queryKeys } from '@constants/queryKeys';
import { categoryService } from '../services/category.service';
import type { CreateCategoryInput } from '@/types/menu.types';

export function useCategories() {
  return useApiQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoryService.list(),
  });
}

export function useCreateCategory() {
  return useApiMutation({
    mutationFn: (input: CreateCategoryInput) => categoryService.create(input),
    invalidateKeys: [queryKeys.categories.all],
    successMessage: 'Category created',
  });
}
