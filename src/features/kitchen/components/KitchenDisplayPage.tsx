import { GridCardSkeleton, EmptyState, ErrorState } from '@components/ui';
import { useActiveKitchenOrders } from '../hooks/useKitchen';
import { KitchenOrderCard } from './KitchenOrderCard';

export function KitchenDisplayPage() {
  const { data: orders, isLoading, isError, refetch } = useActiveKitchenOrders();

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Kitchen Display</h1>
        <p className="text-sm text-foreground/60">
          Orders update in real time as they're sent from the POS
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <GridCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          title="No active orders"
          description="New orders sent from the POS will appear here instantly"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orders.map((order) => (
            <KitchenOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
