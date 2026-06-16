'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/admin/ui';
import {
  INGREDIENT_CATEGORIES,
  INGREDIENT_CATEGORY_LABELS,
  UNITS,
  IngredientCategory,
  Unit,
} from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewIngredientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '' as IngredientCategory | '',
    unit: '' as Unit | '',
    currentStock: '',
    reorderPoint: '',
    costPerUnit: '',
    supplier: '',
    supplierContact: '',
  });
  const [error, setError] = useState('');

  const categoryOptions = INGREDIENT_CATEGORIES.map((cat) => ({
    value: cat,
    label: INGREDIENT_CATEGORY_LABELS[cat],
  }));

  const unitOptions = UNITS.map((unit) => ({
    value: unit,
    label: unit,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          category: formData.category,
          unit: formData.unit,
          currentStock: parseFloat(formData.currentStock) || 0,
          reorderPoint: parseFloat(formData.reorderPoint) || 0,
          costPerUnit: parseFloat(formData.costPerUnit) || 0,
          supplier: formData.supplier || null,
          supplierContact: formData.supplierContact || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create ingredient');
      }

      const ingredient = await response.json();
      router.push(`/admin/ingredients/${ingredient.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/ingredients"
          className="mb-4 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Ingredients
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Add New Ingredient
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
              label="Ingredient Name"
              placeholder="e.g., Strong White Flour"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Category"
                options={categoryOptions}
                placeholder="Select a category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as IngredientCategory })}
                required
              />

              <Select
                label="Unit of Measurement"
                options={unitOptions}
                placeholder="Select a unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as Unit })}
                required
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Stock Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Current Stock"
                type="number"
                step="0.01"
                placeholder="e.g., 10.5"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              />

              <Input
                label="Reorder Point"
                type="number"
                step="0.01"
                placeholder="e.g., 5"
                value={formData.reorderPoint}
                onChange={(e) => setFormData({ ...formData, reorderPoint: e.target.value })}
                helpText="Alert when stock falls below this level"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
            Cost & Supplier
          </h2>
          
          <div className="space-y-4">
            <Input
              label="Cost per Unit (£)"
              type="number"
              step="0.0001"
              placeholder="e.g., 1.50"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
              helpText={`Enter cost per ${formData.unit || 'unit'}`}
            />

            <Input
              label="Supplier"
              placeholder="e.g., local mill"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />

            <Input
              label="Supplier Contact"
              placeholder="e.g., phone or email"
              value={formData.supplierContact}
              onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/ingredients">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={loading}>
            Create Ingredient
          </Button>
        </div>
      </form>
    </div>
  );
}