import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Navigate, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Mail, Lock } from 'lucide-react';
import { Button, Input } from '@components/ui';
import { useAuthStore } from '@store/auth.store';
import { ROLE_HOME_ROUTE } from '@constants/routes';
import { useLogin } from '../hooks/useLogin';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  // Already logged in — skip straight to their home screen.
  if (user) {
    return <Navigate to={ROLE_HOME_ROUTE[user.role]} replace />;
  }

  const onSubmit = handleSubmit((values) => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        void navigate(ROLE_HOME_ROUTE[data.user.role], { replace: true });
      },
    });
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600 text-white">
            <UtensilsCrossed className="h-6 w-6" aria-hidden="true" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Eezy POS</h1>
          <p className="text-sm text-foreground/60">Sign in to continue</p>
        </div>

        <form
          onSubmit={(e) => void onSubmit(e)}
          className="flex flex-col gap-4 rounded-xl border border-border bg-background p-6 shadow-sm"
        >
          <Input
            label="Email"
            type="email"
            autoComplete="username"
            leftIcon={<Mail className="h-4 w-4" />}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register('password')}
          />

          {loginMutation.isError && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {loginMutation.error.message}
            </p>
          )}

          <Button type="submit" isLoading={loginMutation.isPending} className="mt-2 w-full">
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
}
