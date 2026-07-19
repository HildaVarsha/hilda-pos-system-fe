import { Receipt, IndianRupee, Printer } from 'lucide-react';
import { Modal, Button, Badge, Skeleton } from '@components/ui';
import { useInvoice, useCompletePayment, useMarkServed } from '../hooks/useBilling';
import { ReceiptPrintout } from './ReceiptPrintout';

interface BillingModalProps {
  orderId: string | null;
  onClose: () => void;
}

export function BillingModal({ orderId, onClose }: BillingModalProps) {
  const { data: order, isLoading } = useInvoice(orderId);
  const markServedMutation = useMarkServed();
  const payMutation = useCompletePayment();

  return (
    <>
      <Modal isOpen={Boolean(orderId)} onClose={onClose} title="Bill" size="md">
        {isLoading || !order ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60">
                  {order.orderType === 'PARCEL'
                    ? `Parcel · ${order.customerName ?? 'Customer'}`
                    : `Table ${order.table?.number}`}
                </p>
                <p className="text-lg font-semibold text-foreground">Order #{order.orderNumber}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={order.status === 'SERVED' ? 'success' : 'info'} dot>
                  {order.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Printer className="h-4 w-4" />}
                  onClick={() => window.print()}
                >
                  Print Bill
                </Button>
              </div>
            </div>

            <div className="rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-surface-hover/50 text-foreground/60">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">Item</th>
                    <th className="px-3 py-2 text-center font-medium">Qty</th>
                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-3 py-2 text-foreground">{item.menuItem.name}</td>
                      <td className="px-3 py-2 text-center text-foreground">{item.quantity}</td>
                      <td className="px-3 py-2 text-right text-foreground">
                        ₹{(Number(item.unitPrice) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-1 rounded-lg bg-surface-hover/50 p-3 text-sm">
              <div className="flex justify-between text-foreground/70">
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-foreground/70">
                <span>Tax</span>
                <span>₹{Number(order.taxAmount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-1 text-base font-semibold text-foreground">
                <span>Grand Total</span>
                <span>₹{Number(order.grandTotal).toFixed(2)}</span>
              </div>
            </div>

            {order.payment ? (
              <div className="flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-600">
                <Receipt className="h-4 w-4" /> Paid via {order.payment.method} — order closed.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {order.status === 'READY' && (
                  <Button
                    variant="outline"
                    onClick={() => markServedMutation.mutate(order.id)}
                    isLoading={markServedMutation.isPending}
                  >
                    Mark as Served
                  </Button>
                )}
                <Button
                  leftIcon={<IndianRupee className="h-4 w-4" />}
                  onClick={() =>
                    payMutation.mutate(
                      { orderId: order.id, method: 'CASH' },
                      { onSuccess: onClose },
                    )
                  }
                  isLoading={payMutation.isPending}
                  disabled={order.status !== 'READY' && order.status !== 'SERVED'}
                >
                  Collect Cash &amp; Close Order
                </Button>
                {order.status !== 'READY' && order.status !== 'SERVED' && (
                  <p className="text-center text-xs text-foreground/50">
                    Billing unlocks once the kitchen marks this order Ready.
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
      {order && <ReceiptPrintout order={order} />}
    </>
  );
}
