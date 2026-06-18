import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

// ============================================
// Types
// ============================================

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'pink' | 'yellow' | 'turquoise' | 'cream';
  removable?: boolean;
  onRemove?: () => void;
}

// ============================================
// Component
// ============================================

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className, variant = 'default', removable = false, onRemove, children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-var(--color-bg-secondary)] text-var(--color-text-muted)] border-var(--color-border)]',
      pink: 'bg-var(--color-pink-light)] text-var(--color-pink)] border-var(--color-pink)]/30',
      yellow: 'bg-var(--color-yellow-light)] text-var(--color-yellow)] border-var(--color-yellow)]/30',
      turquoise: 'bg-var(--color-turquoise-light)] text-var(--color-turquoise)] border-var(--color-turquoise)]/30',
      cream: 'bg-var(--color-cream)] text-black border-var(--color-cream-dark)]',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1 rounded-[var(--radius-pill)] border px-2.5 py-0.5 text-xs font-medium transition-colors',
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
        {removable && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-0.5 rounded-full p-0.5 transition-colors hover:bg-black/10"
            aria-label={`Remove ${children}`}
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </span>
    );
  }
);

Tag.displayName = 'Tag';
