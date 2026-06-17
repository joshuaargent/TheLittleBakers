import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import {
  formatCurrency,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  OrderStatus,
} from '@/types';
import { Badge, Button } from '@/components/admin/ui';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  Package,
  DollarSign,
  History,
} from 'lucide-react';

async function getProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      allergens: {
        include: {
          allergen: true,
        },
      },
      dietary: {
        include: {
          label: true,
        },
      },
      priceHistory: {
        orderBy: { effectiveDate: 'desc' },
        take: 10,
      },
      ingredients: {
        include: {
          ingredient: true,
        },
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

  return product;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const allergens = product.allergens?.map(a => a.allergen.name) || [];
  const dietaryLabels = product.dietary?.map(d => d.label.name) || [];
  const totalRevenue = product.orderItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  const totalSold = product.orderItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/products"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Products
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {product.name}
            </h1>
            <Badge
              className={
                product.status === 'ACTIVE'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }
            >
              {product.status === 'ACTIVE' ? 'Active' : 'Discontinued'}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {product.category?.name || 'Product'} • Created{' '}
            {new Date(product.createdAt).toLocaleDateString('en-GB')}
          </p>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-primary-light)]">
              <DollarSign className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Price</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {formatCurrency(product.currentPrice)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Total Sold</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {totalSold}
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
              <p className="text-sm text-[var(--color-text-secondary)]">Revenue</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {formatCurrency(totalRevenue)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <History className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Orders</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {product._count.orderItems}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Details */}
        <div className="space-y-6">
          {/* Description & Allergens */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Details
            </h2>
            {product.description && (
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
                {product.description}
              </p>
            )}
            
            {allergens.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
                  Allergens
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {allergens.map((allergen: string) => (
                    <Badge key={allergen} variant="warning">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                Ingredients
              </h2>
              <Button variant="outline" size="sm">
                Add Ingredient
              </Button>
            </div>
            {product.ingredients.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                No ingredients added yet.
              </p>
            ) : (
              <div className="mt-4 divide-y divide-[var(--color-border)]">
                {product.ingredients.map((pi) => (
                  <div
                    key={pi.id}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {pi.ingredient.name}
                    </span>
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      {pi.quantity} {pi.ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Price History */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Price History
            </h2>
            {product.priceHistory.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--color-text-muted)]">
                No price history available.
              </p>
            ) : (
              <div className="mt-4 space-y-3">
                {product.priceHistory.map((ph) => (
                  <div
                    key={ph.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
                      <span className="text-[var(--color-text-secondary)]">
                        {new Date(ph.effectiveDate).toLocaleDateString('en-GB')}
                      </span>
                      {ph.reason && (
                        <span className="text-[var(--color-text-muted)]">
                          • {ph.reason}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {formatCurrency(ph.price)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Recent Orders
            </h2>
            <Link
              href={`/admin/orders?product=${product.id}`}
              className="text-sm font-medium text-[var(--color-primary)] hover:underline"
            >
              View all
            </Link>
          </div>
          {product.orderItems.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-text-muted)]">
              No orders yet for this product.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-[var(--color-border)]">
              {product.orderItems.map((item) => (
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
                    <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}