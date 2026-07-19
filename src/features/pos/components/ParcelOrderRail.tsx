import { Plus, ShoppingBag } from 'lucide-react';
import { cn } from '@utils/cn';
import { Badge, GridCardSkeleton } from '@components/ui';
import { useActiveOrders } from '../hooks/useOrders';
import type { OrderStatus } from '@/types/order.types';

const STATUS_TONE: Record<
  OrderStatus,
  'warning' | 'info' | 'orange' | 'success' | 'neutral' | 'danger'
> = {
  PENDING: 'warning',
  ACCEPTED: 'info',
  COOKING: 'orange',
  READY: 'success',
  SERVED: 'neutral',
  COMPLETED: 'neutral',
  CANCELLED: 'danger',
};

interface ParcelOrderRailProps {
  selectedOrderId: string | null;
  onSelectOrder: (orderId: string | null) => void;
}

export function ParcelOrderRail({ selectedOrderId, onSelectOrder }: ParcelOrderRailProps) {
  const { data: activeOrders, isLoading } = useActiveOrders();
  const parcelOrders = activeOrders?.items.filter((order) => order.orderType === 'PARCEL') ?? [];

  return (
    <div className="scrollbar-thin flex h-full w-48 shrink-0 flex-col gap-2 overflow-y-auto border-r border-border pr-3">
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-foreground/50">
        Parcel Orders
      </p>

      <button
        type="button"
        onClick={() => onSelectOrder(null)}
        className={cn(
          'flex items-center gap-2 rounded-lg border p-3 text-sm font-medium transition-colors',
          selectedOrderId === null
            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
            : 'border-dashed border-border text-foreground/60 hover:bg-surface-hover',
        )}
      >
        <Plus className="h-4 w-4" /> New Parcel Order
      </button>

      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => <GridCardSkeleton key={i} />)
        : parcelOrders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => onSelectOrder(order.id)}
              className={cn(
                'flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors',
                selectedOrderId === order.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                  : 'border-border bg-surface hover:bg-surface-hover',
              )}
            >
              <div className="flex w-full items-center gap-1.5 text-sm font-medium text-foreground">
                <ShoppingBag className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {order.customerName ?? `Order #${order.orderNumber}`}
                </span>
              </div>
              <Badge tone={STATUS_TONE[order.status]} dot>
                {order.status}
              </Badge>
            </button>
          ))}
    </div>
  );
}
