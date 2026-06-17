import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/packaging - List all packaging
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const packaging = await prisma.packaging.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        category: true,
        supplier: true,
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
      categoryId,
      description,
      dimensions,
      costPerUnit = 0,
      currentStock = 0,
      reorderPoint = 0,
      supplierId,
      supplierSku,
      unitsPerPack = 1,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Name and categoryId are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const packaging = await prisma.packaging.create({
      data: {
        name,
        slug,
        categoryId,
        description,
        dimensions,
        costPerUnit,
        currentStock,
        reorderPoint,
        supplierId,
        supplierSku,
        unitsPerPack,
      },
      include: {
        category: true,
        supplier: true,
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