import { useState } from 'react';
import { Plus, KeyRound, Ban, CheckCircle2 } from 'lucide-react';
import { Button, Table, Badge, ConfirmDialog, type TableColumn } from '@components/ui';
import { useStaff, useToggleStaffActive } from '../hooks/useStaff';
import { StaffFormModal } from './StaffFormModal';
import { ResetPasswordDialog } from './ResetPasswordDialog';
import type { User } from '@/types/auth.types';

const ROLE_LABEL: Record<User['role'], string> = {
  ADMIN: 'Admin',
  RECEPTIONIST: 'Receptionist',
  KITCHEN: 'Kitchen',
};

export function UserManagementPage() {
  const { data, isLoading } = useStaff({ page: 1, pageSize: 50 });
  const toggleActiveMutation = useToggleStaffActive();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [resettingUser, setResettingUser] = useState<User | null>(null);
  const [togglingUser, setTogglingUser] = useState<User | null>(null);

  const columns: TableColumn<User>[] = [
    {
      key: 'name',
      header: 'Staff Member',
      render: (user) => (
        <div>
          <p className="font-medium text-foreground">{user.name}</p>
          <p className="text-xs text-foreground/50">{user.email}</p>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user) => <Badge tone="info">{ROLE_LABEL[user.role]}</Badge>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (user) => (
        <Badge tone={user.isActive ? 'success' : 'danger'} dot>
          {user.isActive ? 'Active' : 'Deactivated'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (user) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Reset password for ${user.name}`}
            onClick={() => setResettingUser(user)}
          >
            <KeyRound className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={user.isActive ? `Deactivate ${user.name}` : `Reactivate ${user.name}`}
            onClick={() => setTogglingUser(user)}
          >
            {user.isActive ? (
              <Ban className="h-4 w-4 text-red-500" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            )}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Staff</h1>
          <p className="text-sm text-foreground/60">
            Manage receptionist, kitchen, and admin accounts
          </p>
        </div>
        <Button leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsFormOpen(true)}>
          Add Staff
        </Button>
      </div>

      <Table
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyTitle="No staff members yet"
        emptyDescription="Add your first staff account to get started"
      />

      <StaffFormModal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      <ResetPasswordDialog user={resettingUser} onClose={() => setResettingUser(null)} />

      <ConfirmDialog
        isOpen={Boolean(togglingUser)}
        onClose={() => setTogglingUser(null)}
        onConfirm={() => {
          if (togglingUser) {
            toggleActiveMutation.mutate(
              { id: togglingUser.id, activate: !togglingUser.isActive },
              { onSuccess: () => setTogglingUser(null) },
            );
          }
        }}
        title={
          togglingUser?.isActive
            ? `Deactivate ${togglingUser.name}?`
            : `Reactivate ${togglingUser?.name}?`
        }
        description={
          togglingUser?.isActive
            ? 'They will immediately lose access and be signed out everywhere.'
            : 'They will be able to sign in again.'
        }
        confirmVariant={togglingUser?.isActive ? 'danger' : 'success'}
        confirmLabel={togglingUser?.isActive ? 'Deactivate' : 'Reactivate'}
        isConfirming={toggleActiveMutation.isPending}
      />
    </div>
  );
}
