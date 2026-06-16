import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/ingredients - List all ingredients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('lowStock') === 'true';

    const where: Record<string, unknown> = {};

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { supplier: { contains: search } },
      ];
    }

    if (lowStock) {
      where.currentStock = { lt: prisma.ingredient.fields.reorderPoint };
    }

    const ingredients = await prisma.ingredient.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return NextResponse.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ingredients' },
      { status: 500 }
    );
  }
}

// POST /api/ingredients - Create a new ingredient
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      unit,
      currentStock = 0,
      reorderPoint = 0,
      costPerUnit = 0,
      supplier,
      supplierContact,
    } = body;

    if (!name || !category || !unit) {
      return NextResponse.json(
        { error: 'Name, category, and unit are required' },
        { status: 400 }
      );
    }

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        category,
        unit,
        currentStock,
        reorderPoint,
        costPerUnit,
        supplier,
        supplierContact,
      },
    });

    // If there's initial stock, create a stock movement record
    if (currentStock > 0) {
      await prisma.stockMovement.create({
        data: {
          ingredientId: ingredient.id,
          type: 'STOCK_IN',
          quantity: currentStock,
          balance: currentStock,
          reason: 'Initial stock',
        },
      });
    }

    // If there's an initial cost, create a price history entry
    if (costPerUnit > 0) {
      await prisma.ingredientPriceHistory.create({
        data: {
          ingredientId: ingredient.id,
          costPerUnit,
          supplier,
          reason: 'Initial price',
        },
      });
    }

    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    console.error('Error creating ingredient:', error);
    return NextResponse.json(
      { error: 'Failed to create ingredient' },
      { status: 500 }
    );
  }
}