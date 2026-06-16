import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/packaging - List all packaging
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (type) {
      where.type = type;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { supplier: { contains: search } },
      ];
    }

    const packaging = await prisma.packaging.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { orderItems: true },
        },
      },
    });

    return NextResponse.json(packaging);
  } catch (error) {
    console.error('Error fetching packaging:', error);
    return NextResponse.json(
      { error: 'Failed to fetch packaging' },
      { status: 500 }
    );
  }
}

// POST /api/packaging - Create a new packaging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      dimensions,
      costPerUnit = 0,
      currentStock = 0,
      minStock = 0,
      supplier,
    } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const packaging = await prisma.packaging.create({
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

    // If there's an initial cost, create a price history entry
    if (costPerUnit > 0) {
      await prisma.packagingPriceHistory.create({
        data: {
          packagingId: packaging.id,
          costPerUnit,
        },
      });
    }

    return NextResponse.json(packaging, { status: 201 });
  } catch (error) {
    console.error('Error creating packaging:', error);
    return NextResponse.json(
      { error: 'Failed to create packaging' },
      { status: 500 }
    );
  }
}