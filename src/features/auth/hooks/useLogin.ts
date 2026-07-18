import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/auth.service';
import { useAuthStore } from '@store/auth.store';
import type { NormalizedApiError } from '@api/client';
import type { AuthResponse, LoginInput } from '@/types/auth.types';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation<AuthResponse, NormalizedApiError, LoginInput>({
    mutationFn: (input) => authService.login(input),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
    },
  });
}
