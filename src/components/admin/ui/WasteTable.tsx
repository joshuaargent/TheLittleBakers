'use client';

import { Badge } from '@/components/admin/ui';
import { formatCurrency } from '@/types';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface WasteEntry {
  id: string;
  date: Date;
  category: string;
  quantity: number;
  unit: string | null;
  totalCost: number;
  reason: string;
  recovered: boolean;
  recoveryAmount: number | null;
  wasteType: {
    name: string;
  };
}

interface WasteTableProps {
  entries: WasteEntry[];
}

export function WasteTable({ entries }: WasteTableProps) {
  const categoryConfig: Record<string, { label: string; color: string }> = {
    INGREDIENT: { label: 'Ingredient', color: 'bg-amber-100 text-amber-800' },
    PACKAGING: { label: 'Packaging', color: 'bg-blue-100 text-blue-800' },
    PRODUCT: { label: 'Product', color: 'bg-purple-100 text-purple-800' },
    PRODUCTION: { label: 'Production', color: 'bg-red-100 text-red-800' },
  };

  const columns = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (entry: WasteEntry) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-var(--color-text-muted)]" />
          <span className="text-sm text-var(--color-text-secondary)]">
            {new Date(entry.date).toLocaleDateString('en-GB')}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (entry: WasteEntry) => {
        const config = categoryConfig[entry.category] || categoryConfig.INGREDIENT;
        return (
          <Badge className={config.color}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'wasteType',
      header: 'Type',
      render: (entry: WasteEntry) => (
        <span className="text-sm text-var(--color-text-primary)]">
          {entry.wasteType.name}
        </span>
      ),
    },
    {
      key: 'quantity',
      header: 'Quantity',
      sortable: true,
      render: (entry: WasteEntry) => (
        <span className="font-medium text-var(--color-text-primary)]">
          {entry.quantity} {entry.unit || ''}
        </span>
      ),
    },
    {
      key: 'totalCost',
      header: 'Value Lost',
      sortable: true,
      render: (entry: WasteEntry) => (
        <span className="font-medium text-red-600">
          {formatCurrency(entry.totalCost)}
        </span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (entry: WasteEntry) => (
        <span className="text-sm text-var(--color-text-secondary)]">
          {entry.reason}
        </span>
      ),
    },
    {
      key: 'recovered',
      header: 'Recovered',
      render: (entry: WasteEntry) => (
        entry.recovered ? (
          <span className="text-green-600 font-medium">
            {formatCurrency(entry.recoveryAmount || 0)}
          </span>
        ) : (
          <span className="text-var(--color-text-muted)]">No</span>
        )
      ),
    },
    {
      key: 'id',
      header: '',
      width: '60px',
      render: (entry: WasteEntry) => (
        <Link
          href={`/admin/waste/${entry.id}`}
          className="text-sm font-medium text-var(--color-primary)] hover:underline"
        >
          View →
        </Link>
      ),
    },
  ];

  return (
    <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-var(--color-border)] bg-var(--color-bg-secondary)]">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-var(--color-text-secondary)]"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--color-border)]">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-var(--color-text-muted)]">
                  No waste entries found. Start tracking waste to reduce losses.
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr
                  key={entry.id}
                  className="transition-colors hover:bg-var(--color-bg-secondary)]"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 text-sm text-var(--color-text-primary)]"
                    >
                      {column.render
                        ? column.render(entry)
                        : String((entry as any)[column.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
