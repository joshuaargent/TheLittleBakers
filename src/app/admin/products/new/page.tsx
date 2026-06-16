'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/admin/ui';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  ALLERGENS,
  CATEGORY_LABELS,
  ProductCategory,
  parseCurrencyToCents,
} from '@/types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface IngredientSelection {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '' as ProductCategory | '',
    status: 'ACTIVE',
    price: '',
    allergens: [] as string[],
  });
  const [ingredients, setIngredients] = useState<IngredientSelection[]>([]);
  const [error, setError] = useState('');

  const categoryOptions = PRODUCT_CATEGORIES.map((cat) => ({
    value: cat,
    label: CATEGORY_LABELS[cat],
  }));

  const statusOptions = PRODUCT_STATUSES.map((status) => ({
    value: status,
    label: status === 'ACTIVE' ? 'Active' : 'Discontinued',
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          category: formData.category,
          status: formData.status,
          price: parseCurrencyToCents(formData.price),
          allergens: formData.allergens,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create product');
      }

      const product = await response.json();
      router.push(`/admin/products/${product.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const toggleAllergen = (allergen: string) => {
    setFormData((prev) => ({
      ...prev,
      allergens: prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen],
    }));
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Add New Product
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
            Basic Information
          </h2>
          
          <div className="space-y-4">
            <Input
              label="Product Name"
              placeholder="e.g., Sourdough Loaf"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Describe the product..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[100px] w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] px-3 py-2 text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                options={categoryOptions}
                placeholder="Select a category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
                required
              />

              <Select
                label="Status"
                options={statusOptions}
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              />
            </div>

            <Input
              label="Price (£)"
              type="text"
              placeholder="e.g., 4.50"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              helpText="Enter price in pounds (e.g., 4.50 for £4.50)"
              required
            />
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Allergens
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Select all allergens that this product contains.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {ALLERGENS.map((allergen) => (
              <button
                key={allergen}
                type="button"
                onClick={() => toggleAllergen(allergen)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  formData.allergens.includes(allergen)
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                }`}
              >
                {allergen}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Ingredients
          </h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">
            Add ingredients and their quantities after creating the product.
          </p>
          
          {ingredients.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">
              No ingredients added yet. You can add ingredients after creating the product.
            </p>
          ) : (
            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div key={ing.id} className="flex items-center gap-3">
                  <span className="flex-1 text-sm text-[var(--color-text-primary)]">
                    {ing.name}
                  </span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {ing.quantity} {ing.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                    className="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-danger)]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/products">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={loading}>
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}