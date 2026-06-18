'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/admin/ui';
import { PACKAGING_TYPES, PACKAGING_TYPE_LABELS, PackagingType, parseCurrencyToCents } from '@/types';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPackagingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '' as PackagingType | '',
    dimensions: '',
    costPerUnit: '',
    currentStock: '',
    minStock: '',
    supplier: '',
  });
  const [error, setError] = useState('');

  const typeOptions = PACKAGING_TYPES.map((type) => ({
    value: type,
    label: PACKAGING_TYPE_LABELS[type],
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/packaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type,
          dimensions: formData.dimensions || null,
          costPerUnit: parseCurrencyToCents(formData.costPerUnit),
          currentStock: parseInt(formData.currentStock) || 0,
          minStock: parseInt(formData.minStock) || 0,
          supplier: formData.supplier || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create packaging');
      }

      const packaging = await response.json();
      router.push(`/admin/packaging/${packaging.id}`);
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
          href="/admin/packaging"
          className="mb-4 inline-flex items-center gap-2 text-sm text-var(--color-text-secondary)] hover:text-var(--color-text-primary)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Packaging
        </Link>
        <h1 className="text-2xl font-bold text-var(--color-text-primary)]">
          Add New Packaging
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
              label="Packaging Name"
              placeholder="e.g., Brown Paper Bag (Small)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Type"
                options={typeOptions}
                placeholder="Select a type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as PackagingType })}
                required
              />

              <Input
                label="Dimensions"
                placeholder="e.g., 20cm x 15cm"
                value={formData.dimensions}
                onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-var(--color-text-primary)] mb-4">
            Stock Information
          </h2>
          
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Current Stock"
                type="number"
                placeholder="e.g., 100"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
              />

              <Input
                label="Minimum Stock Level"
                type="number"
                placeholder="e.g., 20"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                helpText="Alert when stock falls below this level"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
          <h2 className="text-lg font-semibold text-var(--color-text-primary)] mb-4">
            Cost & Supplier
          </h2>
          
          <div className="space-y-4">
            <Input
              label="Cost per Unit (£)"
              type="text"
              placeholder="e.g., 0.15"
              value={formData.costPerUnit}
              onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
              helpText="Enter cost in pounds"
              required
            />

            <Input
              label="Supplier"
              placeholder="e.g., packaging supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/packaging">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" loading={loading}>
            Create Packaging
          </Button>
        </div>
      </form>
    </div>
  );
}