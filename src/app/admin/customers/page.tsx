export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Button } from '@/components/admin/ui';
import { CustomersTable } from '@/components/admin/ui/CustomersTable';
import { formatCurrency } from '@/types';
import { Plus, Users } from 'lucide-react';

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
      <CustomersTable customers={customers} />
    </div>
  );
}