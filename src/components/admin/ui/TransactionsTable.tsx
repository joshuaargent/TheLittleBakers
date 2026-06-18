'use client';

import { Badge } from '@/components/admin/ui';
import { formatCurrency } from '@/types';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  date: Date | string;
  category: {
    code: string;
    name: string;
  };
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  width?: string;
  render: (item: Transaction) => React.ReactNode;
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  const columns: Column[] = [
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (item: Transaction) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {new Date(item.date).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (item: Transaction) => (
        <Badge className={item.type === 'INCOME' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {item.type}
        </Badge>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item: Transaction) => (
        <span className="text-sm text-[var(--color-text-primary)]">
          {item.category.name || item.category.code}
        </span>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      render: (item: Transaction) => (
        <span className="text-sm text-[var(--color-text-secondary)]">
          {item.description || '-'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (item: Transaction) => (
        <span className={`font-medium ${item.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
          {item.type === 'INCOME' ? '+' : '-'}{formatCurrency(item.amount)}
        </span>
      ),
    },
  ];

  return (
    <div className="overflow-x-auto">
      {transactions.length === 0 ? (
        <div className="py-8 text-center text-sm text-[var(--color-text-muted)]">
          No transactions found.
        </div>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-var(--color-border)]">
            {transactions.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-[var(--color-bg-secondary)]"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-4 py-3 text-sm text-[var(--color-text-primary)]"
                  >
                    {column.render(item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
