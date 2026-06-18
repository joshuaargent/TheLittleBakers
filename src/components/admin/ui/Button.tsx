'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-var(--color-pink)] text-black hover:bg-var(--color-pink-hover)] shadow-md hover:shadow-lg focus:ring-var(--color-pink)]',
  secondary:
    'bg-var(--color-yellow)] text-black hover:bg-var(--color-yellow-hover)] shadow-md hover:shadow-lg focus:ring-var(--color-yellow)]',
  outline:
    'border-2 border-var(--color-cream)] bg-transparent text-var(--color-cream)] hover:bg-var(--color-cream)] hover:text-black focus:ring-var(--color-cream)]',
  ghost:
    'bg-transparent text-var(--color-text-muted)] hover:bg-var(--color-bg-secondary)] hover:text-var(--color-text)]',
  danger:
    'bg-var(--color-danger)] text-white hover:opacity-90 focus:ring-var(--color-danger)]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-[var(--radius-pill)]',
  md: 'h-10 px-4 text-sm gap-2 rounded-[var(--radius-pill)]',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-[var(--radius-pill)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black',
          'disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : icon ? (
          icon
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';