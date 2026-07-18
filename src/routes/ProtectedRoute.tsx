import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { ROLE_HOME_ROUTE, ROUTES } from '@constants/routes';
import type { Role } from '@/types/auth.types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

/**
 * Wraps a branch of the route tree (see routes/router.tsx). Unauthenticated
 * users are sent to `/login`; authenticated users whose role isn't in
 * `allowedRoles` are sent to their own home route rather than a generic
 * 403 page — there's nothing for them to do on a screen they can't use.
 */
export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME_ROUTE[user.role]} replace />;
  }

  return <Outlet />;
}
