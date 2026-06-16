export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Badge, Button } from '@/components/admin/ui';
import {
  INGREDIENT_CATEGORY_LABELS,
  IngredientCategory,
  STOCK_LEVEL_COLORS,
  getStockLevel,
  formatCurrency,
} from '@/types';
import Link from 'next/link';
import { Plus, Search, Carrot, TrendingUp, TrendingDown } from 'lucide-react';

async function getIngredients() {
  return prisma.ingredient.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export default async function IngredientsPage() {
  const ingredients = await getIngredients();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Ingredients
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Track your ingredient inventory and stock levels.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<TrendingUp className="h-4 w-4" />}>
            Record Stock In
          </Button>
          <Link href="/admin/ingredients/new">
            <Button icon={<Plus className="h-4 w-4" />}>Add Ingredient</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search ingredients..."
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>
      </div>

      {/* Ingredients Table */}
      {ingredients.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-12 text-center">
          <Carrot className="mx-auto h-16 w-16 text-[var(--color-text-muted)]" />
          <h3 className="mt-4 text-lg font-medium text-[var(--color-text-primary)]">
            No ingredients yet
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Get started by adding your first ingredient.
          </p>
          <Link href="/admin/ingredients/new" className="mt-6 inline-block">
            <Button icon={<Plus className="h-4 w-4" />}>Add Your First Ingredient</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Ingredient
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Cost per Unit
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Supplier
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Used In
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {ingredients.map((ingredient) => {
                const stockLevel = getStockLevel(
                  ingredient.currentStock,
                  ingredient.reorderPoint
                );
                return (
                  <tr
                    key={ingredient.id}
                    className="transition-colors hover:bg-[var(--color-bg-secondary)]"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/ingredients/${ingredient.id}`}
                        className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)]"
                      >
                        {ingredient.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {INGREDIENT_CATEGORY_LABELS[ingredient.category as IngredientCategory]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`text-sm font-medium ${STOCK_LEVEL_COLORS[stockLevel]}`}
                        >
                          {ingredient.currentStock.toFixed(2)} {ingredient.unit}
                        </span>
                        {stockLevel === 'low' || stockLevel === 'critical' || stockLevel === 'out' ? (
                          <TrendingDown className="h-4 w-4 text-[var(--color-danger)]" />
                        ) : null}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Reorder at: {ingredient.reorderPoint.toFixed(2)} {ingredient.unit}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-[var(--color-text-primary)]">
                        {formatCurrency(Math.round(ingredient.costPerUnit * 100))}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)]">
                        /{ingredient.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {ingredient.supplier || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {ingredient._count.products}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}