import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '@utils/cn';
import { Input, Badge, GridCardSkeleton, EmptyState } from '@components/ui';
import { useMenuItems, useCategories } from '@features/menu';
import { useTables } from '@features/tables';
import { usePosCartStore } from '@store/posCart.store';

export function MenuGrid() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string>('');

  const { data: categories = [] } = useCategories();
  const { data, isLoading } = useMenuItems({
    page: 1,
    pageSize: 50,
    search,
    categoryId: categoryId || undefined,
    isAvailable: true,
  });
  const addItem = usePosCartStore((state) => state.addItem);
  const selectedTableId = usePosCartStore((state) => state.selectedTableId);
  const { data: tables = [] } = useTables();
  const selectedTable = tables.find((t) => t.id === selectedTableId);
  const canAddItems = Boolean(selectedTable && selectedTable.status === 'AVAILABLE');

  return (
    <div className="flex h-full flex-1 flex-col gap-4 overflow-hidden px-4">
      <Input
        placeholder="Search menu..."
        leftIcon={<Search className="h-4 w-4" />}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="scrollbar-thin flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setCategoryId('')}
          className={cn(
            'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
            categoryId === ''
              ? 'border-primary-600 bg-primary-600 text-white'
              : 'border-border text-foreground/60 hover:bg-surface-hover',
          )}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setCategoryId(category.id)}
            className={cn(
              'shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
              categoryId === category.id
                ? 'border-primary-600 bg-primary-600 text-white'
                : 'border-border text-foreground/60 hover:bg-surface-hover',
            )}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <GridCardSkeleton key={i} />
            ))}
          </div>
        ) : !data || data.items.length === 0 ? (
          <EmptyState title="No items found" description="Try a different search or category" />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {data.items.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={!canAddItems}
                onClick={() => addItem(item)}
                className="group flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 text-left transition-colors hover:border-primary-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <Badge tone={item.foodType === 'VEG' ? 'success' : 'danger'} dot />
                </div>
                <p className="text-xs text-foreground/50">{item.preparationTime} min</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    ₹{Number(item.price).toFixed(0)}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-600 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Plus className="h-4 w-4" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
