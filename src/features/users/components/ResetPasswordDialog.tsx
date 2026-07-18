import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Button, Input } from '@components/ui';
import { useResetStaffPassword } from '../hooks/useStaff';
import type { User } from '@/types/auth.types';

const resetSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});

type ResetFormValues = z.infer<typeof resetSchema>;

interface ResetPasswordDialogProps {
  user: User | null;
  onClose: () => void;
}

export function ResetPasswordDialog({ user, onClose }: ResetPasswordDialogProps) {
  const resetMutation = useResetStaffPassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetFormValues>({ resolver: zodResolver(resetSchema) });

  const onSubmit = handleSubmit((values) => {
    if (!user) return;
    resetMutation.mutate(
      { id: user.id, newPassword: values.newPassword },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  });

  return (
    <Modal
      isOpen={Boolean(user)}
      onClose={onClose}
      title={`Reset password for ${user?.name ?? ''}`}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={resetMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={() => void onSubmit()} isLoading={resetMutation.isPending}>
            Reset Password
          </Button>
        </>
      }
    >
      <form onSubmit={(e) => void onSubmit(e)}>
        <Input
          label="New Password"
          type="password"
          helperText="This immediately signs the user out everywhere."
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />
      </form>
    </Modal>
  );
}
