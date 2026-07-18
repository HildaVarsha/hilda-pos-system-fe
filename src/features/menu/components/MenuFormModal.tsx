import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input, Select } from '@components/ui';
import { useCategories } from '../hooks/useCategories';
import { useCreateMenuItem, useUpdateMenuItem } from '../hooks/useMenuItems';
import type { MenuItem } from '@/types/menu.types';

const menuItemSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  imageUrl: z.string().trim().url('Must be a valid URL').optional().or(z.literal('')),
  price: z.coerce.number().positive('Price must be greater than 0'),
  preparationTime: z.coerce.number().int().min(1, 'Must be at least 1 minute'),
  foodType: z.enum(['VEG', 'NON_VEG']),
  categoryId: z.string().min(1, 'Category is required'),
  isAvailable: z.boolean(),
});

type MenuItemFormValues = z.infer<typeof menuItemSchema>;

interface MenuFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingItem: MenuItem | null;
}

export function MenuFormModal({ isOpen, onClose, editingItem }: MenuFormModalProps) {
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<MenuItemFormValues>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: '',
      description: '',
      imageUrl: '',
      price: 0,
      preparationTime: 10,
      foodType: 'VEG',
      categoryId: '',
      isAvailable: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset(
        editingItem
          ? {
              name: editingItem.name,
              description: editingItem.description ?? '',
              imageUrl: editingItem.imageUrl ?? '',
              price: Number(editingItem.price),
              preparationTime: editingItem.preparationTime,
              foodType: editingItem.foodType,
              categoryId: editingItem.categoryId,
              isAvailable: editingItem.isAvailable,
            }
          : {
              name: '',
              description: '',
              imageUrl: '',
              price: 0,
              preparationTime: 10,
              foodType: 'VEG',
              categoryId: categories[0]?.id ?? '',
              isAvailable: true,
            },
      );
    }
  }, [isOpen, editingItem, categories, reset]);

  const onSubmit = handleSubmit((values) => {
    const payload = {
      ...values,
      description: values.description || undefined,
      imageUrl: values.imageUrl || undefined,
    };
    const onSuccess = () => onClose();

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, input: payload }, { onSuccess });
    } else {
      createMutation.mutate(payload, { onSuccess });
    }
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
      size="lg"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={() => void onSubmit()} isLoading={isSubmitting}>
            {editingItem ? 'Save Changes' : 'Create Item'}
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => void onSubmit(e)} className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          containerClassName="col-span-2"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Description"
          containerClassName="col-span-2"
          error={errors.description?.message}
          {...register('description')}
        />
        <Input
          label="Image URL"
          containerClassName="col-span-2"
          placeholder="https://..."
          error={errors.imageUrl?.message}
          {...register('imageUrl')}
        />
        <Input
          label="Price (₹)"
          type="number"
          step="0.01"
          error={errors.price?.message}
          {...register('price')}
        />
        <Input
          label="Prep Time (min)"
          type="number"
          error={errors.preparationTime?.message}
          {...register('preparationTime')}
        />
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              label="Category"
              placeholder="Select a category"
              error={errors.categoryId?.message}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="foodType"
          render={({ field }) => (
            <Select
              label="Food Type"
              options={[
                { value: 'VEG', label: 'Veg' },
                { value: 'NON_VEG', label: 'Non-Veg' },
              ]}
              {...field}
            />
          )}
        />
        <label className="col-span-2 flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            {...register('isAvailable')}
          />
          Available for ordering
        </label>
      </form>
    </Modal>
  );
}
