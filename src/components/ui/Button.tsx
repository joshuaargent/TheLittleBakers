'use client';

import {
  forwardRef,
  type ButtonHTMLAttributes,
  type ReactNode,
  type ReactElement,
  cloneElement,
  isValidElement,
} from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// ============================================
// Types
// ============================================

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  asChild?: boolean;
}

// ============================================
// Component
// ============================================

const sizeStyles: Record<string, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-base',
  lg: 'h-14 px-8 text-lg',
  icon: 'h-10 w-10',
};

const buttonBaseStyles =
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-pill)] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:pointer-events-none disabled:opacity-50';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      asChild = false,
      ...props
    },
    ref
  ) => {
    // Build variant styles with brand colors
    let variantStyles = '';

    switch (variant) {
      case 'primary':
        // Brand CTA - Pink pill button
        variantStyles = 'bg-var(--color-pink)] text-black hover:bg-var(--color-pink-hover)] shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-var(--color-pink)]';
        break;
      case 'secondary':
        // Yellow accent button
        variantStyles = 'bg-var(--color-yellow)] text-black hover:bg-var(--color-yellow-hover)] shadow-md hover:shadow-lg hover:-translate-y-0.5 focus-visible:ring-var(--color-yellow)]';
        break;
      case 'outline':
        // Cream outline pill
        variantStyles = 'border-2 border-var(--color-cream)] bg-transparent text-var(--color-cream)] hover:bg-var(--color-cream)] hover:text-black focus-visible:ring-var(--color-cream)]';
        break;
      case 'ghost':
        // Ghost with cream text
        variantStyles = 'text-var(--color-cream)] hover:bg-var(--color-bg-secondary)]';
        break;
      case 'link':
        // Turquoise link
        variantStyles = 'text-var(--color-turquoise)] hover:text-var(--color-turquoise-hover)] underline-offset-4 hover:underline';
        break;
      case 'danger':
        // Danger button
        variantStyles = 'bg-var(--color-danger)] text-white hover:opacity-90 focus-visible:ring-var(--color-danger)]';
        break;
      default:
        variantStyles = 'bg-var(--color-pink)] text-black hover:bg-var(--color-pink-hover)]';
    }

    const buttonStyles = cn(buttonBaseStyles, variantStyles, sizeStyles[size], className);

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<{ className?: string; [key: string]: unknown }>;
      const childClassName = child.props.className;
      const mergedClassName = cn(buttonStyles, childClassName);

      return cloneElement(child, {
        className: mergedClassName,
        ref,
        ...props,
      } as any);
    }

    return (
      <button ref={ref} className={buttonStyles} disabled={disabled || isLoading} {...props}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
