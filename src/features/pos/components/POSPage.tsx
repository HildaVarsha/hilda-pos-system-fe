import { useState } from 'react';
import { TableRail } from './TableRail';
import { ParcelOrderRail } from './ParcelOrderRail';
import { MenuGrid } from './MenuGrid';
import { CartPanel } from './CartPanel';
import { OrderStatusPanel } from './OrderStatusPanel';
import { OrderTypeToggle } from './OrderTypeToggle';
import { useTables } from '@features/tables';
import { useActiveOrders } from '../hooks/useOrders';
import { usePosCartStore } from '@store/posCart.store';

export function POSPage() {
  const orderType = usePosCartStore((state) => state.orderType);
  const selectedTableId = usePosCartStore((state) => state.selectedTableId);
  const [selectedParcelOrderId, setSelectedParcelOrderId] = useState<string | null>(null);

  const { data: tables = [] } = useTables();
  const { data: activeOrders, isLoading: ordersLoading } = useActiveOrders();

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const activeOrderForTable = activeOrders?.items.find(
    (order) => order.tableId === selectedTableId,
  );
  const selectedParcelOrder = activeOrders?.items.find(
    (order) => order.id === selectedParcelOrderId,
  );

  return (
    <div className="flex h-full flex-col gap-4">
      <OrderTypeToggle />

      <div className="flex flex-1 gap-4 overflow-hidden">
        {orderType === 'DINE_IN' ? (
          <TableRail />
        ) : (
          <ParcelOrderRail
            selectedOrderId={selectedParcelOrderId}
            onSelectOrder={setSelectedParcelOrderId}
          />
        )}

        <MenuGrid />

        {orderType === 'DINE_IN' ? (
          selectedTable?.status === 'OCCUPIED' ? (
            <OrderStatusPanel
              label={`Table ${selectedTable.number}`}
              emptyDescription={`Table ${selectedTable.number} has no order in progress`}
              order={activeOrderForTable}
              isLoading={ordersLoading}
            />
          ) : (
            <CartPanel />
          )
        ) : selectedParcelOrderId ? (
          <OrderStatusPanel
            label={selectedParcelOrder?.customerName ?? 'Parcel Order'}
            emptyDescription="This parcel order is no longer active"
            order={selectedParcelOrder}
            isLoading={ordersLoading}
          />
        ) : (
          <CartPanel />
        )}
      </div>
    </div>
  );
}
