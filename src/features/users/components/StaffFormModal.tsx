import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input, Select } from '@components/ui';
import { useCreateStaff } from '../hooks/useStaff';

const staffSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.string().trim().toLowerCase().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'RECEPTIONIST', 'KITCHEN']),
});

type StaffFormValues = z.infer<typeof staffSchema>;

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StaffFormModal({ isOpen, onClose }: StaffFormModalProps) {
  const createMutation = useCreateStaff();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StaffFormValues>({
    resolver: zodResolver(staffSchema),
    defaultValues: { name: '', email: '', password: '', role: 'RECEPTIONIST' },
  });

  const onSubmit = handleSubmit((values) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Staff Member"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={createMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={() => void onSubmit()} isLoading={createMutation.isPending}>
            Create Account
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => void onSubmit(e)} className="flex flex-col gap-4">
        <Input label="Full Name" error={errors.name?.message} {...register('name')} />
        <Input label="Email" type="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Temporary Password"
          type="password"
          helperText="At least 8 characters. The staff member can change this later."
          error={errors.password?.message}
          {...register('password')}
        />
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              label="Role"
              options={[
                { value: 'RECEPTIONIST', label: 'Receptionist' },
                { value: 'KITCHEN', label: 'Kitchen' },
                { value: 'ADMIN', label: 'Admin' },
              ]}
              {...field}
            />
          )}
        />
      </form>
    </Modal>
  );
}
