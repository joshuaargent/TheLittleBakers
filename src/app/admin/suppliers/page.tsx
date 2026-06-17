export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Badge, Button, EnhancedDataTable } from '@/components/admin/ui';
import { Column } from '@/components/admin/ui';
import Link from 'next/link';
import { Plus, Truck, Star, Phone, Mail, Clock } from 'lucide-react';

async function getSuppliers() {
  return prisma.supplier.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { 
          ingredients: true,
          packaging: true,
          purchases: true,
        },
      },
    },
  });
}

export default async function SuppliersPage() {
  const suppliers = await getSuppliers();

  const columns: Column<(typeof suppliers)[0]>[] = [
    {
      key: 'name',
      header: 'Supplier',
      sortable: true,
      render: (supplier) => (
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
      render: (supplier) => (
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
      render: (supplier) => (
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
      render: (supplier) => {
        const rate = supplier.onTimeRate || 100;
        const color = rate >= 95 ? 'success' : rate >= 80 ? 'warning' : 'danger';
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
      render: (supplier) => (
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
      render: (supplier) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {supplier.paymentTerms || 'Standard'}
        </span>
      ),
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (supplier) => (
        <Badge variant={supplier.isActive ? 'success' : 'danger'}>
          {supplier.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'id',
      header: '',
      width: '60px',
      render: (supplier) => (
        <Link
          href={`/admin/suppliers/${supplier.id}`}
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
            Suppliers
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage your suppliers and their performance.
          </p>
        </div>
        <Link href="/admin/suppliers/new">
          <Button icon={<Plus className="h-4 w-4" />}>Add Supplier</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Suppliers</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {suppliers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Active Suppliers</p>
              <p className="text-xl font-semibold text-green-600">
                {suppliers.filter(s => s.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Avg On-Time Rate</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {(suppliers.reduce((sum, s) => sum + (s.onTimeRate || 100), 0) / suppliers.length || 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Phone className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Purchases</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {suppliers.reduce((sum, s) => sum + s._count.purchases, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <EnhancedDataTable
        data={suppliers}
        columns={columns}
        keyField="id"
        pageSize={15}
        searchPlaceholder="Search suppliers..."
        emptyMessage="No suppliers found. Add your first supplier to get started."
      />
    </div>
  );
}