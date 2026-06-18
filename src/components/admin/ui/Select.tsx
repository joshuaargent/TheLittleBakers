'use client';

import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helpText?: string;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helpText, options, placeholder, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[var(--color-text-primary)]">
            {label}
            {props.required && <span className="ml-1 text-[var(--color-danger)]">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'flex h-10 w-full appearance-none rounded-lg border bg-[var(--color-bg-card)] px-3 py-2 pr-10 text-sm text-[var(--color-text-primary)]',
              'transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-offset-0',
              error
                ? 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-var(--color-danger)]/20'
                : 'border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-var(--color-primary)]/20',
              'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[var(--color-bg-secondary)]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
        </div>
        {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
        {helpText && !error && (
          <p className="text-xs text-[var(--color-text-muted)]">{helpText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';