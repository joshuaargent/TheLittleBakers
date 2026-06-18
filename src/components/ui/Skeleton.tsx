import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

// ============================================
// Component
// ============================================

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'text', width, height, ...props }, ref) => {
    const variantClasses = {
      text: 'h-4 rounded-[var(--radius-sm)]',
      circular: 'rounded-full',
      rectangular: 'rounded-[var(--radius-md)]',
    };

    return (
      <div
        ref={ref}
        className={cn('skeleton', variantClasses[variant], className)}
        style={{ width, height }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

// ============================================
// Skeleton Presets
// ============================================

export const SkeletonText = forwardRef<HTMLDivElement, { lines?: number }>(({ lines = 3 }, ref) => (
  <div ref={ref} className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} className={i === lines - 1 ? 'w-3/4' : 'w-full'} />
    ))}
  </div>
));

SkeletonText.displayName = 'SkeletonText';

export const SkeletonCard = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="space-y-4 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
    <Skeleton className="h-48 w-full" variant="rectangular" />
    <Skeleton className="h-6 w-3/4" />
    <SkeletonText lines={2} />
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';

export const SkeletonProductCard = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="space-y-3">
    <Skeleton className="aspect-square w-full" variant="rectangular" />
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-8 w-24" variant="rectangular" />
  </div>
));

SkeletonProductCard.displayName = 'SkeletonProductCard';

export const SkeletonListItem = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="flex items-center gap-4 p-4">
    <Skeleton className="h-12 w-12" variant="rectangular" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
));

SkeletonListItem.displayName = 'SkeletonListItem';
