import { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import {
  Button,
  Input,
  Select,
  Table,
  Badge,
  ConfirmDialog,
  type TableColumn,
} from '@components/ui';
import { useMenuItems, useDeleteMenuItem } from '../hooks/useMenuItems';
import { useCategories } from '../hooks/useCategories';
import { MenuFormModal } from './MenuFormModal';
import type { MenuItem } from '@/types/menu.types';

export function MenuManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);

  const { data: categories = [] } = useCategories();
  const { data, isLoading } = useMenuItems({
    page,
    pageSize: 10,
    search,
    categoryId: categoryId || undefined,
  });
  const deleteMutation = useDeleteMenuItem();

  const columns: TableColumn<MenuItem>[] = [
    {
      key: 'name',
      header: 'Item',
      render: (item) => (
        <div>
          <p className="font-medium text-foreground">{item.name}</p>
          <p className="text-xs text-foreground/50">{item.category.name}</p>
        </div>
      ),
    },
    {
      key: 'foodType',
      header: 'Type',
      render: (item) => (
        <Badge tone={item.foodType === 'VEG' ? 'success' : 'danger'} dot>
          {item.foodType === 'VEG' ? 'Veg' : 'Non-Veg'}
        </Badge>
      ),
    },
    {
      key: 'price',
      header: 'Price',
      align: 'right',
      render: (item) => `₹${Number(item.price).toFixed(2)}`,
    },
    {
      key: 'preparationTime',
      header: 'Prep Time',
      align: 'right',
      render: (item) => `${item.preparationTime} min`,
    },
    {
      key: 'isAvailable',
      header: 'Status',
      render: (item) => (
        <Badge tone={item.isAvailable ? 'success' : 'neutral'} dot>
          {item.isAvailable ? 'Available' : 'Unavailable'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (item) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Edit ${item.name}`}
            onClick={() => {
              setEditingItem(item);
              setIsFormOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${item.name}`}
            onClick={() => setDeletingItem(item)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Menu Management</h1>
          <p className="text-sm text-foreground/60">
            Add, edit, and manage availability of menu items
          </p>
        </div>
        <Button
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
        >
          Add Item
        </Button>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Search menu items..."
          leftIcon={<Search className="h-4 w-4" />}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          containerClassName="max-w-xs"
        />
        <Select
          placeholder="All categories"
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
          options={categories.map((c) => ({ value: c.id, label: c.name }))}
          containerClassName="max-w-xs"
        />
      </div>

      <Table
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyTitle="No menu items"
        emptyDescription="Add your first menu item to get started"
        pagination={data?.meta ? { ...data.meta, onPageChange: setPage } : undefined}
      />

      <MenuFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingItem={editingItem}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        onConfirm={() => {
          if (deletingItem) {
            deleteMutation.mutate(deletingItem.id, { onSuccess: () => setDeletingItem(null) });
          }
        }}
        title={`Delete "${deletingItem?.name}"?`}
        description="This menu item will no longer be orderable. This action cannot be undone."
        isConfirming={deleteMutation.isPending}
      />
    </div>
  );
}
