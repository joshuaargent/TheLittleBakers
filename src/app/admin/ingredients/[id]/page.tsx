import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import {
  MOVEMENT_TYPE_LABELS,
  STOCK_LEVEL_COLORS,
  getStockLevel,
  formatCurrency,
} from '@/types';
import { Badge, Button } from '@/components/admin/ui';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  DollarSign,
  ChefHat,
} from 'lucide-react';

async function getIngredient(id: string) {
  const ingredient = await prisma.ingredient.findUnique({
    where: { id },
    include: {
      category: true,
      supplier: true,
      priceHistory: {
        orderBy: { effectiveDate: 'desc' },
        take: 10,
      },
      stockMovements: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      products: {
        include: {
          product: true,
        },
      },
      _count: {
        select: { products: true },
      },
    },
  });

  return ingredient;
}

export default async function IngredientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const ingredient = await getIngredient(id);

  if (!ingredient) {
    notFound();
  }

  const stockLevel = getStockLevel(ingredient.currentStock, ingredient.reorderPoint);
  const stockValue = ingredient.currentStock * ingredient.costPerUnit;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/ingredients"
            className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Ingredients
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
              {ingredient.name}
            </h1>
          </div>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {ingredient.category?.name || ingredient.categoryId} •{' '}
            Unit: {ingredient.unit}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<TrendingUp className="h-4 w-4" />}>
            Record Stock In
          </Button>
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
              <p className={`text-xl font-semibold ${STOCK_LEVEL_COLORS[stockLevel]}`}>
                {ingredient.currentStock.toFixed(2)} {ingredient.unit}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <TrendingDown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Reorder Point</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {ingredient.reorderPoint.toFixed(2)} {ingredient.unit}
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
                {formatCurrency(Math.round(ingredient.costPerUnit * 100))}
                <span className="text-sm font-normal text-[var(--color-text-muted)]">
                  /{ingredient.unit}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">Stock Value</p>
              <p className="text-xl font-semibold text-[var(--color-text-primary)]">
                {formatCurrency(Math.round(stockValue * 100))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stock Movements */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Stock Movements
          </h2>
          {ingredient.stockMovements.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-text-muted)]">
              No stock movements recorded yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {ingredient.stockMovements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-3"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        movement.quantity >= 0
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {movement.quantity >= 0 ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">
                        {MOVEMENT_TYPE_LABELS[movement.type as keyof typeof MOVEMENT_TYPE_LABELS]}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {movement.reason || 'No reason specified'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-medium ${
                        movement.quantity >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {movement.quantity >= 0 ? '+' : ''}
                      {movement.quantity.toFixed(2)} {ingredient.unit}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Balance: {movement.balance.toFixed(2)} {ingredient.unit}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Products Using This Ingredient */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              Products Using This Ingredient
            </h2>
            <span className="text-sm text-[var(--color-text-muted)]">
              {ingredient._count.products} products
            </span>
          </div>
          {ingredient.products.length === 0 ? (
            <p className="mt-4 text-sm text-[var(--color-text-muted)]">
              No products are using this ingredient yet.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-[var(--color-border)]">
              {ingredient.products.map((pi) => (
                <Link
                  key={pi.id}
                  href={`/admin/products/${pi.product.id}`}
                  className="flex items-center justify-between py-3 transition-colors hover:bg-[var(--color-bg-secondary)]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-light)]">
                      <ChefHat className="h-4 w-4 text-[var(--color-primary)]" />
                    </div>
                    <span className="text-sm text-[var(--color-text-primary)]">
                      {pi.product.name}
                    </span>
                  </div>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {pi.quantity} {ingredient.unit} per unit
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Price History */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Price History
        </h2>
        {ingredient.priceHistory.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            No price history available.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {ingredient.priceHistory.map((ph) => (
              <div
                key={ph.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[var(--color-text-muted)]" />
                  <span className="text-[var(--color-text-secondary)]">
                    {new Date(ph.effectiveDate).toLocaleDateString('en-GB')}
                  </span>
                  {ph.supplier && (
                    <span className="text-[var(--color-text-muted)]">
                      • {ph.supplier}
                    </span>
                  )}
                </div>
                <span className="font-medium text-[var(--color-text-primary)]">
                  {formatCurrency(Math.round(ph.costPerUnit * 100))}/{ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Supplier Info */}
      {ingredient.supplier && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Supplier Information
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-[var(--color-text-muted)]">Supplier</p>
              <p className="text-sm font-medium text-[var(--color-text-primary)]">
                {ingredient.supplier.name}
              </p>
            </div>
            {ingredient.supplier.email && (
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Email</p>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {ingredient.supplier.email}
                </p>
              </div>
            )}
            {ingredient.supplier.phone && (
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Phone</p>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {ingredient.supplier.phone}
                </p>
              </div>
            )}
            {ingredient.supplierSku && (
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Supplier SKU</p>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {ingredient.supplierSku}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}