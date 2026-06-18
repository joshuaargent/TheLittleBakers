import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?:
    | 'default'
    | 'pink'
    | 'yellow'
    | 'turquoise'
    | 'cream'
    | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

// ============================================
// Component
// ============================================

const variantStyles: Record<string, string> = {
  default: 'bg-var(--color-bg-secondary)] text-var(--color-text-muted)] border border-var(--color-border)]',
  pink: 'bg-var(--color-pink-light)] text-var(--color-pink)] border border-var(--color-pink)]/30',
  yellow: 'bg-var(--color-yellow-light)] text-var(--color-yellow)] border border-var(--color-yellow)]/30',
  turquoise: 'bg-var(--color-turquoise-light)] text-var(--color-turquoise)] border border-var(--color-turquoise)]/30',
  cream: 'bg-var(--color-cream)] text-black border border-var(--color-cream-dark)]',
  outline: 'border border-var(--color-border)] text-var(--color-text-muted)] bg-transparent',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-[var(--radius-pill)] font-medium transition-colors',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
