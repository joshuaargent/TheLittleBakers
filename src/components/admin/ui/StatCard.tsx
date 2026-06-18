'use client';

import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  DollarSign,
  Banknote,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LucideIcon,
} from 'lucide-react';

type IconName = 'DollarSign' | 'Banknote' | 'TrendingUp' | 'TrendingDown';

const iconMap: Record<IconName, LucideIcon> = {
  DollarSign,
  Banknote,
  TrendingUp: TrendingUpIcon,
  TrendingDown: TrendingDownIcon,
};

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconName;
  trend?: number;
  trendLabel?: string;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendLabel,
  onClick,
  className,
}: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const Icon = iconMap[icon];
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-[var(--radius-card)] bg-var(--color-bg-card)] p-6 shadow-[var(--shadow-card)] transition-all hover:shadow-lg',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-var(--color-text-muted)]">
            {title}
          </p>
          <p className="mt-2 text-3xl font-semibold text-var(--color-text)]">
            {value}
          </p>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1 text-sm">
              <TrendIcon
                className={cn(
                  'h-4 w-4',
                  isPositive ? 'text-var(--color-turquoise)]' : 'text-var(--color-danger)]'
                )}
              />
              <span
                className={cn(
                  'font-medium',
                  isPositive ? 'text-var(--color-turquoise)]' : 'text-var(--color-danger)]'
                )}
              >
                {isPositive ? '+' : ''}
                {trend.toFixed(1)}%
              </span>
              {trendLabel && (
                <span className="text-var(--color-text-subtle)]">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-var(--color-pink-light)]">
          <Icon className="h-6 w-6 text-var(--color-pink)]" />
        </div>
      </div>
      {onClick && (
        <div className="absolute inset-0 flex items-center justify-center bg-var(--color-pink)]/0 opacity-0 transition-all group-hover:bg-var(--color-pink)]/5 group-hover:opacity-100">
          <span className="text-sm font-medium text-var(--color-pink)]">
            View Details
          </span>
        </div>
      )}
    </div>
  );
}
