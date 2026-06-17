'use client';

import { BaseProps } from '@/types';

interface FormFieldProps extends BaseProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  helpText?: string;
}

export function FormField({ 
  label, 
  htmlFor,
  required,
  error,
  helpText,
  children, 
  className = '' 
}: FormFieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label 
        htmlFor={htmlFor}
        className="block text-sm font-medium text-[var(--color-text-primary)]"
      >
        {label}
        {required && <span className="text-[var(--color-danger)] ml-1">*</span>}
      </label>
      {children}
      {helpText && !error && (
        <p className="text-xs text-[var(--color-text-muted)]">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-[var(--color-danger)]">{error}</p>
      )}
    </div>
  );
}