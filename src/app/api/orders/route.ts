import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Generate a unique order number
async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lt: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });
  return `ORD-${dateStr}-${String(count + 1).padStart(3, '0')}`;
}

// GET /api/orders - List all orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerEmail: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        _count: {
          select: { items: true },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      customerContact,
      notes,
      items,
      subtotal,
      packagingCost,
      total,
    } = body;

    if (!customerName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer name and at least one item are required' },
        { status: 400 }
      );
    }

    const orderNumber = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        customerEmail,
        customerContact,
        notes,
        subtotal,
        packagingCost,
        total,
        status: 'PENDING',
        items: {
          create: items.map((item: {
            productId: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
            packagingId?: string;
          }) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            packagingId: item.packagingId,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create initial status history entry
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: 'PENDING',
        note: 'Order created',
      },
    });

    // Create transaction record for income
    await prisma.transaction.create({
      data: {
        type: 'INCOME',
        category: 'ORDER_REVENUE',
        amount: total,
        description: `Order ${orderNumber}`,
        reference: order.id,
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}