'use client';

import { Badge } from '@/components/admin/ui';
import { formatCurrency } from '@/types';
import Link from 'next/link';

interface ProductionBatch {
  id: string;
  batchNumber: string;
  status: string;
  quantity: number;
  plannedDate: Date | null;
  actualStart: Date | null;
  completedAt: Date | null;
  totalCost: number;
  wasteQty: number;
  product: {
    name: string;
  };
}

interface ProductionTableProps {
  batches: ProductionBatch[];
}

export function ProductionTable({ batches }: ProductionTableProps) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    PLANNED: { label: 'Planned', color: 'bg-blue-100 text-blue-800' },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-100 text-amber-800' },
    COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    QA_FAILED: { label: 'QA Failed', color: 'bg-red-100 text-red-800' },
  };

  const columns = [
    {
      key: 'batchNumber',
      header: 'Batch',
      sortable: true,
      render: (batch: ProductionBatch) => (
        <div>
          <p className="font-medium text-var(--color-text-primary)]">
            {batch.batchNumber}
          </p>
          <p className="text-xs text-var(--color-text-muted)]">
            {batch.product.name}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (batch: ProductionBatch) => {
        const config = statusConfig[batch.status] || statusConfig.PLANNED;
        return (
          <Badge className={config.color}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'quantity',
      header: 'Quantity',
      sortable: true,
      render: (batch: ProductionBatch) => (
        <span className="font-medium text-var(--color-text-primary)]">
          {batch.quantity} units
        </span>
      ),
    },
    {
      key: 'plannedDate',
      header: 'Planned',
      sortable: true,
      render: (batch: ProductionBatch) => (
        <span className="text-sm text-var(--color-text-secondary)]">
          {batch.plannedDate
            ? new Date(batch.plannedDate).toLocaleDateString('en-GB')
            : '-'}
        </span>
      ),
    },
    {
      key: 'actualStart',
      header: 'Started',
      render: (batch: ProductionBatch) => (
        <span className="text-sm text-var(--color-text-secondary)]">
          {batch.actualStart
            ? new Date(batch.actualStart).toLocaleDateString('en-GB')
            : '-'}
        </span>
      ),
    },
    {
      key: 'completedAt',
      header: 'Completed',
      sortable: true,
      render: (batch: ProductionBatch) => (
        <span className="text-sm text-var(--color-text-secondary)]">
          {batch.completedAt
            ? new Date(batch.completedAt).toLocaleDateString('en-GB')
            : '-'}
        </span>
      ),
    },
    {
      key: 'totalCost',
      header: 'Cost',
      sortable: true,
      render: (batch: ProductionBatch) => (
        <span className="font-medium text-var(--color-text-primary)]">
          {formatCurrency(batch.totalCost)}
        </span>
      ),
    },
    {
      key: 'wasteQty',
      header: 'Waste',
      render: (batch: ProductionBatch) => (
        batch.wasteQty > 0 ? (
          <span className="font-medium text-red-600">
            {batch.wasteQty} units
          </span>
        ) : (
          <span className="text-var(--color-text-muted)]">None</span>
        )
      ),
    },
    {
      key: 'id',
      header: '',
      width: '60px',
      render: (batch: ProductionBatch) => (
        <Link
          href={`/admin/production/${batch.id}`}
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
            {batches.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-var(--color-text-muted)]">
                  No production batches found. Create your first batch to get started.
                </td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr
                  key={batch.id}
                  className="transition-colors hover:bg-var(--color-bg-secondary)]"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 text-sm text-var(--color-text-primary)]"
                    >
                      {column.render
                        ? column.render(batch)
                        : String((batch as any)[column.key] ?? '')}
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
