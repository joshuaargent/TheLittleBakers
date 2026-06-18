'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/admin/ui';
import { formatCurrency, CATEGORY_LABELS, ProductCategory } from '@/types';
import { ArrowLeft, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  currentPrice: number;
}

interface OrderItem {
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerContact: '',
    notes: '',
  });

  const [items, setItems] = useState<OrderItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products?status=ACTIVE');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  const productOptions = products.map((p) => ({
    value: p.id,
    label: `${p.name} - ${formatCurrency(p.currentPrice)}`,
  }));

  const addItem = () => {
    if (!selectedProductId || quantity < 1) return;

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) return;

    // Check if product already exists in order
    const existingIndex = items.findIndex((i) => i.productId === selectedProductId);
    if (existingIndex >= 0) {
      const updatedItems = [...items];
      updatedItems[existingIndex].quantity += quantity;
      updatedItems[existingIndex].totalPrice =
        updatedItems[existingIndex].quantity * updatedItems[existingIndex].unitPrice;
      setItems(updatedItems);
    } else {
      setItems([
        ...items,
        {
          productId: product.id,
          product,
          quantity,
          unitPrice: product.currentPrice,
          totalPrice: product.currentPrice * quantity,
        },
      ]);
    }

    setSelectedProductId('');
    setQuantity(1);
  };

  const removeItem = (productId: string) => {
    setItems(items.filter((i) => i.productId !== productId));
  };

  const updateItemQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    const updatedItems = items.map((i) =>
      i.productId === productId
        ? { ...i, quantity: newQuantity, totalPrice: newQuantity * i.unitPrice }
        : i
    );
    setItems(updatedItems);
  };

  const subtotal = items.reduce((sum, i) => sum + i.totalPrice, 0);
  const packagingCost = items.length * 10; // Simplified: 10p per item
  const total = subtotal + packagingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.customerName,
          customerEmail: formData.customerEmail || null,
          customerContact: formData.customerContact || null,
          notes: formData.notes || null,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            unitPrice: i.unitPrice,
            totalPrice: i.totalPrice,
          })),
          subtotal,
          packagingCost,
          total,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create order');
      }

      const order = await response.json();
      router.push(`/admin/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/orders"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Create New Order
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-[var(--color-danger)]/10 p-4 text-sm text-[var(--color-danger)]">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Customer Information
          </h2>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Customer Name"
                placeholder="e.g., Jane Smith"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="e.g., jane@example.com"
                value={formData.customerEmail}
                onChange={(e) =>
                  setFormData({ ...formData, customerEmail: e.target.value })
                }
              />
            </div>

            <Input
              label="Phone Number"
              placeholder="e.g., 07700 900123"
              value={formData.customerContact}
              onChange={(e) =>
                setFormData({ ...formData, customerContact: e.target.value })
              }
            />

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Order Notes
              </label>
              <textarea
                placeholder="Special requests or notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="flex min-h-[80px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-var(--color-primary)]/20"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Order Items
          </h2>

          {/* Add Item Form */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <Select
                label="Select Product"
                options={productOptions}
                placeholder={
                  loadingProducts ? 'Loading products...' : 'Choose a product'
                }
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                disabled={loadingProducts}
              />
            </div>
            <div className="w-24">
              <Input
                label="Quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                variant="outline"
                icon={<Plus className="h-4 w-4" />}
                onClick={addItem}
                disabled={!selectedProductId || quantity < 1}
              >
                Add
              </Button>
            </div>
          </div>

          {/* Items List */}
          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[var(--color-border)] p-8 text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-[var(--color-text-muted)]" />
              <p className="mt-3 text-sm text-[var(--color-text-muted)]">
                No items added yet. Select a product above to add it to the order.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-4"
                >
                  <div className="flex-1">
                    <p className="font-medium text-[var(--color-text-primary)]">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {formatCurrency(item.unitPrice)} each
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateItemQuantity(item.productId, item.quantity - 1)
                        }
                        className="h-8 w-8 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateItemQuantity(item.productId, item.quantity + 1)
                        }
                        className="h-8 w-8 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                      >
                        +
                      </button>
                    </div>
                    <p className="w-20 text-right font-medium text-[var(--color-text-primary)]">
                      {formatCurrency(item.totalPrice)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Order Summary */}
              <div className="mt-6 rounded-lg bg-[var(--color-bg-secondary)] p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--color-text-secondary)]">Packaging</span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {formatCurrency(packagingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-[var(--color-border)] pt-2 text-base">
                    <span className="font-semibold text-[var(--color-text-primary)]">Total</span>
                    <span className="font-bold text-[var(--color-primary)]">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/orders">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            loading={loading}
            disabled={!formData.customerName || items.length === 0}
          >
            Create Order
          </Button>
        </div>
      </form>
    </div>
  );
}