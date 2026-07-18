import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  Table2,
  Users,
  ChefHat,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { cn } from '@utils/cn';
import { useAuthStore } from '@store/auth.store';
import { useThemeStore } from '@store/theme.store';
import { useLogout } from '@features/auth';
import { useRealtimeSync } from '@/hooks/useRealtimeSync';
import { ROUTES } from '@constants/routes';
import type { Role } from '@/types/auth.types';

interface NavItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS_BY_ROLE: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: 'Dashboard', to: ROUTES.admin.dashboard, icon: LayoutDashboard },
    { label: 'Menu', to: ROUTES.admin.menu, icon: UtensilsCrossed },
    { label: 'Tables', to: ROUTES.admin.tables, icon: Table2 },
    { label: 'Staff', to: ROUTES.admin.users, icon: Users },
  ],
  RECEPTIONIST: [{ label: 'POS', to: ROUTES.pos, icon: UtensilsCrossed }],
  KITCHEN: [{ label: 'Kitchen Display', to: ROUTES.kitchen, icon: ChefHat }],
};

export function AppLayout() {
  useRealtimeSync();

  const user = useAuthStore((state) => state.user);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const logoutMutation = useLogout();

  if (!user) return null;

  const navItems = NAV_ITEMS_BY_ROLE[user.role];

  return (
    <div className="flex h-full">
      <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
            <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
          </div>
          <span className="font-semibold text-foreground">Eezy POS</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-foreground/70 hover:bg-surface-hover hover:text-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
          <div>
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs capitalize text-foreground/50">{user.role.toLowerCase()}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-surface-hover"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => logoutMutation.mutate()}
              aria-label="Log out"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-foreground/60 transition-colors hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="scrollbar-thin flex-1 overflow-y-auto bg-background p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
