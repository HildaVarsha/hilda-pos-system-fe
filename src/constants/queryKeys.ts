/**
 * Query keys are hierarchical arrays so TanStack Query can invalidate whole
 * branches at once (e.g. invalidate all of `menu` after any mutation).
 * Add a new entry here whenever a feature is added — never inline a raw
 * `['menu', 'list']` string array inside a component.
 */
export const queryKeys = {
  auth: {
    me: ['auth', 'me'] as const,
  },
  menu: {
    all: ['menu'] as const,
    list: (params?: unknown) => ['menu', 'list', params] as const,
    detail: (id: string) => ['menu', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  tables: {
    all: ['tables'] as const,
    detail: (id: string) => ['tables', 'detail', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    list: (params?: unknown) => ['orders', 'list', params] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  kitchen: {
    active: ['kitchen', 'active'] as const,
  },
  dashboard: {
    summary: ['dashboard', 'summary'] as const,
  },
  users: {
    all: ['users'] as const,
    detail: (id: string) => ['users', 'detail', id] as const,
  },
} as const;
