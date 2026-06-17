export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Badge, Button, EnhancedDataTable } from '@/components/admin/ui';
import { Column } from '@/components/admin/ui';
import { formatCurrency } from '@/types';
import Link from 'next/link';
import { Plus, Factory, Clock, Check, AlertTriangle, Timer } from 'lucide-react';

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

  const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    PLANNED: { label: 'Planned', color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-4 w-4" /> },
    IN_PROGRESS: { label: 'In Progress', color: 'bg-amber-100 text-amber-800', icon: <Timer className="h-4 w-4" /> },
    COMPLETED: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: <Check className="h-4 w-4" /> },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4" /> },
    QA_FAILED: { label: 'QA Failed', color: 'bg-red-100 text-red-800', icon: <AlertTriangle className="h-4 w-4" /> },
  };

  const columns: Column<(typeof batches)[0]>[] = [
    {
      key: 'batchNumber',
      header: 'Batch',
      sortable: true,
      render: (batch) => (
        <div>
          <p className="font-medium text-[var(--color-text-primary)]">
            {batch.batchNumber}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {batch.product.name}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (batch) => {
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
      render: (batch) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          {batch.quantity} units
        </span>
      ),
    },
    {
      key: 'plannedDate',
      header: 'Planned',
      sortable: true,
      render: (batch) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {batch.plannedDate
            ? new Date(batch.plannedDate).toLocaleDateString('en-GB')
            : '-'}
        </span>
      ),
    },
    {
      key: 'actualStart',
      header: 'Started',
      render: (batch) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
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
      render: (batch) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
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
      render: (batch) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          {formatCurrency(batch.totalCost)}
        </span>
      ),
    },
    {
      key: 'wasteQty',
      header: 'Waste',
      render: (batch) => (
        batch.wasteQty > 0 ? (
          <span className="font-medium text-red-600">
            {batch.wasteQty} units
          </span>
        ) : (
          <span className="text-[var(--color-text-muted)]">None</span>
        )
      ),
    },
    {
      key: 'id',
      header: '',
      width: '60px',
      render: (batch) => (
        <Link
          href={`/admin/production/${batch.id}`}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          View →
        </Link>
      ),
    },
  ];

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
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Production
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Track production batches and output.
          </p>
        </div>
        <Link href="/admin/production/new">
          <Button icon={<Plus className="h-4 w-4" />}>New Batch</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Factory className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Batches</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {batches.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Timer className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Active Batches</p>
              <p className="text-xl font-semibold text-amber-600">
                {activeBatches.length}
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
              <p className="text-sm text-[var(--color-text-secondary)]">Completed Today</p>
              <p className="text-xl font-semibold text-green-600">
                {completedToday.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <span className="text-lg">£</span>
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Today's Production Cost</p>
              <p className="text-xl font-semibold text-purple-600">
                {formatCurrency(totalCostToday)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Batches Table */}
      <EnhancedDataTable
        data={batches}
        columns={columns}
        keyField="id"
        pageSize={15}
        searchPlaceholder="Search batches..."
        emptyMessage="No production batches found. Create your first batch to get started."
      />
    </div>
  );
}