'use client';

import { BaseProps } from '@/types';

interface FormSectionProps extends BaseProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}

export function FormSection({ 
  title, 
  description, 
  action,
  icon,
  children, 
  className = '' 
}: FormSectionProps) {
  return (
    <div className={`rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-var(--color-primary-light)] text-var(--color-primary)]">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold text-var(--color-text-primary)]">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-sm text-var(--color-text-secondary)]">
                {description}
              </p>
            )}
          </div>
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}