import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@utils/cn';
import { Button, Badge } from '@components/ui';
import { useUpdateKitchenStatus } from '../hooks/useKitchen';
import type { KitchenAction, Order } from '@/types/order.types';

const STATUS_BORDER: Record<Order['status'], string> = {
  PENDING: 'border-l-amber-500',
  ACCEPTED: 'border-l-blue-500',
  COOKING: 'border-l-orange-500',
  READY: 'border-l-green-500',
  SERVED: 'border-l-gray-400',
  COMPLETED: 'border-l-gray-400',
  CANCELLED: 'border-l-red-500',
};

const NEXT_ACTION: Partial<Record<Order['status'], { action: KitchenAction; label: string }>> = {
  PENDING: { action: 'ACCEPT', label: 'Accept Order' },
  ACCEPTED: { action: 'COOKING', label: 'Start Cooking' },
  COOKING: { action: 'READY', label: 'Mark Ready' },
};

function formatElapsed(createdAt: string): string {
  const minutes = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 min ago';
  return `${minutes} min ago`;
}

interface KitchenOrderCardProps {
  order: Order;
}

export function KitchenOrderCard({ order }: KitchenOrderCardProps) {
  const [, forceRerender] = useState(0);
  const updateStatusMutation = useUpdateKitchenStatus();
  const nextAction = NEXT_ACTION[order.status];

  // Re-render every 30s purely to keep the "X min ago" label fresh.
  useEffect(() => {
    const interval = setInterval(() => forceRerender((n) => n + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-xl border border-l-4 border-border bg-surface p-4',
        STATUS_BORDER[order.status],
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground">Table {order.table.number}</p>
          <p className="text-xs text-foreground/50">Order #{order.orderNumber}</p>
        </div>
        <Badge
          tone={
            order.status === 'READY' ? 'success' : order.status === 'COOKING' ? 'orange' : 'warning'
          }
          dot
        >
          {order.status}
        </Badge>
      </div>

      <div className="flex items-center gap-1 text-xs text-foreground/50">
        <Clock className="h-3 w-3" /> {formatElapsed(order.createdAt)}
      </div>

      <ul className="flex flex-col gap-1.5">
        {order.items.map((item) => (
          <li key={item.id} className="text-sm text-foreground">
            <span className="font-medium">{item.quantity}×</span> {item.menuItem.name}
            {item.notes && (
              <span className="block text-xs text-foreground/50">Note: {item.notes}</span>
            )}
          </li>
        ))}
      </ul>

      {order.notes && (
        <p className="rounded-lg bg-surface-hover/60 px-2.5 py-1.5 text-xs text-foreground/70">
          Order note: {order.notes}
        </p>
      )}

      {nextAction && (
        <Button
          className="mt-1"
          isLoading={updateStatusMutation.isPending}
          onClick={() =>
            updateStatusMutation.mutate({ orderId: order.id, action: nextAction.action })
          }
        >
          {nextAction.label}
        </Button>
      )}
    </div>
  );
}
