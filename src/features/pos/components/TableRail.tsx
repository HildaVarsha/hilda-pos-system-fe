import { cn } from '@utils/cn';
import { Badge, GridCardSkeleton } from '@components/ui';
import { useTables } from '@features/tables';
import { usePosCartStore } from '@store/posCart.store';
import type { TableStatus } from '@/types/table.types';

const STATUS_TONE: Record<TableStatus, 'success' | 'danger' | 'warning'> = {
  AVAILABLE: 'success',
  OCCUPIED: 'danger',
  RESERVED: 'warning',
};

export function TableRail() {
  const { data: tables = [], isLoading } = useTables();
  const selectedTableId = usePosCartStore((state) => state.selectedTableId);
  const selectTable = usePosCartStore((state) => state.selectTable);

  return (
    <div className="scrollbar-thin flex h-full w-48 shrink-0 flex-col gap-2 overflow-y-auto border-r border-border pr-3">
      <p className="px-1 text-xs font-medium uppercase tracking-wide text-foreground/50">Tables</p>

      {isLoading
        ? Array.from({ length: 6 }).map((_, i) => <GridCardSkeleton key={i} />)
        : tables.map((table) => (
            <button
              key={table.id}
              type="button"
              onClick={() => selectTable(table.id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors',
                selectedTableId === table.id
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10'
                  : 'border-border bg-surface hover:bg-surface-hover',
              )}
            >
              <span className="text-lg font-semibold text-foreground">Table {table.number}</span>
              <span className="text-xs text-foreground/50">{table.capacity} seats</span>
              <Badge tone={STATUS_TONE[table.status]} dot>
                {table.status}
              </Badge>
            </button>
          ))}
    </div>
  );
}
