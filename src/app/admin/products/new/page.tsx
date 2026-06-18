'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/admin/ui';
import {
  PRODUCT_STATUSES,
  ALLERGENS,
  parseCurrencyToCents,
} from '@/types';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
}

interface Allergen {
  id: string;
  name: string;
}

interface IngredientSelection {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    status: 'ACTIVE',
    currentPrice: '',
  });
  const [selectedAllergenIds, setSelectedAllergenIds] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<IngredientSelection[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch categories and allergens from the database
    async function fetchData() {
      try {
        const [categoriesRes, allergensRes] = await Promise.all([
          fetch('/api/categories?type=PRODUCT'),
          fetch('/api/allergens'),
        ]);
        
        if (categoriesRes.ok) {
          const cats = await categoriesRes.json();
          setCategories(cats);
        }
        
        if (allergensRes.ok) {
          const alls = await allergensRes.json();
          setAllergens(alls);
        }
      } catch (err) {
        console.error('Failed to fetch form data:', err);
      }
    }
    fetchData();
  }, []);

  const categoryOptions = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
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
          categoryId: formData.categoryId,
          status: formData.status,
          currentPrice: parseCurrencyToCents(formData.currentPrice),
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

  const toggleAllergen = (allergenId: string) => {
    setSelectedAllergenIds((prev) =>
      prev.includes(allergenId)
        ? prev.filter((id) => id !== allergenId)
        : [...prev, allergenId]
    );
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/products"
          className="mb-4 inline-flex items-center gap-2 text-sm text-var(--color-text-secondary)] hover:text-var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold text-var(--color-text-primary)]">
          Add New Product
        </h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-var(--color-danger)]/10 p-4 text-sm text-var(--color-danger)]">
            {error}
          </div>
        )}

        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-var(--color-text-primary)] mb-4">
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
              <label className="block text-sm font-medium text-var(--color-text-primary)] mb-1.5">
                Description
              </label>
              <textarea
                placeholder="Describe the product..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="flex min-h-[100px] w-full rounded-lg border border-var(--color-border)] bg-var(--color-bg-card)] px-3 py-2 text-sm text-var(--color-text-primary)] placeholder-var(--color-text-muted)] focus:border-var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-var(--color-primary)]/20"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                options={categoryOptions}
                placeholder="Select a category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
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
              value={formData.currentPrice}
              onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
              helpText="Enter price in pounds (e.g., 4.50 for £4.50)"
              required
            />
          </div>
        </div>

        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-var(--color-text-primary)] mb-4">
            Allergens
          </h2>
          <p className="text-sm text-var(--color-text-secondary)] mb-4">
            Select all allergens that this product contains.
          </p>
          
          <div className="flex flex-wrap gap-2">
            {allergens.map((allergen) => (
              <button
                key={allergen.id}
                type="button"
                onClick={() => toggleAllergen(allergen.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedAllergenIds.includes(allergen.id)
                    ? 'bg-var(--color-primary)] text-white'
                    : 'bg-var(--color-bg-secondary)] text-var(--color-text-secondary)] hover:bg-var(--color-border)]'
                }`}
              >
                {allergen.name}
              </button>
            ))}
            {allergens.length === 0 && ALLERGENS.map((allergen) => (
              <button
                key={allergen}
                type="button"
                onClick={() => toggleAllergen(allergen)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  selectedAllergenIds.includes(allergen)
                    ? 'bg-var(--color-primary)] text-white'
                    : 'bg-var(--color-bg-secondary)] text-var(--color-text-secondary)] hover:bg-var(--color-border)]'
                }`}
              >
                {allergen}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-var(--color-text-primary)] mb-4">
            Ingredients
          </h2>
          <p className="text-sm text-var(--color-text-secondary)] mb-4">
            Add ingredients and their quantities after creating the product.
          </p>
          
          {ingredients.length === 0 ? (
            <p className="text-sm text-var(--color-text-muted)]">
              No ingredients added yet. You can add ingredients after creating the product.
            </p>
          ) : (
            <div className="space-y-3">
              {ingredients.map((ing, index) => (
                <div key={ing.id} className="flex items-center gap-3">
                  <span className="flex-1 text-sm text-var(--color-text-primary)]">
                    {ing.name}
                  </span>
                  <span className="text-sm text-var(--color-text-secondary)]">
                    {ing.quantity} {ing.unit}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIngredients(ingredients.filter((_, i) => i !== index))}
                    className="p-1 text-var(--color-text-muted)] hover:text-var(--color-danger)]"
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