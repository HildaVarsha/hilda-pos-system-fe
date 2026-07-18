import { useNavigate } from 'react-router-dom';
import { CompassIcon } from 'lucide-react';
import { Button } from '@components/ui';
import { useAuthStore } from '@store/auth.store';
import { ROLE_HOME_ROUTE, ROUTES } from '@constants/routes';

export function NotFoundPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const homeRoute = user ? ROLE_HOME_ROUTE[user.role] : ROUTES.login;

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-hover">
        <CompassIcon className="h-7 w-7 text-foreground/40" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">Page not found</h1>
        <p className="mt-1 text-sm text-foreground/60">
          The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have access to it.
        </p>
      </div>
      <Button onClick={() => void navigate(homeRoute, { replace: true })}>Go back</Button>
    </div>
  );
}
