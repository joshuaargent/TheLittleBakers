export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Badge, Button } from '@/components/admin/ui';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  formatCurrency,
  OrderStatus,
} from '@/types';
import Link from 'next/link';
import { Plus, Search, ShoppingCart } from 'lucide-react';

async function getOrders() {
  return prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      status: true,
      items: {
        include: {
          product: true,
        },
      },
      _count: {
        select: { items: true },
      },
    },
  });
}

export default async function OrdersPage() {
  const orders = await getOrders();

  // Group orders by status
  const ordersByStatus = {
    PENDING: orders.filter((o) => o.status?.code === 'PENDING'),
    CONFIRMED: orders.filter((o) => o.status?.code === 'CONFIRMED'),
    IN_PROGRESS: orders.filter((o) => o.status?.code === 'IN_PROGRESS'),
    READY: orders.filter((o) => o.status?.code === 'READY'),
    COMPLETED: orders.filter((o) => o.status?.code === 'COMPLETED'),
    CANCELLED: orders.filter((o) => o.status?.code === 'CANCELLED'),
  };

  const statusCounts = {
    PENDING: ordersByStatus.PENDING.length,
    CONFIRMED: ordersByStatus.CONFIRMED.length,
    IN_PROGRESS: ordersByStatus.IN_PROGRESS.length,
    READY: ordersByStatus.READY.length,
    COMPLETED: ordersByStatus.COMPLETED.length,
    CANCELLED: ordersByStatus.CANCELLED.length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Orders
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage customer orders and track their progress.
          </p>
        </div>
        <Link href="/admin/orders/new">
          <Button icon={<Plus className="h-4 w-4" />}>New Order</Button>
        </Link>
      </div>

      {/* Status Summary */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'READY', 'COMPLETED', 'CANCELLED'] as const).map(
          (status) => (
            <div
              key={status}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${
                statusCounts[status] > 0
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-light)]'
                  : 'border-[var(--color-border)] bg-[var(--color-bg-card)]'
              }`}
            >
              <Badge className={ORDER_STATUS_COLORS[status]}>{status}</Badge>
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {statusCounts[status]}
              </span>
            </div>
          )
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search by order number, customer..."
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-var(--color-primary)]/20"
          />
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-12 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-[var(--color-text-muted)]" />
          <h3 className="mt-4 text-lg font-medium text-[var(--color-text-primary)]">
            No orders yet
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Orders will appear here once customers start placing them.
          </p>
          <Link href="/admin/orders/new" className="mt-6 inline-block">
            <Button icon={<Plus className="h-4 w-4" />}>Create Your First Order</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-var(--color-border)]">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="transition-colors hover:bg-[var(--color-bg-secondary)]"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[var(--color-text-primary)]">
                      {order.customerName}
                    </p>
                    {order.customerEmail && (
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {order.customerEmail}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {order._count.items} item{order._count.items !== 1 ? 's' : ''}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        ORDER_STATUS_COLORS[(order.status?.code || 'PENDING') as OrderStatus]
                      }
                    >
                      {ORDER_STATUS_LABELS[(order.status?.code || 'PENDING') as OrderStatus]}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {formatCurrency(order.total)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {new Date(order.createdAt).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}