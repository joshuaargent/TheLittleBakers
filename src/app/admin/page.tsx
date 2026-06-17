export const dynamic = 'force-dynamic';
import { StatsGrid, Badge, EmptyState } from '@/components/admin/ui';
import prisma from '@/lib/prisma';
import Link from 'next/link';
import { formatCurrency, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, OrderStatus } from '@/types';
import {
  ShoppingCart,
  DollarSign,
  Clock,
  AlertTriangle,
  ArrowRight,
  Package,
  TrendingUp,
  TrendingDown,
  Users,
  Boxes,
  Factory,
  Trash2,
  FileText,
} from 'lucide-react';

async function getDashboardData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Get status IDs for filtering
  const completedStatuses = await prisma.orderStatus.findMany({
    where: { code: { in: ['COMPLETED', 'READY'] } },
    select: { id: true },
  });
  const pendingStatuses = await prisma.orderStatus.findMany({
    where: { code: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] } },
    select: { id: true },
  });
  const completedStatusIds = completedStatuses.map(s => s.id);
  const pendingStatusIds = pendingStatuses.map(s => s.id);

  const [
    // Orders stats
    todayOrders,
    yesterdayOrders,
    todayRevenueOrders,
    yesterdayRevenueOrders,
    pendingOrdersCount,
    recentOrders,
    
    // Customers stats
    totalCustomers,
    newCustomersToday,
    
    // Inventory stats
    lowStockIngredients,
    lowStockPackaging,
    
    // Production stats
    activeProductionBatches,
    completedBatchesToday,
    
    // Waste stats
    wasteToday,
    
    // Finance stats
    thisMonthIncome,
    thisMonthExpenses,
    
    // Purchase orders stats
    pendingPurchases,
    
    // All-time counts
    totalProducts,
    totalIngredients,
    totalPackaging,
    totalOrders,
  ] = await Promise.all([
    // Today's orders count
    prisma.order.count({
      where: { createdAt: { gte: today } },
    }),
    // Yesterday's orders count
    prisma.order.count({
      where: { createdAt: { gte: yesterday, lt: today } },
    }),
    // Today's revenue orders
    prisma.order.findMany({
      where: { createdAt: { gte: today }, statusId: { in: completedStatusIds } },
      select: { total: true },
    }),
    // Yesterday's revenue orders
    prisma.order.findMany({
      where: { createdAt: { gte: yesterday, lt: today }, statusId: { in: completedStatusIds } },
      select: { total: true },
    }),
    // Pending orders count
    prisma.order.count({
      where: { statusId: { in: pendingStatusIds } },
    }),
    // Recent orders (last 5)
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        items: { include: { product: true } },
        status: true,
      },
    }),
    
    // Total customers
    prisma.customer.count(),
    // New customers today
    prisma.customer.count({
      where: { createdAt: { gte: today } },
    }),
    
    // Low stock ingredients
    prisma.ingredient.findMany({
      where: { isActive: true },
      orderBy: { currentStock: 'asc' },
    }),
    // Low stock packaging
    prisma.packaging.findMany({
      orderBy: { currentStock: 'asc' },
    }),
    
    // Active production batches
    prisma.productionBatch.count({
      where: { status: { in: ['PLANNED', 'IN_PROGRESS'] } },
    }),
    // Completed batches today
    prisma.productionBatch.count({
      where: { status: 'COMPLETED', completedAt: { gte: today } },
    }),
    
    // Waste today
    prisma.wasteEntry.aggregate({
      where: { date: { gte: today } },
      _sum: { totalCost: true },
      _count: true,
    }),
    
    // This month income
    prisma.transaction.aggregate({
      where: { type: 'INCOME', date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    // This month expenses
    prisma.transaction.aggregate({
      where: { type: 'EXPENSE', date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    
    // Pending purchases
    prisma.purchase.count({
      where: { status: { in: ['DRAFT', 'ORDERED', 'PARTIAL'] } },
    }),
    
    // All-time counts
    prisma.product.count({ where: { status: 'ACTIVE' } }),
    prisma.ingredient.count({ where: { isActive: true } }),
    prisma.packaging.count(),
    prisma.order.count(),
  ]);

  const todayRevenue = todayRevenueOrders.reduce((sum, o) => sum + o.total, 0);
  const yesterdayRevenue = yesterdayRevenueOrders.reduce((sum, o) => sum + o.total, 0);

  // Filter low stock items
  const lowStockIngredientsFiltered = lowStockIngredients.filter(i => i.currentStock < i.reorderPoint);
  const lowStockPackagingFiltered = lowStockPackaging.filter(p => p.currentStock < p.reorderPoint);

  return {
    stats: {
      todayOrders,
      todayOrdersTrend: yesterdayOrders > 0 ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 : 0,
      todayRevenue,
      todayRevenueTrend: yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0,
      pendingOrders: pendingOrdersCount,
      lowStockAlerts: lowStockIngredientsFiltered.length + lowStockPackagingFiltered.length,
      totalCustomers,
      newCustomersToday,
      activeProductionBatches,
      completedBatchesToday,
      wasteToday: wasteToday._sum.totalCost || 0,
      wasteCountToday: wasteToday._count || 0,
      thisMonthIncome: thisMonthIncome._sum.amount || 0,
      thisMonthExpenses: thisMonthExpenses._sum.amount || 0,
      thisMonthProfit: (thisMonthIncome._sum.amount || 0) - (thisMonthExpenses._sum.amount || 0),
      pendingPurchases,
      totalProducts,
      totalIngredients,
      totalPackaging,
      totalOrders,
    },
    recentOrders,
    lowStockIngredients: lowStockIngredientsFiltered.slice(0, 5),
    lowStockPackaging: lowStockPackagingFiltered.slice(0, 5),
  };
}

export default async function AdminDashboard() {
  const {
    stats,
    recentOrders,
    lowStockIngredients,
    lowStockPackaging,
  } = await getDashboardData();

  const lowStockItems = [...lowStockIngredients, ...lowStockPackaging];
  const totalLowStock = stats.lowStockAlerts;

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

      {/* Main Stats Grid */}
      <StatsGrid stats={[
        {
          label: "Today's Orders",
          value: stats.todayOrders,
          icon: ShoppingCart,
          trend: stats.todayOrdersTrend,
          trendLabel: 'vs yesterday',
          color: 'primary',
        },
        {
          label: "Today's Revenue",
          value: formatCurrency(stats.todayRevenue),
          icon: DollarSign,
          trend: stats.todayRevenueTrend,
          trendLabel: 'vs yesterday',
          color: 'success',
        },
        {
          label: 'Pending Orders',
          value: stats.pendingOrders,
          icon: Clock,
          color: stats.pendingOrders > 0 ? 'warning' : 'info',
        },
        {
          label: 'This Month Profit',
          value: formatCurrency(stats.thisMonthProfit),
          icon: TrendingUp,
          color: stats.thisMonthProfit >= 0 ? 'success' : 'danger',
        },
        {
          label: 'Total Customers',
          value: stats.totalCustomers.toLocaleString(),
          icon: Users,
        },
        {
          label: 'Active Batches',
          value: stats.activeProductionBatches,
          icon: Factory,
          color: stats.activeProductionBatches > 0 ? 'info' : 'primary',
        },
        {
          label: 'Low Stock Alerts',
          value: stats.lowStockAlerts,
          icon: AlertTriangle,
          color: totalLowStock > 0 ? 'danger' : 'success',
        },
        {
          label: "Today's Waste",
          value: formatCurrency(stats.wasteToday),
          icon: Trash2,
          color: stats.wasteToday > 0 ? 'warning' : 'success',
        },
      ]} />

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Package className="h-4 w-4" />
            Products
          </div>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
            {stats.totalProducts}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Boxes className="h-4 w-4" />
            Ingredients
          </div>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
            {stats.totalIngredients}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <FileText className="h-4 w-4" />
            Pending Purchases
          </div>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
            {stats.pendingPurchases}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <TrendingUp className="h-4 w-4 text-green-600" />
            This Month Income
          </div>
          <p className="mt-1 text-xl font-bold text-green-600">
            {formatCurrency(stats.thisMonthIncome)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <TrendingDown className="h-4 w-4 text-red-600" />
            This Month Expenses
          </div>
          <p className="mt-1 text-xl font-bold text-red-600">
            {formatCurrency(stats.thisMonthExpenses)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <Users className="h-4 w-4 text-blue-600" />
            New Customers Today
          </div>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text-primary)]">
            +{stats.newCustomersToday}
          </p>
        </div>
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
                            ORDER_STATUS_COLORS[(order.status?.code || 'PENDING') as OrderStatus]
                          }
                        >
                          {ORDER_STATUS_LABELS[(order.status?.code || 'PENDING') as OrderStatus]}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {order.customerName} • {order.items.length} item{order.items.length !== 1 ? 's' : ''}
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
              <span className="rounded-full bg-[var(--color-danger)]/10 px-2 py-1 text-xs font-medium text-[var(--color-danger)]">
                {totalLowStock}
              </span>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              {lowStockItems.length === 0 ? (
                <div className="px-6 py-8 text-center">
                  <Package className="mx-auto h-10 w-10 text-green-500" />
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
                      <div className="flex items-center gap-2">
                        <Boxes className="h-4 w-4 text-[var(--color-text-muted)]" />
                        <span className="text-sm text-[var(--color-text-primary)]">
                          {ingredient.name}
                        </span>
                      </div>
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
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-[var(--color-text-muted)]" />
                        <span className="text-sm text-[var(--color-text-primary)]">
                          {pkg.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[var(--color-danger)]">
                        {pkg.currentStock} left
                      </span>
                    </Link>
                  ))}
                </>
              )}
            </div>
            {totalLowStock > 5 && (
              <div className="border-t border-[var(--color-border)] px-6 py-3">
                <Link
                  href="/admin/ingredients?filter=low_stock"
                  className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                >
                  View all {totalLowStock} alerts →
                </Link>
              </div>
            )}
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
                  href="/admin/purchases/new"
                  className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                >
                  <FileText className="h-6 w-6 text-[var(--color-primary)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    New Purchase
                  </span>
                </Link>
                <Link
                  href="/admin/production/new"
                  className="flex flex-col items-center gap-2 rounded-lg border border-[var(--color-border)] p-4 transition-colors hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
                >
                  <Factory className="h-6 w-6 text-[var(--color-primary)]" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">
                    New Batch
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