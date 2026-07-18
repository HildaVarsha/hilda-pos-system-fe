import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@utils/cn';
import { Button } from './Button';
import { EmptyState } from './EmptyState';
import type { PaginationMeta } from '@/types/api.types';

export interface TableColumn<TRow> {
  key: string;
  header: string;
  /** Custom cell renderer. Falls back to `String(row[key])` if omitted. */
  render?: (row: TRow) => ReactNode;
  className?: string;
  headerClassName?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<TRow extends { id: string }> {
  columns: TableColumn<TRow>[];
  data: TRow[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: TRow) => void;
  pagination?: PaginationMeta & { onPageChange: (page: number) => void };
  skeletonRowCount?: number;
}

const alignClasses: Record<NonNullable<TableColumn<never>['align']>, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

/**
 * Safely renders a raw cell value when a column has no custom `render`.
 * Objects/arrays are intentionally not stringified (that would silently
 * produce "[object Object]") — columns holding structured data must
 * supply a `render` function instead.
 */
function formatCellFallback(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return '—';
}

/**
 * The single Table implementation for every list screen in the app
 * (Menu Management, User Management, Order history, etc.). Column
 * definitions are declarative so features never hand-roll `<table>`
 * markup, keeping loading/empty/pagination behavior identical everywhere.
 */
export function Table<TRow extends { id: string }>({
  columns,
  data,
  isLoading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There is nothing to display yet.',
  onRowClick,
  pagination,
  skeletonRowCount = 5,
}: TableProps<TRow>) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-surface-hover/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 font-medium text-foreground/70',
                    alignClasses[column.align ?? 'left'],
                    column.headerClassName,
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3">
                      <div className="h-4 w-full max-w-[10rem] animate-pulse rounded bg-surface-hover" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-10">
                  <EmptyState title={emptyTitle} description={emptyDescription} />
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-surface-hover/60',
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-foreground',
                        alignClasses[column.align ?? 'left'],
                        column.className,
                      )}
                    >
                      {column.render
                        ? column.render(row)
                        : formatCellFallback((row as Record<string, unknown>)[column.key])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-foreground/60">
            Page {pagination.page} of {pagination.totalPages} · {pagination.totalItems} total
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
