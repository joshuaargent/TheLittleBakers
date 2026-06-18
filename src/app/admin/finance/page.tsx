export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { StatCard, Button } from '@/components/admin/ui';
import { TransactionsTable } from '@/components/admin/ui/TransactionsTable';
import { formatCurrency, EXPENSE_CATEGORIES } from '@/types';
import Link from 'next/link';
import { Plus, DollarSign, TrendingUp, TrendingDown, Banknote } from 'lucide-react';

async function getFinanceData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // This month's income
  const thisMonthIncome = await prisma.transaction.aggregate({
    where: {
      type: 'INCOME',
      date: { gte: startOfMonth },
    },
    _sum: { amount: true },
  });

  // This month's expenses
  const thisMonthExpenses = await prisma.transaction.aggregate({
    where: {
      type: 'EXPENSE',
      date: { gte: startOfMonth },
    },
    _sum: { amount: true },
  });

  // Last month's income
  const lastMonthIncome = await prisma.transaction.aggregate({
    where: {
      type: 'INCOME',
      date: { gte: startOfLastMonth, lte: endOfLastMonth },
    },
    _sum: { amount: true },
  });

  // Last month's expenses
  const lastMonthExpenses = await prisma.transaction.aggregate({
    where: {
      type: 'EXPENSE',
      date: { gte: startOfLastMonth, lte: endOfLastMonth },
    },
    _sum: { amount: true },
  });

  // Recent transactions
  const recentTransactions = await prisma.transaction.findMany({
    orderBy: { date: 'desc' },
    take: 20,
    include: {
      category: true,
    },
  });

  // All-time totals
  const totalIncome = await prisma.transaction.aggregate({
    where: { type: 'INCOME' },
    _sum: { amount: true },
  });

  const totalExpenses = await prisma.transaction.aggregate({
    where: { type: 'EXPENSE' },
    _sum: { amount: true },
  });

  return {
    thisMonthIncome: thisMonthIncome._sum.amount || 0,
    thisMonthExpenses: thisMonthExpenses._sum.amount || 0,
    lastMonthIncome: lastMonthIncome._sum.amount || 0,
    lastMonthExpenses: lastMonthExpenses._sum.amount || 0,
    totalIncome: totalIncome._sum.amount || 0,
    totalExpenses: totalExpenses._sum.amount || 0,
    recentTransactions,
  };
}

export default async function FinancePage() {
  const {
    thisMonthIncome,
    thisMonthExpenses,
    lastMonthIncome,
    lastMonthExpenses,
    totalIncome,
    totalExpenses,
    recentTransactions,
  } = await getFinanceData();

  const thisMonthProfit = thisMonthIncome - thisMonthExpenses;
  const totalProfit = totalIncome - totalExpenses;
  const profitMargin = thisMonthIncome > 0 
    ? ((thisMonthIncome - thisMonthExpenses) / thisMonthIncome) * 100 
    : 0;

  const incomeTrend = lastMonthIncome > 0
    ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100
    : 0;

  const expenseTrend = lastMonthExpenses > 0
    ? ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-var(--color-text-primary)]">
            Finance
          </h1>
          <p className="mt-1 text-sm text-var(--color-text-secondary)]">
            Track your bakery&apos;s income, expenses, and profit margins.
          </p>
        </div>
        <Button icon={<Plus className="h-4 w-4" />}>Record Transaction</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="This Month&apos;s Revenue"
          value={formatCurrency(thisMonthIncome)}
          icon='TrendingUp'
          trend={incomeTrend}
          trendLabel="vs last month"
        />
        <StatCard
          title="This Month&apos;s Expenses"
          value={formatCurrency(thisMonthExpenses)}
          icon='TrendingDown'
          trend={expenseTrend}
          trendLabel="vs last month"
        />
        <StatCard
          title="This Month&apos;s Profit"
          value={formatCurrency(thisMonthProfit)}
          icon='DollarSign'
        />
        <StatCard
          title="Profit Margin"
          value={`${profitMargin.toFixed(1)}%`}
          icon='Banknote'
        />
      </div>

      {/* All-Time Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
          <p className="text-sm text-var(--color-text-secondary)]">Total Revenue (All Time)</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatCurrency(totalIncome)}
          </p>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
          <p className="text-sm text-var(--color-text-secondary)]">Total Expenses (All Time)</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
          <p className="text-sm text-var(--color-text-secondary)]">Net Profit (All Time)</p>
          <p className={`mt-2 text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalProfit)}
          </p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)]">
        <div className="flex items-center justify-between border-b border-var(--color-border)] px-6 py-4">
          <h2 className="text-lg font-semibold text-var(--color-text-primary)]">
            Recent Transactions
          </h2>
          <Link
            href="/admin/finance/transactions"
            className="text-sm font-medium text-var(--color-primary)] hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="p-6">
          {recentTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <Banknote className="mx-auto h-12 w-12 text-var(--color-text-muted)]" />
              <p className="mt-4 text-sm text-var(--color-text-muted)]">
                No transactions recorded yet. Start tracking your finances by recording income and expenses.
              </p>
            </div>
          ) : (
            <TransactionsTable transactions={recentTransactions} />
          )}
        </div>
      </div>

      {/* Expense Breakdown by Category */}
      <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
        <h2 className="text-lg font-semibold text-var(--color-text-primary)]">
          Expense Categories
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {EXPENSE_CATEGORIES.map((category) => (
            <div
              key={category}
              className="flex items-center justify-between rounded-lg border border-var(--color-border)] p-3"
            >
              <span className="text-sm text-var(--color-text-secondary)]">
                {category.replace('_', ' ')}
              </span>
              <span className="text-sm font-medium text-var(--color-text-primary)]">
                £0.00
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}