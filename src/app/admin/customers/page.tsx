export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Badge, Button, EnhancedDataTable } from '@/components/admin/ui';
import { Column } from '@/components/admin/ui';
import { formatCurrency } from '@/types';
import Link from 'next/link';
import { Plus, Search, Users, Mail, Phone, MapPin } from 'lucide-react';

async function getCustomers() {
  return prisma.customer.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });
}

export default async function CustomersPage() {
  const customers = await getCustomers();

  const columns: Column<(typeof customers)[0]>[] = [
    {
      key: 'firstName',
      header: 'Customer',
      sortable: true,
      render: (customer) => (
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
      render: (customer) => (
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
      render: (customer) => (
        <Badge variant={customer.loyaltyPoints > 100 ? 'success' : 'neutral'}>
          {customer.loyaltyPoints.toLocaleString()} pts
        </Badge>
      ),
    },
    {
      key: 'totalSpent',
      header: 'Total Spent',
      sortable: true,
      render: (customer) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          {formatCurrency(customer.totalSpent)}
        </span>
      ),
    },
    {
      key: 'orderCount',
      header: 'Orders',
      sortable: true,
      render: (customer) => (
        <span className="text-[var(--color-text-secondary)]">
          {customer._count.orders}
        </span>
      ),
    },
    {
      key: 'tier',
      header: 'Tier',
      render: (customer) => {
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
      render: (customer) => (
        <Badge variant={customer.isActive ? 'success' : 'danger'}>
          {customer.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: '',
      width: '60px',
      render: (customer) => (
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Customers
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage your customers and their loyalty programs.
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />}>Add Customer</Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Customers</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {customers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <span className="text-lg">⭐</span>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">VIP Customers</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {customers.filter(c => c.tier === 'VIP' || c.tier === 'PLATINUM').length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <span className="text-lg">£</span>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Revenue</p>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <span className="text-lg">🎁</span>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Loyalty Points</p>
              <p className="text-xl font-semibold text-purple-600">
                {customers.reduce((sum, c) => sum + c.loyaltyPoints, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <EnhancedDataTable
        data={customers}
        columns={columns}
        keyField="id"
        pageSize={15}
        searchPlaceholder="Search customers..."
        emptyMessage="No customers found. Add your first customer to get started."
      />
    </div>
  );
}