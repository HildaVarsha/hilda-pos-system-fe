import { TableRail } from './TableRail';
import { MenuGrid } from './MenuGrid';
import { CartPanel } from './CartPanel';
import { OrderStatusPanel } from './OrderStatusPanel';
import { useTables } from '@features/tables';
import { useActiveOrders } from '../hooks/useOrders';
import { usePosCartStore } from '@store/posCart.store';

export function POSPage() {
  const { data: tables = [] } = useTables();
  const { data: activeOrders, isLoading: ordersLoading } = useActiveOrders();
  const selectedTableId = usePosCartStore((state) => state.selectedTableId);

  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const activeOrderForTable = activeOrders?.items.find(
    (order) => order.tableId === selectedTableId,
  );

  return (
    <div className="flex h-full gap-4">
      <TableRail />
      <MenuGrid />
      {selectedTable?.status === 'OCCUPIED' ? (
        <OrderStatusPanel
          tableNumber={selectedTable.number}
          order={activeOrderForTable}
          isLoading={ordersLoading}
        />
      ) : (
        <CartPanel />
      )}
    </div>
  );
}
