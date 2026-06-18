'use client';

import { Badge } from '@/components/admin/ui';
import { Truck, Star, Phone, Mail } from 'lucide-react';
import Link from 'next/link';

interface Supplier {
  id: string;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  onTimeRate: number | null;
  rating: number | null;
  paymentTerms: string | null;
  isActive: boolean;
  _count: {
    ingredients: number;
    packaging: number;
    purchases: number;
  };
}

interface SuppliersTableProps {
  suppliers: Supplier[];
}

export function SuppliersTable({ suppliers }: SuppliersTableProps) {
  const columns = [
    {
      key: 'name',
      header: 'Supplier',
      sortable: true,
      render: (supplier: Supplier) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-light)]">
            <Truck className="h-5 w-5 text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">
              {supplier.name}
            </p>
            {supplier.contactName && (
              <p className="text-xs text-[var(--color-text-muted)]">
                {supplier.contactName}
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (supplier: Supplier) => (
        <div className="space-y-1">
          {supplier.email && (
            <p className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Mail className="h-3 w-3" />
              {supplier.email}
            </p>
          )}
          {supplier.phone && (
            <p className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Phone className="h-3 w-3" />
              {supplier.phone}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'ingredients',
      header: 'Supplies',
      render: (supplier: Supplier) => (
        <div className="flex gap-3">
          <Badge variant="neutral">
            {supplier._count.ingredients} ingredients
          </Badge>
          <Badge variant="neutral">
            {supplier._count.packaging} packaging
          </Badge>
        </div>
      ),
    },
    {
      key: 'onTimeRate',
      header: 'Performance',
      sortable: true,
      render: (supplier: Supplier) => {
        const rate = supplier.onTimeRate || 100;
        return (
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
              rate >= 95 ? 'bg-green-100 text-green-600' : rate >= 80 ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
            }`}>
              <Star className="h-4 w-4" />
            </div>
            <div>
              <p className={`font-medium ${
                rate >= 95 ? 'text-green-600' : rate >= 80 ? 'text-amber-600' : 'text-red-600'
              }`}>
                {rate.toFixed(0)}%
              </p>
              <p className="text-xs text-[var(--color-text-muted)]">on-time</p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (supplier: Supplier) => (
        supplier.rating ? (
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{supplier.rating.toFixed(1)}</span>
          </div>
        ) : (
          <span className="text-[var(--color-text-muted)]">No rating</span>
        )
      ),
    },
    {
      key: 'paymentTerms',
      header: 'Payment',
      render: (supplier: Supplier) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {supplier.paymentTerms || 'Standard'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (supplier: Supplier) => (
        <Badge variant={supplier.isActive ? 'success' : 'danger'}>
          {supplier.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: '',
      width: '60px',
      render: (supplier: Supplier) => (
        <Link
          href={`/admin/suppliers/${supplier.id}`}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          View →
        </Link>
      ),
    },
  ];

  // Simple table implementation for client
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--color-border)]">
            {suppliers.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">
                  No suppliers found. Add your first supplier to get started.
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="transition-colors hover:bg-[var(--color-bg-secondary)]"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 text-sm text-[var(--color-text-primary)]"
                    >
                      {column.render
                        ? column.render(supplier)
                        : String((supplier as any)[column.key] ?? '')}
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
