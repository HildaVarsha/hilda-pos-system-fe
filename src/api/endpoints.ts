/**
 * Every feature service builds its request URLs from here instead of
 * hardcoding strings. When the REST surface changes, this is the only
 * file that needs to change.
 */
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  menu: {
    base: '/menu',
    byId: (id: string) => `/menu/${id}`,
  },
  categories: {
    base: '/categories',
    byId: (id: string) => `/categories/${id}`,
  },
  tables: {
    base: '/tables',
    byId: (id: string) => `/tables/${id}`,
    status: (id: string) => `/tables/${id}/status`,
  },
  orders: {
    base: '/orders',
    byId: (id: string) => `/orders/${id}`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },
  kitchen: {
    active: '/kitchen/active',
    status: (orderId: string) => `/kitchen/${orderId}/status`,
  },
  billing: {
    invoice: (orderId: string) => `/billing/${orderId}/invoice`,
    served: (orderId: string) => `/billing/${orderId}/served`,
    pay: (orderId: string) => `/billing/${orderId}/pay`,
  },
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
    resetPassword: (id: string) => `/users/${id}/reset-password`,
    deactivate: (id: string) => `/users/${id}/deactivate`,
    reactivate: (id: string) => `/users/${id}/reactivate`,
  },
  dashboard: {
    summary: '/dashboard/summary',
  },
} as const;
