import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/ingredients - List all ingredients
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const lowStock = searchParams.get('lowStock') === 'true';

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

    const ingredients = await prisma.ingredient.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        category: true,
        supplier: true,
        _count: {
          select: { products: true },
        },
      },
    });

    // Filter for low stock if requested
    const result = lowStock 
      ? ingredients.filter(i => i.currentStock < i.reorderPoint)
      : ingredients;

    return NextResponse.json(result);
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
      categoryId,
      unit = 'g',
      recipeUnit = 'g',
      currentStock = 0,
      reorderPoint = 0,
      reorderQty = 0,
      costPerUnit = 0,
      supplierId,
      supplierSku,
      description,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: 'Name and categoryId are required' },
        { status: 400 }
      );
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const ingredient = await prisma.ingredient.create({
      data: {
        name,
        slug,
        categoryId,
        unit,
        recipeUnit,
        currentStock,
        reorderPoint,
        reorderQty,
        costPerUnit,
        supplierId,
        supplierSku,
        description,
      },
      include: {
        category: true,
        supplier: true,
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