import { cn } from '@utils/cn';

export interface SkeletonProps {
  className?: string;
}

/** A single pulsing placeholder block. Compose it to build skeleton layouts per feature. */
export function Skeleton({ className }: SkeletonProps) {
  return <div className={cn('animate-pulse rounded-md bg-surface-hover', className)} />;
}

/** Pre-composed skeleton for a dashboard/stat card, reused by Dashboard and POS screens. */
export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  );
}

/** Pre-composed skeleton for a menu-item grid card. */
export function GridCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-3">
      <Skeleton className="h-28 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}
