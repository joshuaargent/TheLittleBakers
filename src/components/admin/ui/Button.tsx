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
    'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus:ring-[var(--color-primary)]/50',
  secondary:
    'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 focus:ring-[var(--color-accent)]/50',
  outline:
    'border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] focus:ring-[var(--color-primary)]/50',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]',
  danger:
    'bg-[var(--color-danger)] text-white hover:bg-[var(--color-danger)]/90 focus:ring-[var(--color-danger)]/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
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
          'inline-flex items-center justify-center rounded-lg font-medium transition-all',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
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