'use client';

import { BaseProps } from '@/types';

interface LoadingStateProps extends BaseProps {
  rows?: number;
  columns?: number;
}

export function LoadingState({ 
  rows = 5, 
  columns = 4,
  className = '' 
}: LoadingStateProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header skeleton */}
      <div className="h-8 w-48 animate-pulse rounded bg-var(--color-bg-secondary)]" />
      
      {/* Cards skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-var(--color-bg-card)] border border-var(--color-border)]" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex gap-4 pb-3 border-b border-var(--color-border)]">
            {[...Array(columns)].map((_, i) => (
              <div 
                key={i} 
                className="h-4 animate-pulse rounded bg-var(--color-bg-secondary)]"
                style={{ flex: 1 }}
              />
            ))}
          </div>
          
          {/* Rows */}
          {[...Array(rows)].map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-4 py-3">
              {[...Array(columns)].map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className="h-4 animate-pulse rounded bg-var(--color-bg-secondary)]"
                  style={{ flex: 1 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CardSkeleton({ className = '' }: BaseProps) {
  return (
    <div className={`h-48 animate-pulse rounded-xl bg-var(--color-bg-card)] border border-var(--color-border)] ${className}`}>
      <div className="p-6 space-y-4">
        <div className="h-4 w-24 rounded bg-var(--color-bg-secondary)]" />
        <div className="h-8 w-32 rounded bg-var(--color-bg-secondary)]" />
        <div className="h-3 w-40 rounded bg-var(--color-bg-secondary)]" />
      </div>
    </div>
  );
}