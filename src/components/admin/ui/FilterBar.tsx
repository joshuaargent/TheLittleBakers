'use client';

import { BaseProps } from '@/types';
import { Search, Filter, X } from 'lucide-react';
import { Button } from './Button';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps extends BaseProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: {
    label: string;
    options: FilterOption[];
    value?: string;
    onChange?: (value: string) => void;
  }[];
  onClearFilters?: () => void;
}

export function FilterBar({
  searchPlaceholder = 'Search...',
  searchValue,
  onSearchChange,
  filters = [],
  onClearFilters,
  className = ''
}: FilterBarProps) {
  const hasActiveFilters = filters.some(f => f.value);
  
  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Search */}
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-var(--color-primary)]/20"
          />
        </div>
      )}

      {/* Filters */}
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => filter.onChange?.(e.target.value)}
          className="h-10 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 pr-8 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-var(--color-primary)]/20 appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">{filter.label}</option>
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}

      {/* Clear Filters */}
      {hasActiveFilters && onClearFilters && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClearFilters}
          icon={<X className="h-4 w-4" />}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}