export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { formatCurrency } from '@/types';
import { Badge, Button } from '@/components/admin/ui';
import Link from 'next/link';
import { Plus, Search, Filter, ChefHat } from 'lucide-react';

async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      _count: {
        select: { orderItems: true },
      },
    },
  });
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Products
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Manage your bakery products and their recipes.
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button icon={<Plus className="h-4 w-4" />}>Add Product</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search products..."
            className="h-10 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          />
        </div>
        <Button variant="outline" icon={<Filter className="h-4 w-4" />}>
          Filters
        </Button>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-12 text-center">
          <ChefHat className="mx-auto h-16 w-16 text-[var(--color-text-muted)]" />
          <h3 className="mt-4 text-lg font-medium text-[var(--color-text-primary)]">
            No products yet
          </h3>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Get started by adding your first product.
          </p>
          <Link href="/admin/products/new" className="mt-6 inline-block">
            <Button icon={<Plus className="h-4 w-4" />}>Add Your First Product</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/admin/products/${product.id}`}
              className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-5 transition-all hover:border-[var(--color-primary)] hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-primary-light)]">
                  <ChefHat className="h-6 w-6 text-[var(--color-primary)]" />
                </div>
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
              
              <h3 className="mt-4 font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)]">
                {product.name}
              </h3>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                {product.category?.name || 'Product'}
              </p>
              
              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
                <div>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {formatCurrency(product.currentPrice)}
                  </p>
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {product._count.orderItems} orders
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}