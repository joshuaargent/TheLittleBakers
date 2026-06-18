'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { ShoppingBag, ArrowLeft, Leaf, Wheat, Milk } from 'lucide-react';
import { useCartStore } from '@/lib/stores/cart';
import { toast } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  description: string | null;
  currentPrice: number;
  imageUrl: string | null;
  thumbnailUrl: string | null;
  isVegan: boolean;
  isGlutenFree: boolean;
  isNutFree: boolean;
  isDairyFree: boolean;
  category: { code: string; name: string };
  allergens: Array<{ allergen: { code: string; name: string } }>;
}

interface Category {
  id: string;
  code: string;
  name: string;
  _count: { products: number };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products?status=ACTIVE'),
          fetch('/api/categories')
        ]);
        
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        
        setProducts(Array.isArray(productsData) ? productsData : []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      description: product.description || undefined,
      price: product.currentPrice,
      imageUrl: product.imageUrl || product.thumbnailUrl || undefined,
      quantity: 1,
    });
    
    setAddingToCart(product.id);
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddingToCart(null), 1000);
  };

  const formatPrice = (pence: number) => `£${(pence / 100).toFixed(2)}`;

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category.code === selectedCategory);

  const groupedProducts = filteredProducts.reduce((acc, product) => {
    const catName = product.category.name;
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <>
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-pink)]/5 via-transparent to-[var(--color-yellow)]/5" />
        <div className="container relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-[family-name:var(--font-display)] text-[var(--color-beige)] text-4xl md:text-6xl mb-6">
              Our Handmade Bakes
            </h1>
            <p className="text-[var(--color-text-muted)] text-lg md:text-xl leading-relaxed">
              Every item is crafted fresh with love using locally-sourced ingredients. 
              From fluffy breads to indulgent cakes — all made from scratch.
            </p>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-40 bg-[var(--color-bg)]/95 backdrop-blur-sm border-b border-[var(--color-border)] py-4">
        <div className="container">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[var(--color-pink)] text-black shadow-lg shadow-[var(--color-pink)]/25'
                  : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-pink)]/10 hover:text-[var(--color-pink)]'
              }`}
            >
              All Bakes
            </button>
            {categories.map((cat) => (
              <button
                key={cat.code}
                onClick={() => setSelectedCategory(cat.code)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === cat.code
                    ? 'bg-[var(--color-pink)] text-black shadow-lg shadow-[var(--color-pink)]/25'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] hover:bg-[var(--color-pink)]/10 hover:text-[var(--color-pink)]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-1/3" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🥐</div>
              <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
                No bakes available yet
              </h3>
              <p className="text-[var(--color-text-muted)]">
                Check back soon — we're always adding new treats!
              </p>
              <Link href="/" className="inline-block mt-6">
                <Button variant="outline" leftIcon={<ArrowLeft className="h-4 w-4" />}>
                  Back to Home
                </Button>
              </Link>
            </div>
          ) : (
            Object.entries(groupedProducts).map(([categoryName, categoryProducts]) => (
              <div key={categoryName} className="mb-16">
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)]">
                    {categoryName}
                  </h2>
                  <span className="px-3 py-1 bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] text-sm rounded-full">
                    {categoryProducts.length} items
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categoryProducts.map((product) => (
                    <Card 
                      key={product.id} 
                      hover 
                      className="group overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border)]"
                    >
                      <div className="aspect-square relative overflow-hidden bg-[var(--color-bg-secondary)]">
                        {product.imageUrl || product.thumbnailUrl ? (
                          <img
                            src={product.imageUrl || product.thumbnailUrl || ''}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-7xl opacity-30">🧁</span>
                          </div>
                        )}
                        
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          {product.isVegan && (
                            <span className="px-2 py-1 text-xs font-medium bg-green-500/90 text-white rounded-full flex items-center gap-1">
                              <Leaf className="h-3 w-3" /> Vegan
                            </span>
                          )}
                          {product.isGlutenFree && (
                            <span className="px-2 py-1 text-xs font-medium bg-amber-500/90 text-black rounded-full">GF</span>
                          )}
                          {product.isNutFree && (
                            <span className="px-2 py-1 text-xs font-medium bg-blue-500/90 text-white rounded-full">NF</span>
                          )}
                          {product.isDairyFree && (
                            <span className="px-2 py-1 text-xs font-medium bg-purple-500/90 text-white rounded-full flex items-center gap-1">
                              <Milk className="h-3 w-3" /> DF
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2 group-hover:text-[var(--color-pink)] transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-[var(--color-text-muted)] text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                          {product.description || 'Freshly baked with love'}
                        </p>
                        
                        {product.allergens.length > 0 && (
                          <p className="text-xs text-[var(--color-text-muted)] mb-4 flex items-center gap-1">
                            <Wheat className="h-3 w-3" />
                            Contains: {product.allergens.map(a => a.allergen.name).join(', ')}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-[var(--color-yellow)]">
                            {formatPrice(product.currentPrice)}
                          </span>
                          <Button
                            size="sm"
                            variant={addingToCart === product.id ? 'secondary' : 'primary'}
                            onClick={() => handleAddToCart(product)}
                            disabled={addingToCart === product.id}
                            leftIcon={<ShoppingBag className="h-4 w-4" />}
                          >
                            {addingToCart === product.id ? 'Added!' : 'Add'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-[var(--color-pink)]/10 via-[var(--color-yellow)]/10 to-[var(--color-turquoise)]/10">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--color-text)] mb-4">
              Can't decide? Order a Selection Box!
            </h2>
            <p className="text-[var(--color-text-muted)] mb-6">
              Let us surprise you with our best sellers. Perfect for parties, gifts, or just treating yourself.
            </p>
            <Link href="/cart">
              <Button variant="primary" size="lg">View Your Cart</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
