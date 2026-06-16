export const dynamic = 'force-dynamic';
import { StatCard, Badge } from '@/components/admin/ui';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { formatCurrency, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/types';
import {
  ShoppingCart,
  DollarSign,
  Clock,
  AlertTriangle,
  ArrowRight,
  Package,
  TrendingUp,
} from 'lucide-react';

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const [
    todayOrders,
    yesterdayOrders,
    todayRevenue,
    yesterdayRevenue,
    pendingOrders,
    recentOrders,
    lowStockIngredients,
    lowStockPackaging,
    ordersByCategory,
  ] = await Promise.all([
    // Today's orders count
    prisma.order.count({
      where: {
        createdAt: { gte: today },
      },
    }),
    // Yesterday's orders count
    prisma.order.count({
      where: {
        createdAt: { gte: yesterday, lt: today },
      },
    }),
    // Today's revenue (completed orders)
    prisma.order.aggregate({
      where: {
        createdAt: { gte: today },
        status: { in: ['COMPLETED', 'READY'] },
      },
      _sum: { total: true },
    }),
    // Yesterday's revenue
    prisma.order.aggregate({
      where: {
        createdAt: { gte: yesterday, lt: today },
        status: { in: ['COMPLETED', 'READY'] },
      },
      _sum: { total: true },
    }),
    // Pending orders
    prisma.order.count({
      where: {
        status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      },
    }),
    // Recent orders (last 5)
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    }),
    // Low stock ingredients
    prisma.ingredient.findMany({
      where: {
        currentStock: { lt: prisma.ingredient.fields.reorderPoint },
      },
      orderBy: { currentStock: 'asc' },
    }),
    // Low stock packaging
    prisma.packaging.findMany({
      where: {
        currentStock: { lt: prisma.packaging.fields.minStock },
      },
      orderBy: { currentStock: 'asc' },
    }),
    // Orders by category (last 30 days)
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: true,
    }),
  ]);

  // Get product details for category distribution
  const productIds = ordersByCategory.map((o) => o.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, category: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p.category]));
  const categoryCounts: Record<string, number> = {};
  ordersByCategory.forEach((o) => {
    const category = productMap.get(o.productId) || 'OTHER';
    categoryCounts[category] = (categoryCounts[category] || 0) + (o._sum.quantity || 0);
  });

  return {
    stats: {
      todayOrders,
      todayOrdersTrend: yesterdayOrders > 0 
        ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 
        : 0,
      todayRevenue: todayRevenue._sum.total || 0,
      todayRevenueTrend: yesterdayRevenue._sum.total
        ? (((todayRevenue._sum.total || 0) - (yesterdayRevenue._sum.total || 0)) / (yesterdayRevenue._sum.total || 1)) * 100
        : 0,
      pendingOrders,
      lowStockAlerts: lowStockIngredients.length + lowStockPackaging.length,
    },
    recentOrders,
    lowStockIngredients,
    lowStockPackaging,
    categoryDistribution: categoryCounts,
  };
}

export default async function AdminDashboard() {
  const {
    stats,
    recentOrders,
    lowStockIngredients,
    lowStockPackaging,
  } = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Welcome back! Here&apos;s what&apos;s happening with The Little Bakers today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Orders"
          value={stats.todayOrders}
          icon={ShoppingCart}
          trend={stats.todayOrdersTrend}
          trendLabel="vs yesterday"
          onClick={() => {}}
        />
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats.todayRevenue)}
          icon={DollarSign}
          trend={stats.todayRevenueTrend}
          trendLabel="vs yesterday"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          onClick={() => {}}
        />
        <StatCard
          title="Low Stock Alerts"
          value={stats.lowStockAlerts}
          icon={AlertTriangle}
          onClick={() => {}}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Recent Orders
              </h2>
              <Link
                href="/admin/orders"
                className="flex items-center gap-1 text-sm font-medium text-[var(--color-primary)] hover:underline"
              >
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {recentOrders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <ShoppingCart className="mx-auto h-12 w-12 text-[var(--color-text-muted)]" />
                  <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                    No orders yet. Orders will appear here once placed.
                  </p>
                </div>
              ) : (
                recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/orders/${order.id}`}
                    className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[var(--color-bg-secondary)]"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-[var(--color-text-primary)]">
                          {order.orderNumber}
                        </span>
                        <Badge
                          className={
                            ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS]
                          }
                        >
                          {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {order.customerName} • {order.items.length} item
                        {order.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--color-text-primary)]">
                        {formatCurrency(order.total)}
                      </p>
                      <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                        {new Date(order.createdAt).toLocaleDateString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Low Stock Alerts */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Low Stock Alerts
              </h2>
              <AlertTriangle className="h-5 w-5 text-[var(--color-warning)]" />
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {lowStockIngredients.length === 0 && lowStockPackaging.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <Package className="mx-auto h-10 w-10 text-[var(--color-text-muted)]" />
                  <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                    All stock levels are healthy!
                  </p>
                </div>
              ) : (
                <>
                  {lowStockIngredients.slice(0, 3).map((ingredient) => (
                    <Link
                      key={ingredient.id}
                      href={`/admin/ingredients/${ingredient.id}`}
                      className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-[var(--color-bg-secondary)]"
                    >
                      <span className="text-sm text-[var(--color-text-primary)]">
                        {ingredient.name}
                      </span>
                      <span className="text-sm font-medium text-[var(--color-danger)]">
                        {ingredient.currentStock.toFixed(1)} {ingredient.unit}
                      </span>
                    </Link>
                  ))}
                  {lowStockPackaging.slice(0, 3).map((pkg) => (
                    <Link
                      key={pkg.id}
                      href={`/admin/packaging/${pkg.id}`}
                      className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-[var(--color-bg-secondary)]"
                    >
                      <span className="text-sm text-[var(--color-text-primary)]">
                        {pkg.name}
                      </span>
                      <span className="text-sm font-medium text-[var(--color-danger)]">
                        {pkg.currentStock} left
                      </span>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
            <div className="border-b border-[var(--color-border)] px-6 py-4">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Quick Actions
              </h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/admin/orders/new"
                  className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                >
                  <ShoppingCart className="h-6 w-6 text-[var(--color-primary)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    New Order
                  </span>
                </Link>
                <Link
                  href="/admin/products/new"
                  className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                >
                  <Package className="h-6 w-6 text-[var(--color-primary)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    Add Product
                  </span>
                </Link>
                <Link
                  href="/admin/ingredients"
                  className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                >
                  <TrendingUp className="h-6 w-6 text-[var(--color-primary)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    Stock In
                  </span>
                </Link>
                <Link
                  href="/admin/finance"
                  className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                >
                  <DollarSign className="h-6 w-6 text-[var(--color-primary)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    Record Expense
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}