import { Utensils, ShoppingBag } from 'lucide-react';
import { cn } from '@utils/cn';
import { usePosCartStore } from '@store/posCart.store';
import type { OrderType } from '@/types/order.types';

const OPTIONS: { value: OrderType; label: string; icon: typeof Utensils }[] = [
  { value: 'DINE_IN', label: 'Dine-in', icon: Utensils },
  { value: 'PARCEL', label: 'Parcel', icon: ShoppingBag },
];

export function OrderTypeToggle() {
  const orderType = usePosCartStore((state) => state.orderType);
  const setOrderType = usePosCartStore((state) => state.setOrderType);
  const hasItemsInCart = usePosCartStore((state) => state.lines.length > 0);

  return (
    <div className="inline-flex rounded-lg border border-border bg-surface p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setOrderType(option.value)}
          title={
            hasItemsInCart && orderType !== option.value
              ? 'Switching mode keeps your cart items, but clears the selected table/customer'
              : undefined
          }
          className={cn(
            'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            orderType === option.value
              ? 'bg-primary-600 text-white'
              : 'text-foreground/60 hover:bg-surface-hover',
          )}
        >
          <option.icon className="h-4 w-4" aria-hidden="true" />
          {option.label}
        </button>
      ))}
    </div>
  );
}
