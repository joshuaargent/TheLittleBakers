import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { items, pickupDate, pickupTime } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate totals
    let subtotal = 0;
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) {
        return NextResponse.json({ error: `Product not found: ${item.productId}` }, { status: 400 });
      }
      subtotal += product.currentPrice * item.quantity;
    }

    // Get pending status
    const pendingStatus = await prisma.orderStatus.findFirst({
      where: { code: 'PENDING' },
    });

    if (!pendingStatus) {
      return NextResponse.json({ error: 'Order status not configured' }, { status: 500 });
    }

    // Generate order number
    const orderCount = await prisma.order.count();
    const orderNumber = `TLB-${String(orderCount + 1).padStart(5, '0')}`;

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session.user.id,
        customerName: `${user.firstName} ${user.lastName}`.trim(),
        customerEmail: user.email,
        customerPhone: user.phone,
        source: 'WEBSITE',
        fulfillmentMethod: 'COLLECTION',
        collectionDate: new Date(pickupDate),
        collectionTime: pickupTime,
        subtotal: Math.round(subtotal * 100),
        total: Math.round(subtotal * 100),
        statusId: pendingStatus.id,
        paymentStatus: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            statusId: pendingStatus.id,
          })),
        },
      },
      include: {
        items: {
          include: { product: true },
        },
        status: true,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
