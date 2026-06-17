'use client';

import { BaseProps } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {
  ShoppingCart,
  DollarSign,
  Clock,
  Users,
  Factory,
  AlertTriangle,
  Trash2,
  Package,
  Boxes,
  FileText,
  LucideIcon,
} from 'lucide-react';

type IconName = 'ShoppingCart' | 'DollarSign' | 'Clock' | 'Users' | 'Factory' | 'AlertTriangle' | 'Trash2' | 'Package' | 'Boxes' | 'FileText' | 'TrendingUp' | 'TrendingDown';

const iconMap: Record<IconName, LucideIcon> = {
  ShoppingCart,
  DollarSign,
  Clock,
  Users,
  Factory,
  AlertTriangle,
  Trash2,
  Package,
  Boxes,
  FileText,
  TrendingUp,
  TrendingDown,
};

interface Stat {
  label: string;
  value: string | number;
  icon?: IconName;
  trend?: number;
  trendLabel?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

interface StatsGridProps extends BaseProps {
  stats: Stat[];
  columns?: 2 | 3 | 4;
}

const colorClasses = {
  primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
  success: 'bg-green-100 text-green-600',
  warning: 'bg-amber-100 text-amber-600',
  danger: 'bg-red-100 text-red-600',
  info: 'bg-blue-100 text-blue-600',
};

export function StatsGrid({
  stats,
  columns = 4,
  className = ''
}: StatsGridProps) {
  return (
    <div className={`grid gap-4 md:grid-cols-2 lg:grid-cols-${columns} ${className}`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon ? iconMap[stat.icon] : null;
        const colorClass = stat.color ? colorClasses[stat.color] : colorClasses.primary;

        return (
          <div
            key={index}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {Icon && (
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    {stat.label}
                  </p>
                  <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                    {stat.value}
                  </p>
                </div>
              </div>
              {stat.trend !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(stat.trend).toFixed(1)}%
                </div>
              )}
            </div>
            {stat.trendLabel && (
              <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                {stat.trendLabel}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
