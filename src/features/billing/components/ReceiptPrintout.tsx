import { format } from 'date-fns';
import { env } from '@constants/env';
import type { Order } from '@/types/order.types';

interface ReceiptPrintoutProps {
  order: Order;
}

/**
 * Always mounted (off-screen) while BillingModal is open — see the
 * `.printable-receipt` rule in styles/globals.css, which hides everything
 * else on `window.print()` and shows only this subtree. Kept deliberately
 * plain (black text, no Tailwind color tokens) since paper has no dark
 * mode and thermal/inkjet printers render subtle grays inconsistently.
 */
export function ReceiptPrintout({ order }: ReceiptPrintoutProps) {
  const paidAt = order.payment ? new Date(order.payment.createdAt) : new Date();

  return (
    <div className="printable-receipt fixed left-[-9999px] top-0 w-[300px] bg-white p-4 text-black">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-base font-bold">{env.appName}</p>
        <p className="text-xs">Restaurant Bill</p>
      </div>

      <div className="my-3 border-t border-dashed border-black" />

      <div className="flex flex-col gap-0.5 text-xs">
        <div className="flex justify-between">
          <span>Order #</span>
          <span>{order.orderNumber}</span>
        </div>
        <div className="flex justify-between">
          <span>{order.orderType === 'PARCEL' ? 'Order Type' : 'Table'}</span>
          <span>
            {order.orderType === 'PARCEL'
              ? `Parcel${order.customerName ? ` — ${order.customerName}` : ''}`
              : order.table?.number}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Served by</span>
          <span>{order.createdBy.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Date</span>
          <span>{format(paidAt, 'dd MMM yyyy, hh:mm a')}</span>
        </div>
      </div>

      <div className="my-3 border-t border-dashed border-black" />

      <table className="w-full text-xs">
        <thead>
          <tr>
            <th className="pb-1 text-left font-semibold">Item</th>
            <th className="pb-1 text-center font-semibold">Qty</th>
            <th className="pb-1 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td className="py-0.5 text-left">{item.menuItem.name}</td>
              <td className="py-0.5 text-center">{item.quantity}</td>
              <td className="py-0.5 text-right">
                {(Number(item.unitPrice) * item.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-3 border-t border-dashed border-black" />

      <div className="flex flex-col gap-0.5 text-xs">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{Number(order.subtotal).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>₹{Number(order.taxAmount).toFixed(2)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-black pt-1 text-sm font-bold">
          <span>Grand Total</span>
          <span>₹{Number(order.grandTotal).toFixed(2)}</span>
        </div>
      </div>

      {order.payment && (
        <>
          <div className="my-3 border-t border-dashed border-black" />
          <div className="flex justify-between text-xs">
            <span>Paid via</span>
            <span>{order.payment.method}</span>
          </div>
        </>
      )}

      <div className="mt-4 text-center text-xs">Thank you, visit again!</div>
    </div>
  );
}
