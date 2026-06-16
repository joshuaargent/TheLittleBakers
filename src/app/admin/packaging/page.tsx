import { prisma } from '@/lib/prisma';
import { Badge, Button } from '@/components/admin/ui';
import {
  PACKAGING_TYPE_LABELS,
  PackagingType,
  formatCurrency,
} from '@/types';
import Link from 'next/link';
import { Plus, Search, Box, TrendingDown } from 'lucide-react';

async function getPackaging() {
  return prisma.packaging.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { orderItems: true },
      },
    },
  });
}

export default async function PackagingPage() {
  const packaging = await getPackaging();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Packaging
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage your packaging inventory and stock levels.
          </p>
        </div>
        <Link href="/admin/packaging/new">
          <Button icon={<Plus className="h-4 w-4" />}>Add Packaging</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search packaging..."
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>
      </div>

      {/* Packaging Table */}
      {packaging.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-12 text-center">
          <Box className="mx-auto h-16 w-16 text-[var(--color-text-muted)]" />
          <h3 className="mt-4 text-lg font-medium text-[var(--color-text-primary)]">
            No packaging yet
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Get started by adding your first packaging type.
          </p>
          <Link href="/admin/packaging/new" className="mt-6 inline-block">
            <Button icon={<Plus className="h-4 w-4" />}>Add Your First Packaging</Button>
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Packaging
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Stock Level
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Cost per Unit
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
                  Used In
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {packaging.map((pkg) => {
                const isLowStock = pkg.currentStock < pkg.minStock;
                return (
                  <tr
                    key={pkg.id}
                    className="transition-colors hover:bg-[var(--color-bg-secondary)]"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/packaging/${pkg.id}`}
                        className="flex items-center gap-3"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-accent-light)]">
                          <Box className="h-5 w-5 text-[var(--color-accent)]" />
                        </div>
                        <div>
                          <p className="font-medium text-[var(--color-text-primary)] hover:text-[var(--color-primary)]">
                            {pkg.name}
                          </p>
                          {pkg.dimensions && (
                            <p className="text-xs text-[var(--color-text-muted)]">
                              {pkg.dimensions}
                            </p>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="neutral">
                        {PACKAGING_TYPE_LABELS[pkg.type as PackagingType]}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span
                          className={`text-sm font-medium ${
                            isLowStock
                              ? 'text-[var(--color-danger)]'
                              : 'text-[var(--color-text-primary)]'
                          }`}
                        >
                          {pkg.currentStock} in stock
                        </span>
                        {isLowStock && (
                          <TrendingDown className="h-4 w-4 text-[var(--color-danger)]" />
                        )}
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        Min: {pkg.minStock}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-[var(--color-text-primary)]">
                        {formatCurrency(pkg.costPerUnit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {pkg._count.orderItems}
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