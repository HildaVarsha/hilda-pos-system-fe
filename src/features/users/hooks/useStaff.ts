import { useApiQuery } from '@hooks/useApiQuery';
import { useApiMutation } from '@hooks/useApiMutation';
import { queryKeys } from '@constants/queryKeys';
import {
  userService,
  type CreateStaffInput,
  type UpdateStaffInput,
} from '../services/user.service';

export function useStaff(params: { page?: number; pageSize?: number; search?: string }) {
  return useApiQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => userService.list(params),
  });
}

export function useCreateStaff() {
  return useApiMutation({
    mutationFn: (input: CreateStaffInput) => userService.create(input),
    invalidateKeys: [queryKeys.users.all],
    successMessage: 'Staff account created',
  });
}

export function useUpdateStaff() {
  return useApiMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateStaffInput }) =>
      userService.update(id, input),
    invalidateKeys: [queryKeys.users.all],
    successMessage: 'Staff account updated',
  });
}

export function useResetStaffPassword() {
  return useApiMutation({
    mutationFn: ({ id, newPassword }: { id: string; newPassword: string }) =>
      userService.resetPassword(id, newPassword),
    successMessage: 'Password reset',
  });
}

export function useToggleStaffActive() {
  return useApiMutation({
    mutationFn: ({ id, activate }: { id: string; activate: boolean }) =>
      activate ? userService.reactivate(id) : userService.deactivate(id),
    invalidateKeys: [queryKeys.users.all],
  });
}
