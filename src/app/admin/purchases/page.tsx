export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Badge, Button, EnhancedDataTable } from '@/components/admin/ui';
import { Column } from '@/components/admin/ui';
import { formatCurrency } from '@/types';
import Link from 'next/link';
import { Plus, FileText, Truck, Check, Clock, AlertTriangle } from 'lucide-react';

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

  const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: <FileText className="h-4 w-4" /> },
    ORDERED: { label: 'Ordered', color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-4 w-4" /> },
    PARTIAL: { label: 'Partial', color: 'bg-amber-100 text-amber-800', icon: <AlertTriangle className="h-4 w-4" /> },
    RECEIVED: { label: 'Received', color: 'bg-green-100 text-green-800', icon: <Check className="h-4 w-4" /> },
    CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: <FileText className="h-4 w-4" /> },
  };

  const columns: Column<(typeof purchases)[0]>[] = [
    {
      key: 'orderNumber',
      header: 'Purchase Order',
      sortable: true,
      render: (purchase) => (
        <div>
          <p className="font-medium text-[var(--color-text-primary)]">
            {purchase.orderNumber || purchase.invoiceNumber || purchase.id.slice(0, 8)}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {purchase.supplier.name}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (purchase) => {
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
      render: (purchase) => {
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
      render: (purchase) => (
        <span className="text-[var(--color-text-secondary)]">
          {purchase._count.ingredients + purchase._count.packaging} items
        </span>
      ),
    },
    {
      key: 'total',
      header: 'Total',
      sortable: true,
      render: (purchase) => (
        <span className="font-medium text-[var(--color-text-primary)]">
          {formatCurrency(purchase.total)}
        </span>
      ),
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      sortable: true,
      render: (purchase) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {new Date(purchase.orderDate).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    {
      key: 'expectedDate',
      header: 'Expected',
      render: (purchase) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
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
      render: (purchase) => (
        <Link
          href={`/admin/purchases/${purchase.id}`}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          View →
        </Link>
      ),
    },
  ];

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
      <EnhancedDataTable
        data={purchases}
        columns={columns}
        keyField="id"
        pageSize={15}
        searchPlaceholder="Search purchases..."
        emptyMessage="No purchase orders found. Create your first purchase order to get started."
      />
    </div>
  );
}