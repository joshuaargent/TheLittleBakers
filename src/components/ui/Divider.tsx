import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  label?: string;
  variant?: 'solid' | 'dashed' | 'dotted';
  color?: 'default' | 'cream' | 'pink';
}

// ============================================
// Component
// ============================================

const variantClassesMap: Record<string, string> = {
  solid: 'border-solid',
  dashed: 'border-dashed',
  dotted: 'border-dotted',
};

const colorClassesMap: Record<string, string> = {
  default: 'border-var(--color-border)]',
  cream: 'border-var(--color-cream)]/30',
  pink: 'border-var(--color-pink)]/30',
};

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = 'horizontal', label, variant = 'solid', color = 'default', ...props }, ref) => {
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          className={cn(
            'h-full w-px border-l',
            variantClassesMap[variant],
            colorClassesMap[color],
            className
          )}
          {...props}
        />
      );
    }

    if (label) {
      return (
        <div ref={ref} className={cn('relative flex items-center', className)} {...props}>
          <div className={cn('flex-grow border-t', variantClassesMap[variant], colorClassesMap[color])} />
          <span className="text-var(--color-text-muted)] mx-4 shrink-0 text-sm">{label}</span>
          <div className={cn('flex-grow border-t', variantClassesMap[variant], colorClassesMap[color])} />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn('my-6 border-t', variantClassesMap[variant], colorClassesMap[color], className)}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';
