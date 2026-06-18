import { Metadata } from 'next';
import Link from 'next/link';
import { products, categories } from '@/data/products';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ShoppingBag, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Products | The Little Bakers',
  description: 'Browse our range of handmade bakes including cakes, pastries, breads, and cookies.',
};

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-[family-name:var(--font-display)] text-[var(--color-beige)] text-4xl md:text-5xl mb-4">
              Our Bakes
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg">
              Handmade with love using the finest ingredients. Browse our range and order for collection.
            </p>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="pb-8">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`#${category.slug}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--radius-pill)] bg-[var(--color-bg-card)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-pink)] transition-colors"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-16 md:pb-24">
        <div className="container">
          {categories.map((category) => {
            const categoryProducts = products.filter(p => p.category === category.id);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={category.id} id={category.slug} className="mb-16 scroll-mt-24">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)]">
                    {category.name}
                  </h2>
                  <span className="text-[var(--color-text-muted)] text-sm">
                    ({categoryProducts.length} items)
                  </span>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <Card key={product.id} hover className="overflow-hidden">
                      {/* Product Image Placeholder */}
                      <div className="aspect-square bg-[var(--color-bg-secondary)] flex items-center justify-center">
                        <span className="text-6xl opacity-50">{category.icon}</span>
                      </div>
                      
                      {/* Product Info */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2">
                          {product.name}
                        </h3>
                        <p className="text-[var(--color-text-muted)] text-sm mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--color-yellow)] font-semibold text-lg">
                            £{product.currentPrice.toFixed(2)}
                          </span>
                          <Button size="sm" variant="primary">
                            <ShoppingBag className="h-4 w-4" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--color-bg-secondary)]">
        <div className="container">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] mb-4">
              Ready to Order?
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              Create an account to save your favourite bakes and track your orders.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Create Account
              </Button>
              <Button variant="outline" size="lg">
                View Cart
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
