import { Minus, Plus, Trash2, Send } from 'lucide-react';
import { Button, Input, EmptyState } from '@components/ui';
import { useTables } from '@features/tables';
import { usePosCartStore } from '@store/posCart.store';
import { useCreateOrder } from '../hooks/useOrders';
import { env } from '@constants/env';

export function CartPanel() {
  const { data: tables = [] } = useTables();
  const {
    orderType,
    selectedTableId,
    customerName,
    lines,
    orderNotes,
    incrementQuantity,
    decrementQuantity,
    removeItem,
    setCustomerName,
    setOrderNotes,
    clearCart,
  } = usePosCartStore();
  const createOrderMutation = useCreateOrder();

  const isParcel = orderType === 'PARCEL';
  const selectedTable = tables.find((t) => t.id === selectedTableId);

  // A parcel order just needs items + a customer name; a dine-in order
  // needs items + a selected table.
  const hasDestination = isParcel ? customerName.trim().length > 0 : Boolean(selectedTableId);
  const canSend = hasDestination && lines.length > 0;

  const subtotal = lines.reduce(
    (sum, line) => sum + Number(line.menuItem.price) * line.quantity,
    0,
  );
  const taxAmount = subtotal * (env.taxRatePercent / 100);
  const grandTotal = subtotal + taxAmount;

  const handleSendToKitchen = () => {
    if (!canSend) return;
    createOrderMutation.mutate(
      {
        orderType,
        tableId: isParcel ? undefined : (selectedTableId as string),
        customerName: isParcel ? customerName.trim() : undefined,
        notes: orderNotes || undefined,
        items: lines.map((line) => ({
          menuItemId: line.menuItem.id,
          quantity: line.quantity,
          notes: line.notes || undefined,
        })),
      },
      { onSuccess: () => clearCart() },
    );
  };

  return (
    <div className="flex h-full w-80 shrink-0 flex-col border-l border-border pl-4">
      <div className="mb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-foreground/50">
          Current Order
        </p>
        <p className="text-sm font-semibold text-foreground">
          {isParcel
            ? customerName.trim()
              ? `Parcel · ${customerName.trim()}`
              : 'Parcel Order'
            : selectedTable
              ? `Table ${selectedTable.number}`
              : 'No table selected'}
        </p>
      </div>

      {isParcel && (
        <Input
          placeholder="Customer name"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          containerClassName="mb-3"
        />
      )}

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {!isParcel && !selectedTableId ? (
          <EmptyState
            title="Select a table"
            description="Pick an available table from the left to start an order"
          />
        ) : lines.length === 0 ? (
          <EmptyState
            title="Cart is empty"
            description="Tap menu items to add them to this order"
          />
        ) : (
          <div className="flex flex-col gap-3">
            {lines.map((line) => (
              <div
                key={line.menuItem.id}
                className="rounded-lg border border-border bg-surface p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{line.menuItem.name}</p>
                  <button
                    type="button"
                    onClick={() => removeItem(line.menuItem.id)}
                    aria-label={`Remove ${line.menuItem.name}`}
                    className="text-foreground/40 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => decrementQuantity(line.menuItem.id)}
                      aria-label="Decrease quantity"
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground/60 hover:bg-surface-hover"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center text-sm text-foreground">{line.quantity}</span>
                    <button
                      type="button"
                      onClick={() => incrementQuantity(line.menuItem.id)}
                      aria-label="Increase quantity"
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-border text-foreground/60 hover:bg-surface-hover"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    ₹{(Number(line.menuItem.price) * line.quantity).toFixed(0)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {lines.length > 0 && (isParcel || selectedTableId) && (
        <div className="mt-3 flex flex-col gap-3 border-t border-border pt-3">
          <Input
            placeholder="Special instructions (optional)"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
          />

          <div className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between text-foreground/60">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground/60">
              <span>Tax ({env.taxRatePercent}%)</span>
              <span>₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-semibold text-foreground">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          {isParcel && !customerName.trim() && (
            <p className="text-xs text-amber-500">Add a customer name before sending to kitchen.</p>
          )}

          <Button
            leftIcon={<Send className="h-4 w-4" />}
            onClick={handleSendToKitchen}
            isLoading={createOrderMutation.isPending}
            disabled={!canSend}
          >
            Send to Kitchen
          </Button>
        </div>
      )}
    </div>
  );
}
