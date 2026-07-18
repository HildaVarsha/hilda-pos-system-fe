import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Users } from 'lucide-react';
import {
  Button,
  Modal,
  Input,
  Badge,
  ConfirmDialog,
  EmptyState,
  GridCardSkeleton,
} from '@components/ui';
import { cn } from '@utils/cn';
import { useTables, useCreateTable, useDeleteTable } from '../hooks/useTables';
import type { RestaurantTable, TableStatus } from '@/types/table.types';

const tableSchema = z.object({
  number: z.coerce.number().int().positive('Must be a positive number'),
  capacity: z.coerce.number().int().positive('Must be a positive number'),
});

type TableFormValues = z.infer<typeof tableSchema>;

const STATUS_TONE: Record<TableStatus, 'success' | 'danger' | 'warning'> = {
  AVAILABLE: 'success',
  OCCUPIED: 'danger',
  RESERVED: 'warning',
};

export function TablesPage() {
  const { data: tables = [], isLoading } = useTables();
  const createMutation = useCreateTable();
  const deleteMutation = useDeleteTable();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingTable, setDeletingTable] = useState<RestaurantTable | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TableFormValues>({ resolver: zodResolver(tableSchema) });

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        setIsFormOpen(false);
        reset();
      },
    });
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Tables</h1>
          <p className="text-sm text-foreground/60">Manage the restaurant's table layout</p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
          Add Table
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {Array.from({ length: 10 }).map((_, i) => (
            <GridCardSkeleton key={i} />
          ))}
        </div>
      ) : tables.length === 0 ? (
        <EmptyState
          title="No tables yet"
          description="Add your first table to start taking orders"
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {tables.map((table) => (
            <div
              key={table.id}
              className={cn(
                'group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center',
              )}
            >
              <button
                type="button"
                onClick={() => setDeletingTable(table)}
                aria-label={`Remove table ${table.number}`}
                className="absolute right-2 top-2 hidden h-7 w-7 items-center justify-center rounded-lg text-foreground/40 hover:bg-red-500/10 hover:text-red-500 group-hover:flex"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <p className="text-2xl font-semibold text-foreground">{table.number}</p>
              <div className="flex items-center gap-1 text-xs text-foreground/50">
                <Users className="h-3 w-3" /> {table.capacity} seats
              </div>
              <Badge tone={STATUS_TONE[table.status]} dot>
                {table.status}
              </Badge>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title="Add Table"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => void onSubmit()} isLoading={createMutation.isPending}>
              Add Table
            </Button>
          </>
        }
      >
        <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-4">
          <Input
            label="Table Number"
            type="number"
            error={errors.number?.message}
            {...register('number')}
          />
          <Input
            label="Capacity (seats)"
            type="number"
            error={errors.capacity?.message}
            {...register('capacity')}
          />
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(deletingTable)}
        onClose={() => setDeletingTable(null)}
        onConfirm={() => {
          if (deletingTable) {
            deleteMutation.mutate(deletingTable.id, { onSuccess: () => setDeletingTable(null) });
          }
        }}
        title={`Remove table ${deletingTable?.number}?`}
        description="This table will no longer be available for seating. This action cannot be undone."
        isConfirming={deleteMutation.isPending}
      />
    </div>
  );
}
