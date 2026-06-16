'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { ReactNode, useState } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyField: keyof T;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  keyField,
  pageSize = 10,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  // Sort data
  let sortedData = [...data];
  if (sortKey && sortDirection) {
    sortedData.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortKey(null);
        setSortDirection(null);
      }
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ArrowUpDown className="h-4 w-4 text-[var(--color-text-muted)]" />;
    if (sortDirection === 'asc') return <ArrowUp className="h-4 w-4 text-[var(--color-primary)]" />;
    return <ArrowDown className="h-4 w-4 text-[var(--color-primary)]" />;
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
        <div className="divide-y divide-[var(--color-border)]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              {columns.map((col) => (
                <div
                  key={col.key}
                  className="h-5 w-24 animate-pulse rounded bg-[var(--color-bg-secondary)]"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]',
                    column.sortable && 'cursor-pointer select-none hover:bg-[var(--color-border)]/50',
                    column.className
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-[var(--color-text-muted)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={String(item[keyField])}
                  className={cn(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-[var(--color-bg-secondary)]'
                  )}
                  onClick={() => onRowClick?.(item)}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        'px-4 py-3 text-sm text-[var(--color-text-primary)]',
                        column.className
                      )}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3">
          <p className="text-sm text-[var(--color-text-muted)]">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedData.length)} of{' '}
            {sortedData.length} results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50"
            >
              <ChevronsLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="px-3 text-sm text-[var(--color-text-secondary)]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="rounded-lg p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] disabled:opacity-50"
            >
              <ChevronsRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}