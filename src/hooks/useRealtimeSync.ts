import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getSocket, disconnectSocket } from '@/services/socket';
import { queryKeys } from '@constants/queryKeys';
import { useAuthStore } from '@store/auth.store';

const ORDER_EVENTS = [
  'order.created',
  'order.accepted',
  'order.cooking',
  'order.ready',
  'order.completed',
  'order.cancelled',
] as const;

/**
 * Mounted once at the app root (see layouts/AppLayout.tsx). Rather than
 * every feature page opening its own socket listeners, this hook is the
 * single place that translates realtime events into cache invalidation —
 * so a receptionist sending an order to the kitchen updates the Kitchen
 * Display, the Dashboard, and the Tables view simultaneously, with zero
 * per-page socket code.
 */
export function useRealtimeSync(): void {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      return;
    }

    const socket = getSocket();
    socket.connect();

    const invalidateOrders = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.kitchen.active });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary });
    };
    const invalidateTables = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.tables.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.summary });
    };
    const invalidateMenu = () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
    };

    ORDER_EVENTS.forEach((event) => socket.on(event, invalidateOrders));
    socket.on('table.updated', invalidateTables);
    socket.on('menu.updated', invalidateMenu);

    return () => {
      ORDER_EVENTS.forEach((event) => socket.off(event, invalidateOrders));
      socket.off('table.updated', invalidateTables);
      socket.off('menu.updated', invalidateMenu);
    };
  }, [accessToken, queryClient]);
}
