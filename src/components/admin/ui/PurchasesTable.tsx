'use client';

import { Badge } from '@/components/admin/ui';
import { formatCurrency } from '@/types';
import Link from 'next/link';

interface Purchase {
  id: string;
  orderNumber: string | null;
  invoiceNumber: string | null;
  status: string;
  paymentStatus: string;
  total: number;
  orderDate: Date;
  expectedDate: Date | null;
  supplier: {
    name: string;
  };
  _count: {
    ingredients: number;
    packaging: number;
  };
}

interface PurchasesTableProps {
  purchases: Purchase[];
}

export function PurchasesTable({ purchases }: PurchasesTableProps) {
  const statusConfig: Record<string, { label: string; color: string }> = {
    DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800' },
    ORDERED: { label: 'Ordered', color: 'bg-blue-100 text-blue-800' },
    PARTIAL: { label: 'Partial', color: 'bg-amber-100 text-amber-800' },
    RECEIVED: { label: 'Received', color: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  };

  const columns = [
    {
      key: 'orderNumber',
      header: 'Purchase Order',
      sortable: true,
      render: (purchase: Purchase) => (
        <div>
          <p className="font-medium text-var(--color-text-primary)]">
            {purchase.orderNumber || purchase.invoiceNumber || purchase.id.slice(0, 8)}
          </p>
          <p className="text-xs text-var(--color-text-muted)]">
            {purchase.supplier.name}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (purchase: Purchase) => {
        const config = statusConfig[purchase.status] || statusConfig.DRAFT;
        return (
          <Badge className={config.color}>
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'paymentStatus',
      header: 'Payment',
      render: (purchase: Purchase) => {
        const colors: Record<string, string> = {
          PENDING: 'bg-amber-100 text-amber-800',
          PAID: 'bg-green-100 text-green-800',
          OVERDUE: 'bg-red-100 text-red-800',
        };
        return (
          <Badge className={colors[purchase.paymentStatus] || 'bg-gray-100 text-gray-800'}>
            {purchase.paymentStatus}
          </Badge>
        );
      },
    },
    {
      key: 'items',
      header: 'Items',
      render: (purchase: Purchase) => (
        <span className="text-var(--color-text-secondary)]">
          {purchase._count.ingredients + purchase._count.packaging} items
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (purchase: Purchase) => (
        <span className="font-medium text-var(--color-text-primary)]">
          {formatCurrency(purchase.total)}
        </span>
      ),
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      sortable: true,
      render: (purchase: Purchase) => (
        <span className="text-sm text-var(--color-text-secondary)]">
          {new Date(purchase.orderDate).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    {
      key: 'expectedDate',
      header: 'Expected',
      render: (purchase: Purchase) => (
        <span className="text-sm text-var(--color-text-secondary)]">
          {purchase.expectedDate
            ? new Date(purchase.expectedDate).toLocaleDateString('en-GB')
            : '-'}
        </span>
      ),
    },
    {
      key: 'id',
      header: '',
      width: '60px',
      render: (purchase: Purchase) => (
        <Link
          href={`/admin/purchases/${purchase.id}`}
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
            {purchases.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-var(--color-text-muted)]">
                  No purchase orders found. Create your first purchase order to get started.
                </td>
              </tr>
            ) : (
              purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="transition-colors hover:bg-var(--color-bg-secondary)]"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 text-sm text-var(--color-text-primary)]"
                    >
                      {column.render
                        ? column.render(purchase)
                        : String((purchase as any)[column.key] ?? '')}
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
