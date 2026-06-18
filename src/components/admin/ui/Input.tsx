'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helpText, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-var(--color-text-primary)]">
            {label}
            {props.required && <span className="ml-1 text-var(--color-danger)]">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'flex h-10 w-full rounded-lg border bg-var(--color-bg-card)] px-3 py-2 text-sm text-var(--color-text-primary)]',
            'placeholder-var(--color-text-muted)]',
            'transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-var(--color-danger)] focus:border-var(--color-danger)] focus:ring-var(--color-danger)]/20'
              : 'border-var(--color-border)] focus:border-var(--color-primary)] focus:ring-var(--color-primary)]/20',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-var(--color-bg-secondary)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-var(--color-danger)]">{error}</p>}
        {helpText && !error && (
          <p className="text-xs text-var(--color-text-muted)]">{helpText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';