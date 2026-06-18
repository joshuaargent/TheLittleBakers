'use client';

import { BaseProps } from '@/types';
import { Button } from './Button';

interface EmptyStateProps extends BaseProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-12 text-center ${className}`}>
      {icon && (
        <div className="mx-auto h-16 w-16 text-var(--color-text-muted)]">
          {icon}
        </div>
      )}
      <h3 className="mt-4 text-lg font-medium text-var(--color-text-primary)]">
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm text-var(--color-text-muted)]">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <a href={action.href}>
              <Button onClick={action.onClick}>{action.label}</Button>
            </a>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      )}
    </div>
  );
}