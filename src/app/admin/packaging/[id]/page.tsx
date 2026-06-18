import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Badge, Button } from '@/components/admin/ui';
import {
  PACKAGING_TYPE_LABELS,
  PackagingType,
  formatCurrency,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  OrderStatus,
} from '@/types';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Clock,
  DollarSign,
  Box,
} from 'lucide-react';

async function getPackaging(id: string) {
  const packaging = await prisma.packaging.findUnique({
    where: { id },
    include: {
      category: true,
      supplier: true,
      priceHistory: {
        orderBy: { effectiveDate: 'desc' },
        take: 10,
      },
      orderItems: {
        include: {
          order: {
            include: {
              status: true,
            },
          },
        },
        orderBy: { order: { createdAt: 'desc' } },
        take: 10,
      },
      _count: {
        select: { orderItems: true },
      },
    },
  });

  return packaging;
}

export default async function PackagingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const packaging = await getPackaging(id);

  if (!packaging) {
    notFound();
  }

  const isLowStock = packaging.currentStock < packaging.reorderPoint;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/packaging"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Packaging
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {packaging.name}
            </h1>
            <Badge variant="neutral">
              {packaging.category?.name || 'Packaging'}
            </Badge>
          </div>
          {packaging.dimensions && (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Dimensions: {packaging.dimensions}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<Edit className="h-4 w-4" />}>
            Edit
          </Button>
          <Button variant="danger" icon={<Trash2 className="h-4 w-4" />}>
            Delete
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Current Stock</p>
              <p className={`text-xl font-semibold ${isLowStock ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-primary)]'}`}>
                {packaging.currentStock} units
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Box className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Minimum Stock</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {packaging.reorderPoint} units
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Cost per Unit</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {formatCurrency(packaging.costPerUnit)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Orders Used In</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {packaging._count.orderItems}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Using This Packaging */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Recent Orders Using This Packaging
          </h2>
        </div>
        {packaging.orderItems.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            No orders have used this packaging yet.
          </p>
        ) : (
          <div className="mt-4 divide-y divide-[var(--color-border)]">
            {packaging.orderItems.map((item) => (
              <Link
                key={item.id}
                href={`/admin/orders/${item.order.id}`}
                className="flex items-center justify-between py-3 transition-colors hover:bg-[var(--color-bg-secondary)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--color-text-primary)]">
                    {item.order.orderNumber}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {item.order.customerName}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    className={
                      ORDER_STATUS_COLORS[(item.order.status?.code || 'PENDING') as OrderStatus]
                    }
                  >
                    {ORDER_STATUS_LABELS[(item.order.status?.code || 'PENDING') as OrderStatus]}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Price History */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Price History
        </h2>
        {packaging.priceHistory.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            No price history available.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {packaging.priceHistory.map((ph) => (
              <div
                key={ph.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    {new Date(ph.effectiveDate).toLocaleDateString('en-GB')}
                  </span>
                </div>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {formatCurrency(ph.costPerUnit)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supplier Info */}
      {packaging.supplier && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Supplier Information
          </h2>
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {packaging.supplier.name}
            </p>
            {packaging.supplier.email && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                {packaging.supplier.email}
              </p>
            )}
            {packaging.supplier.phone && (
              <p className="text-sm text-[var(--color-text-secondary)]">
                {packaging.supplier.phone}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}