export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Button } from '@/components/admin/ui';
import { SuppliersTable } from '@/components/admin/ui/SuppliersTable';
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-var(--color-text-primary)]">
            Suppliers
          </h1>
          <p className="mt-1 text-sm text-var(--color-text-secondary)]">
            Manage your suppliers and their performance.
          </p>
        </div>
        <Link href="/admin/suppliers/new">
          <Button icon={<Plus className="h-4 w-4" />}>Add Supplier</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Total Suppliers</p>
              <p className="text-xl font-semibold text-var(--color-text-primary)]">
                {suppliers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Star className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Active Suppliers</p>
              <p className="text-xl font-semibold text-green-600">
                {suppliers.filter(s => s.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Avg On-Time Rate</p>
              <p className="text-xl font-semibold text-var(--color-text-primary)]">
                {(suppliers.reduce((sum, s) => sum + (s.onTimeRate || 100), 0) / suppliers.length || 100).toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Phone className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Total Purchases</p>
              <p className="text-xl font-semibold text-var(--color-text-primary)]">
                {suppliers.reduce((sum, s) => sum + s._count.purchases, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Suppliers Table */}
      <SuppliersTable suppliers={suppliers} />
    </div>
  );
}