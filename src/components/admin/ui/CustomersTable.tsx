'use client';

import { Badge } from '@/components/admin/ui';
import { formatCurrency } from '@/types';
import Link from 'next/link';
import { Mail, Phone } from 'lucide-react';

interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  type: string;
  tier: string;
  loyaltyPoints: number;
  totalSpent: number;
  orderCount: number;
  isActive: boolean;
  _count: {
    orders: number;
  };
}

interface CustomersTableProps {
  customers: Customer[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  const columns = [
    {
      key: 'firstName',
      header: 'Customer',
      sortable: true,
      render: (customer: Customer) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)]">
            <span className="text-sm font-semibold text-[var(--color-primary)]">
              {customer.firstName[0]}{customer.lastName[0]}
            </span>
          </div>
          <div>
            <p className="font-medium text-[var(--color-text-primary)]">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-xs text-[var(--color-text-muted)]">
              {customer.type} • {customer.tier}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Contact',
      render: (customer: Customer) => (
        <div className="space-y-1">
          {customer.email && (
            <p className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Mail className="h-3 w-3" />
              {customer.email}
            </p>
          )}
          {customer.phone && (
            <p className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
              <Phone className="h-3 w-3" />
              {customer.phone}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'loyaltyPoints',
      header: 'Loyalty Points',
      sortable: true,
      render: (customer: Customer) => (
        <Badge variant={customer.loyaltyPoints > 100 ? 'success' : 'neutral'}>
          {customer.loyaltyPoints.toLocaleString()} pts
        </Badge>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      render: (customer: Customer) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          {formatCurrency(customer.totalSpent)}
        </span>
      ),
    },
    {
      key: 'orderCount',
      header: 'Orders',
      sortable: true,
      render: (customer: Customer) => (
        <span className="text-[var(--color-text-secondary)]">
          {customer._count.orders}
        </span>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      render: (customer: Customer) => {
        const tierColors: Record<string, string> = {
          STANDARD: 'bg-gray-100 text-gray-800',
          SILVER: 'bg-gray-200 text-gray-800',
          GOLD: 'bg-amber-100 text-amber-800',
          PLATINUM: 'bg-purple-100 text-purple-800',
          VIP: 'bg-pink-100 text-pink-800',
        };
        return (
          <Badge className={tierColors[customer.tier] || 'bg-gray-100 text-gray-800'}>
            {customer.tier}
          </Badge>
        );
      },
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (customer: Customer) => (
        <Badge variant={customer.isActive ? 'success' : 'danger'}>
          {customer.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: '',
      width: '60px',
      render: (customer: Customer) => (
        <Link
          href={`/admin/customers/${customer.id}`}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          View →
        </Link>
      ),
    },
  ];

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
            {customers.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">
                  No customers found. Add your first customer to get started.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition-colors hover:bg-[var(--color-bg-secondary)]"
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className="px-6 py-4 text-sm text-[var(--color-text-primary)]"
                    >
                      {column.render
                        ? column.render(customer)
                        : String((customer as any)[column.key] ?? '')}
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
