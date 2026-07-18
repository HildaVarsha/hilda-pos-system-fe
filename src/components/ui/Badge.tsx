import type { ReactNode } from 'react';
import { cn } from '@utils/cn';

export type BadgeTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger' | 'orange';

export interface BadgeProps {
  tone?: BadgeTone;
  children?: ReactNode;
  className?: string;
  dot?: boolean;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral: 'bg-surface-hover text-foreground/70',
  info: 'bg-blue-500/10 text-blue-500',
  warning: 'bg-amber-500/10 text-amber-500',
  success: 'bg-green-500/10 text-green-500',
  danger: 'bg-red-500/10 text-red-500',
  orange: 'bg-orange-500/10 text-orange-500',
};

const dotClasses: Record<BadgeTone, string> = {
  neutral: 'bg-foreground/40',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  success: 'bg-green-500',
  danger: 'bg-red-500',
  orange: 'bg-orange-500',
};

/**
 * Used for order status (Pending/Cooking/Ready/Completed), table status
 * (Available/Occupied/Reserved), and payment method pills — one visual
 * language for "state" across the whole app.
 */
export function Badge({ tone = 'neutral', children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
    >
      {dot && (
        <span className={cn('h-1.5 w-1.5 rounded-full', dotClasses[tone])} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
