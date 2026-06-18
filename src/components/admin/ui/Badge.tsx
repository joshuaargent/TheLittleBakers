'use client';

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-var(--color-bg-secondary)] text-var(--color-text-muted)] border border-var(--color-border)]',
  success: 'bg-var(--color-turquoise-light)] text-var(--color-turquoise)] border border-var(--color-turquoise)]/30',
  warning: 'bg-var(--color-yellow-light)] text-var(--color-yellow)] border border-var(--color-yellow)]/30',
  danger: 'bg-red-500/10 text-var(--color-danger)] border border-red-500/30',
  info: 'bg-var(--color-turquoise-light)] text-var(--color-turquoise)] border border-var(--color-turquoise)]/30',
  neutral: 'bg-var(--color-bg-secondary)] text-var(--color-text-subtle)] border border-var(--color-border)]',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-[var(--radius-pill)] px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}