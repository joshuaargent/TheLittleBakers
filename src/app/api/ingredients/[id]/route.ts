import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/ingredients/[id] - Get a single ingredient
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
      include: {
        priceHistory: {
          orderBy: { effectiveDate: 'desc' },
          take: 20,
        },
        stockMovements: {
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ingredient);
  } catch (error) {
    console.error('Error fetching ingredient:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ingredient' },
      { status: 500 }
    );
  }
}

// PATCH /api/ingredients/[id] - Update an ingredient
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      name,
      category,
      unit,
      currentStock,
      reorderPoint,
      costPerUnit,
      supplier,
      supplierContact,
    } = body;

    const existingIngredient = await prisma.ingredient.findUnique({
      where: { id },
    });

    if (!existingIngredient) {
      return NextResponse.json(
        { error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    // If cost is changing, create a price history entry
    if (costPerUnit !== undefined && costPerUnit !== existingIngredient.costPerUnit) {
      await prisma.ingredientPriceHistory.create({
        data: {
          ingredientId: id,
          costPerUnit,
          supplier,
          reason: body.priceReason || 'Price update',
        },
      });
    }

    // Handle stock adjustment
    let newStock = currentStock;
    if (currentStock !== undefined && currentStock !== existingIngredient.currentStock) {
      const stockDiff = currentStock - existingIngredient.currentStock;
      await prisma.stockMovement.create({
        data: {
          ingredientId: id,
          type: 'ADJUSTMENT',
          quantity: stockDiff,
          balance: currentStock,
          reason: body.stockReason || 'Manual adjustment',
        },
      });
      newStock = currentStock;
    }

    const ingredient = await prisma.ingredient.update({
      where: { id },
      data: {
        name,
        category,
        unit,
        currentStock: newStock,
        reorderPoint,
        costPerUnit,
        supplier,
        supplierContact,
      },
    });

    return NextResponse.json(ingredient);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    return NextResponse.json(
      { error: 'Failed to update ingredient' },
      { status: 500 }
    );
  }
}

// DELETE /api/ingredients/[id] - Delete an ingredient
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.ingredient.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting ingredient:', error);
    return NextResponse.json(
      { error: 'Failed to delete ingredient' },
      { status: 500 }
    );
  }
}