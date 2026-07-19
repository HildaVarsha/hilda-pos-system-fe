import { useState } from 'react';
import { Receipt } from 'lucide-react';
import { Badge, Button, EmptyState, Skeleton } from '@components/ui';
import { BillingModal } from '@features/billing';
import type { Order } from '@/types/order.types';

const STATUS_STEPS: Order['status'][] = ['PENDING', 'ACCEPTED', 'COOKING', 'READY', 'SERVED'];

interface OrderStatusPanelProps {
  /** e.g. "Table 4" for dine-in, or "Parcel · Rahul" for a takeaway order. */
  label: string;
  emptyDescription: string;
  order: Order | undefined;
  isLoading: boolean;
}

/**
 * Shown in the right-hand panel of the POS screen instead of the cart
 * whenever an order already in progress is selected — used for both an
 * occupied dine-in table and an in-progress parcel order.
 */
export function OrderStatusPanel({
  label,
  emptyDescription,
  order,
  isLoading,
}: OrderStatusPanelProps) {
  const [billingOrderId, setBillingOrderId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-full w-80 shrink-0 flex-col gap-3 border-l border-border pl-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-full w-80 shrink-0 flex-col border-l border-border pl-4">
        <EmptyState title="No active order" description={emptyDescription} />
      </div>
    );
  }

  const currentStepIndex = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-l border-border pl-4">
      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          Order In Progress
        </p>
        <p className="text-sm font-semibold text-foreground">
          {label} · Order #{order.orderNumber}
        </p>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        <div className="mb-4 flex flex-wrap gap-1.5">
          {STATUS_STEPS.map((step, index) => (
            <Badge key={step} tone={index <= currentStepIndex ? 'success' : 'neutral'} dot>
              {step}
            </Badge>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border bg-surface p-2.5 text-sm"
            >
              <span className="text-foreground">
                {item.quantity}× {item.menuItem.name}
              </span>
              <span className="text-foreground/60">
                ₹{(Number(item.unitPrice) * item.quantity).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-3">
        <Button
          leftIcon={<Receipt className="h-4 w-4" />}
          className="w-full"
          onClick={() => setBillingOrderId(order.id)}
          disabled={order.status !== 'READY' && order.status !== 'SERVED'}
        >
          {order.status === 'READY' || order.status === 'SERVED'
            ? 'Bill This Order'
            : 'Awaiting Kitchen'}
        </Button>
      </div>

      <BillingModal orderId={billingOrderId} onClose={() => setBillingOrderId(null)} />
    </div>
  );
}
