export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Button } from '@/components/admin/ui';
import { PurchasesTable } from '@/components/admin/ui/PurchasesTable';
import { formatCurrency } from '@/types';
import Link from 'next/link';
import { Plus, FileText, Truck, Check, Clock } from 'lucide-react';

async function getPurchases() {
  return prisma.purchase.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      supplier: true,
      _count: {
        select: { ingredients: true, packaging: true },
      },
    },
  });
}

export default async function PurchasesPage() {
  const purchases = await getPurchases();

  const pendingPurchases = purchases.filter(p => ['DRAFT', 'ORDERED', 'PARTIAL'].includes(p.status));
  const totalPending = pendingPurchases.reduce((sum, p) => sum + p.total, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Purchase Orders
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage supplier purchase orders and deliveries.
          </p>
        </div>
        <Link href="/admin/purchases/new">
          <Button icon={<Plus className="h-4 w-4" />}>New Purchase Order</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Orders</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {purchases.length}
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
              <p className="text-sm text-[var(--color-text-secondary)]">Pending Orders</p>
              <p className="text-xl font-semibold text-amber-600">
                {pendingPurchases.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Truck className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Pending Value</p>
              <p className="text-xl font-semibold text-purple-600">
                {formatCurrency(totalPending)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Received</p>
              <p className="text-xl font-semibold text-green-600">
                {purchases.filter(p => p.status === 'RECEIVED').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchases Table */}
      <PurchasesTable purchases={purchases} />
    </div>
  );
}