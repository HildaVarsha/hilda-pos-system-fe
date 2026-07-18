import type { Role } from '@/types/auth.types';

export const ROUTES = {
  login: '/login',
  admin: {
    dashboard: '/admin/dashboard',
    menu: '/admin/menu',
    tables: '/admin/tables',
    users: '/admin/users',
  },
  pos: '/pos',
  kitchen: '/kitchen',
} as const;

/** Where each role lands immediately after login / at `/`. */
export const ROLE_HOME_ROUTE: Record<Role, string> = {
  ADMIN: ROUTES.admin.dashboard,
  RECEPTIONIST: ROUTES.pos,
  KITCHEN: ROUTES.kitchen,
};
