import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/packaging/[id] - Get a single packaging
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const packaging = await prisma.packaging.findUnique({
      where: { id },
      include: {
        priceHistory: {
          orderBy: { effectiveDate: 'desc' },
          take: 20,
        },
        orderItems: {
          include: {
            order: true,
          },
          orderBy: { order: { createdAt: 'desc' } },
          take: 10,
        },
        _count: {
          select: { orderItems: true },
        },
      },
    });

    if (!packaging) {
      return NextResponse.json(
        { error: 'Packaging not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(packaging);
  } catch (error) {
    console.error('Error fetching packaging:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packaging' },
      { status: 500 }
    );
  }
}

// PATCH /api/packaging/[id] - Update a packaging
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      type,
      dimensions,
      costPerUnit,
      currentStock,
      minStock,
      supplier,
    } = body;

    const existingPackaging = await prisma.packaging.findUnique({
      where: { id },
    });

    if (!existingPackaging) {
      return NextResponse.json(
        { error: 'Packaging not found' },
        { status: 404 }
      );
    }

    // If cost is changing, create a price history entry
    if (costPerUnit !== undefined && costPerUnit !== existingPackaging.costPerUnit) {
      await prisma.packagingPriceHistory.create({
        data: {
          packagingId: id,
          costPerUnit,
        },
      });
    }

    const packaging = await prisma.packaging.update({
      where: { id },
      data: {
        name,
        type,
        dimensions,
        costPerUnit,
        currentStock,
        minStock,
        supplier,
      },
    });

    return NextResponse.json(packaging);
  } catch (error) {
    console.error('Error updating packaging:', error);
    return NextResponse.json(
      { error: 'Failed to update packaging' },
      { status: 500 }
    );
  }
}

// DELETE /api/packaging/[id] - Delete a packaging
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.packaging.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting packaging:', error);
    return NextResponse.json(
      { error: 'Failed to delete packaging' },
      { status: 500 }
    );
  }
}