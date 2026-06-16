'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  onClick,
  className,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl bg-[var(--color-bg-card)] p-6 shadow-sm transition-all hover:shadow-md',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text-secondary)]">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-[var(--color-text-primary)]">
            {value}
          </p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              <TrendIcon
                className={cn(
                  'h-4 w-4',
                  isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                )}
              />
              <span
                className={cn(
                  'font-medium',
                  isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'
                )}
              >
                {isPositive ? '+' : ''}
                {trend.toFixed(1)}%
              </span>
              {trendLabel && (
                <span className="text-[var(--color-text-muted)]">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
          <Icon className="h-6 w-6 text-[var(--color-primary)]" />
        </div>
      </div>
      {onClick && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-primary)]/0 opacity-0 transition-all group-hover:bg-[var(--color-primary)]/5 group-hover:opacity-100">
          <span className="text-sm font-medium text-[var(--color-primary)]">
            View Details
          </span>
        </div>
      )}
    </div>
  );
}