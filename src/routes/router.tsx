import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { useAuthStore } from '@store/auth.store';
import { ROLE_HOME_ROUTE, ROUTES } from '@constants/routes';
import { ProtectedRoute } from './ProtectedRoute';
import { NotFoundPage } from './NotFoundPage';

const LoginPage = lazy(() => import('@features/auth').then((m) => ({ default: m.LoginPage })));
const AppLayout = lazy(() => import('@layouts/AppLayout').then((m) => ({ default: m.AppLayout })));
const DashboardPage = lazy(() =>
  import('@features/dashboard').then((m) => ({ default: m.DashboardPage })),
);
const MenuManagementPage = lazy(() =>
  import('@features/menu').then((m) => ({ default: m.MenuManagementPage })),
);
const TablesPage = lazy(() => import('@features/tables').then((m) => ({ default: m.TablesPage })));
const UserManagementPage = lazy(() =>
  import('@features/users').then((m) => ({ default: m.UserManagementPage })),
);
const POSPage = lazy(() => import('@features/pos').then((m) => ({ default: m.POSPage })));
const KitchenDisplayPage = lazy(() =>
  import('@features/kitchen').then((m) => ({ default: m.KitchenDisplayPage })),
);

function PageFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
    </div>
  );
}

function withSuspense(element: ReactNode) {
  return <Suspense fallback={<PageFallback />}>{element}</Suspense>;
}

function RootRedirect() {
  const user = useAuthStore((state) => state.user);
  return <Navigate to={user ? ROLE_HOME_ROUTE[user.role] : ROUTES.login} replace />;
}

const router = createBrowserRouter([
  { path: '/', element: <RootRedirect /> },
  { path: ROUTES.login, element: withSuspense(<LoginPage />) },
  {
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        element: withSuspense(<AppLayout />),
        children: [
          { path: ROUTES.admin.dashboard, element: withSuspense(<DashboardPage />) },
          { path: ROUTES.admin.menu, element: withSuspense(<MenuManagementPage />) },
          { path: ROUTES.admin.tables, element: withSuspense(<TablesPage />) },
          { path: ROUTES.admin.users, element: withSuspense(<UserManagementPage />) },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['RECEPTIONIST']} />,
    children: [
      {
        element: withSuspense(<AppLayout />),
        children: [{ path: ROUTES.pos, element: withSuspense(<POSPage />) }],
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['KITCHEN']} />,
    children: [
      {
        element: withSuspense(<AppLayout />),
        children: [{ path: ROUTES.kitchen, element: withSuspense(<KitchenDisplayPage />) }],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
