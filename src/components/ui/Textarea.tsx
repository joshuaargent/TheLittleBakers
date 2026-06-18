import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

// ============================================
// Component
// ============================================

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-[var(--color-text-muted)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'flex min-h-[120px] w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-base text-[var(--color-text)]',
            'placeholder:text-[var(--color-text-subtle)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--color-pink)] focus:border-[var(--color-pink)]',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'resize-y transition-all duration-200',
            error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-sm text-[var(--color-text-subtle)]">{hint}</p>}
        {error && <p className="text-sm text-[var(--color-danger)]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
