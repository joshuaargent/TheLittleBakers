export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { Badge, Button } from '@/components/admin/ui';
import { WasteTable } from '@/components/admin/ui/WasteTable';
import { formatCurrency } from '@/types';
import Link from 'next/link';
import { Plus, Trash2, AlertTriangle, DollarSign } from 'lucide-react';

async function getWasteEntries() {
  return prisma.wasteEntry.findMany({
    orderBy: { date: 'desc' },
    take: 100,
    include: {
      wasteType: true,
    },
  });
}

export default async function WastePage() {
  const wasteEntries = await getWasteEntries();

  const categoryConfig: Record<string, { label: string; color: string }> = {
    INGREDIENT: { label: 'Ingredient', color: 'bg-amber-100 text-amber-800' },
    PACKAGING: { label: 'Packaging', color: 'bg-blue-100 text-blue-800' },
    PRODUCT: { label: 'Product', color: 'bg-purple-100 text-purple-800' },
    PRODUCTION: { label: 'Production', color: 'bg-red-100 text-red-800' },
  };

  // Calculate stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  
  const todayEntries = wasteEntries.filter(e => new Date(e.date) >= today);
  const monthEntries = wasteEntries.filter(e => new Date(e.date) >= thisMonth);
  
  const todayCost = todayEntries.reduce((sum, e) => sum + e.totalCost, 0);
  const monthCost = monthEntries.reduce((sum, e) => sum + e.totalCost, 0);
  const totalRecovered = monthEntries.reduce((sum, e) => sum + (e.recovered ? e.recoveryAmount : 0), 0);
  
  // Group by category for breakdown
  const categoryBreakdown = monthEntries.reduce((acc, entry) => {
    acc[entry.category] = (acc[entry.category] || 0) + entry.totalCost;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-var(--color-text-primary)]">
            Waste Tracking
          </h1>
          <p className="mt-1 text-sm text-var(--color-text-secondary)]">
            Track waste, losses, and recovery across your bakery.
          </p>
        </div>
        <Link href="/admin/waste/new">
          <Button icon={<Plus className="h-4 w-4" />}>Record Waste</Button>
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Today's Waste</p>
              <p className="text-xl font-semibold text-red-600">
                {formatCurrency(todayCost)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <DollarSign className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">This Month</p>
              <p className="text-xl font-semibold text-amber-600">
                {formatCurrency(monthCost)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <span className="text-lg">♻️</span>
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Recovered This Month</p>
              <p className="text-xl font-semibold text-green-600">
                {formatCurrency(totalRecovered)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <AlertTriangle className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-var(--color-text-secondary)]">Waste Entries</p>
              <p className="text-xl font-semibold text-var(--color-text-primary)]">
                {monthEntries.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(categoryBreakdown).map(([category, cost]) => {
          const config = categoryConfig[category] || categoryConfig.INGREDIENT;
          return (
            <div key={category} className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-4">
              <Badge className={config.color}>
                {config.label}
              </Badge>
              <p className="mt-2 text-xl font-semibold text-red-600">
                {formatCurrency(cost)}
              </p>
            </div>
          );
        })}
        {Object.keys(categoryBreakdown).length === 0 && (
          <div className="col-span-4 rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-8 text-center">
            <Trash2 className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-4 text-lg font-medium text-var(--color-text-primary)]">
              No waste recorded this month!
            </p>
            <p className="mt-1 text-sm text-var(--color-text-muted)]">
              Great job minimizing waste. Keep it up!
            </p>
          </div>
        )}
      </div>

      {/* Waste Entries Table */}
      <WasteTable entries={wasteEntries} />
    </div>
  );
}