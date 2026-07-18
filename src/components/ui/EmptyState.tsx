import type { ComponentType, ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@utils/cn';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  action?: ReactNode;
  className?: string;
}

/**
 * Standard "nothing here yet" state used by every list/table/grid in the
 * app (empty menu, no active orders, no occupied tables, no search
 * results) so the visual language stays consistent.
 */
export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-2 py-8 text-center', className)}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-hover">
        <Icon className="h-6 w-6 text-foreground/40" aria-hidden="true" />
      </div>
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="max-w-xs text-sm text-foreground/50">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
