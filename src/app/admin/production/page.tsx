export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Button } from '@/components/admin/ui';
import { ProductionTable } from '@/components/admin/ui/ProductionTable';
import { formatCurrency } from '@/types';
import Link from 'next/link';
import { Plus, Factory, Timer, Check } from 'lucide-react';

async function getProductionBatches() {
  return prisma.productionBatch.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: true,
      _count: {
        select: { ingredients: true },
      },
    },
  });
}

export default async function ProductionPage() {
  const batches = await getProductionBatches();

  const activeBatches = batches.filter(b => ['PLANNED', 'IN_PROGRESS'].includes(b.status));
  const completedToday = batches.filter(b => 
    b.status === 'COMPLETED' && 
    b.completedAt && 
    new Date(b.completedAt) >= new Date(new Date().setHours(0, 0, 0, 0))
  );
  const totalCostToday = completedToday.reduce((sum, b) => sum + b.totalCost, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-var(--color-text-primary)]">
            Production
          </h1>
          <p className="mt-1 text-sm text-var(--color-text-secondary)]">
            Track production batches and output.
          </p>
        </div>
        <Link href="/admin/production/new">
          <Button icon={<Plus className="h-4 w-4" />}>New Batch</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Factory className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Total Batches</p>
              <p className="text-xl font-semibold text-var(--color-text-primary)]">
                {batches.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Timer className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Active Batches</p>
              <p className="text-xl font-semibold text-amber-600">
                {activeBatches.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Completed Today</p>
              <p className="text-xl font-semibold text-green-600">
                {completedToday.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <span className="text-lg">£</span>
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Today's Production Cost</p>
              <p className="text-xl font-semibold text-purple-600">
                {formatCurrency(totalCostToday)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <ProductionTable batches={batches} />
    </div>
  );
}