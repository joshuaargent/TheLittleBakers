import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ORDER_STATUS_FLOW, OrderStatus } from '@/types';

// PATCH /api/orders/[id]/status - Update order status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, note } = body;

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Validate status transition
    const currentStatus = existingOrder.status as OrderStatus;
    const allowedTransitions = ORDER_STATUS_FLOW[currentStatus];

    if (!allowedTransitions.includes(status as OrderStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${status}` },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: {
      status: string;
      completedAt?: Date | null;
    } = {
      status,
    };

    // Set completedAt if status is COMPLETED
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    // Update the order
    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Create status history entry
    await prisma.orderStatusHistory.create({
      data: {
        orderId: id,
        status,
        note,
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}