'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Badge, Button, Modal } from '@/components/admin/ui';
import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_COLORS,
  ORDER_STATUS_FLOW,
  formatCurrency,
  OrderStatus,
} from '@/types';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Clock,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string | null;
  customerContact: string | null;
  status: string;
  notes: string | null;
  subtotal: number;
  packagingCost: number;
  total: number;
  createdAt: string;
  completedAt: string | null;
  items: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      id: string;
      name: string;
    };
    packaging: {
      id: string;
      name: string;
    } | null;
  }>;
  statusHistory: Array<{
    id: string;
    status: string;
    note: string | null;
    createdAt: string;
  }>;
}

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { id } = await params;
        const response = await fetch(`/api/orders/${id}`);
        if (!response.ok) throw new Error('Order not found');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [params]);

  const handleStatusUpdate = async () => {
    if (!order || !selectedStatus) return;

    setUpdatingStatus(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedStatus,
          note: statusNote || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update status');
      }

      const updatedOrder = await response.json();
      setOrder({
        ...order,
        ...updatedOrder,
        statusHistory: [
          {
            id: Date.now().toString(),
            status: selectedStatus,
            note: statusNote || null,
            createdAt: new Date().toISOString(),
          },
          ...order.statusHistory,
        ],
      });
      setShowStatusModal(false);
      setSelectedStatus('');
      setStatusNote('');
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 animate-pulse rounded bg-var(--color-bg-secondary)]" />
        <div className="h-32 animate-pulse rounded-xl bg-var(--color-bg-card)]" />
        <div className="h-64 animate-pulse rounded-xl bg-var(--color-bg-card)]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-semibold text-var(--color-text-primary)]">
          Order not found
        </h1>
        <Link href="/admin/orders" className="mt-4 inline-block">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const currentStatus = order.status as OrderStatus;
  const availableTransitions = ORDER_STATUS_FLOW[currentStatus] || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="mb-4 inline-flex items-center gap-2 text-sm text-var(--color-text-secondary)] hover:text-var(--color-text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-var(--color-text-primary)]">
              {order.orderNumber}
            </h1>
            <Badge className={ORDER_STATUS_COLORS[currentStatus]}>
              {ORDER_STATUS_LABELS[currentStatus]}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-var(--color-text-secondary)]">
            Created {new Date(order.createdAt).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <div className="flex gap-3">
          {availableTransitions.length > 0 && (
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedStatus(availableTransitions[0]);
                setShowStatusModal(true);
              }}
            >
              Update Status
            </Button>
          )}
          <Button variant="outline" icon={<Edit className="h-4 w-4" />}>
            Edit
          </Button>
          <Button variant="danger" icon={<Trash2 className="h-4 w-4" />}>
            Cancel Order
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
            <h2 className="text-lg font-semibold text-var(--color-text-primary)]">
              Order Items
            </h2>
            <div className="mt-4 divide-y divide-var(--color-border)]">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-var(--color-primary-light)]">
                      <span className="text-lg font-bold text-var(--color-primary)]">
                        {item.quantity}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-var(--color-text-primary)]">
                        {item.product.name}
                      </p>
                      {item.packaging && (
                        <p className="text-sm text-var(--color-text-muted)]">
                          + {item.packaging.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-var(--color-text-primary)]">
                      {formatCurrency(item.totalPrice)}
                    </p>
                    <p className="text-sm text-var(--color-text-muted)]">
                      {formatCurrency(item.unitPrice)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="mt-6 border-t border-var(--color-border)] pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-var(--color-text-secondary)]">Subtotal</span>
                  <span className="text-var(--color-text-primary)]">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-var(--color-text-secondary)]">Packaging</span>
                  <span className="text-var(--color-text-primary)]">
                    {formatCurrency(order.packagingCost)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-var(--color-border)] pt-2 text-base">
                  <span className="font-semibold text-var(--color-text-primary)]">Total</span>
                  <span className="font-bold text-var(--color-primary)]">
                    {formatCurrency(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
              <h2 className="text-lg font-semibold text-var(--color-text-primary)]">
                Order Notes
              </h2>
              <p className="mt-3 text-sm text-var(--color-text-secondary)]">
                {order.notes}
              </p>
            </div>
          )}

          {/* Status History */}
          <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
            <h2 className="text-lg font-semibold text-var(--color-text-primary)]">
              Status History
            </h2>
            <div className="mt-4 space-y-4">
              {order.statusHistory.map((history, index) => (
                <div key={history.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        history.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-600'
                          : history.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {history.status === 'COMPLETED' ? (
                        <Check className="h-4 w-4" />
                      ) : history.status === 'CANCELLED' ? (
                        <X className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    {index < order.statusHistory.length - 1 && (
                      <div className="h-full w-0.5 bg-var(--color-border)]" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          ORDER_STATUS_COLORS[history.status as OrderStatus]
                        }
                      >
                        {ORDER_STATUS_LABELS[history.status as OrderStatus]}
                      </Badge>
                      <span className="text-sm text-var(--color-text-muted)]">
                        {new Date(history.createdAt).toLocaleString('en-GB')}
                      </span>
                    </div>
                    {history.note && (
                      <p className="mt-1 text-sm text-var(--color-text-secondary)]">
                        {history.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="space-y-6">
          <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
            <h2 className="text-lg font-semibold text-var(--color-text-primary)]">
              Customer Information
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <p className="text-sm text-var(--color-text-muted)]">Name</p>
                <p className="text-sm font-medium text-var(--color-text-primary)]">
                  {order.customerName}
                </p>
              </div>
              {order.customerEmail && (
                <div>
                  <p className="text-sm text-var(--color-text-muted)]">Email</p>
                  <p className="text-sm font-medium text-var(--color-text-primary)]">
                    {order.customerEmail}
                  </p>
                </div>
              )}
              {order.customerContact && (
                <div>
                  <p className="text-sm text-var(--color-text-muted)]">Phone</p>
                  <p className="text-sm font-medium text-var(--color-text-primary)]">
                    {order.customerContact}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {availableTransitions.length > 0 && (
            <div className="rounded-xl border border-var(--color-border)] bg-var(--color-bg-card)] p-6">
              <h2 className="text-lg font-semibold text-var(--color-text-primary)]">
                Update Status
              </h2>
              <div className="mt-4 space-y-2">
                {availableTransitions.map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setSelectedStatus(status);
                      setShowStatusModal(true);
                    }}
                    className="flex w-full items-center justify-between rounded-lg border border-var(--color-border)] p-3 text-left transition-colors hover:border-var(--color-primary)] hover:bg-var(--color-primary-light)]"
                  >
                    <span className="text-sm font-medium text-var(--color-text-primary)]">
                      {ORDER_STATUS_LABELS[status as OrderStatus]}
                    </span>
                    <ChevronRight className="h-4 w-4 text-var(--color-text-muted)]" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={`Update to ${ORDER_STATUS_LABELS[selectedStatus as OrderStatus]}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-var(--color-text-secondary)]">
            Add a note about this status change (optional):
          </p>
          <textarea
            placeholder="e.g., Payment received, started baking..."
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            className="flex min-h-[100px] w-full rounded-lg border border-var(--color-border)] bg-var(--color-bg-card)] px-3 py-2 text-sm text-var(--color-text-primary)] placeholder-var(--color-text-muted)] focus:border-var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-var(--color-primary)]/20"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              loading={updatingStatus}
            >
              Update Status
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}