import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/ingredients/[id]/movements - Record a stock movement
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, quantity, reason, reference } = body;

    if (!type || quantity === undefined) {
      return NextResponse.json(
        { error: 'Type and quantity are required' },
        { status: 400 }
      );
    }

    // Get current ingredient
    const ingredient = await prisma.ingredient.findUnique({
      where: { id },
    });

    if (!ingredient) {
      return NextResponse.json(
        { error: 'Ingredient not found' },
        { status: 404 }
      );
    }

    // Calculate new balance based on movement type
    let newBalance: number;
    let actualQuantity: number;

    switch (type) {
      case 'STOCK_IN':
        actualQuantity = Math.abs(quantity);
        newBalance = ingredient.currentStock + actualQuantity;
        break;
      case 'STOCK_OUT':
        actualQuantity = -Math.abs(quantity);
        newBalance = Math.max(0, ingredient.currentStock - Math.abs(quantity));
        break;
      case 'ADJUSTMENT':
        actualQuantity = quantity; // Can be positive or negative
        newBalance = Math.max(0, ingredient.currentStock + quantity);
        break;
      case 'WASTE':
        actualQuantity = -Math.abs(quantity);
        newBalance = Math.max(0, ingredient.currentStock - Math.abs(quantity));
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid movement type' },
          { status: 400 }
        );
    }

    // Create the stock movement
    const movement = await prisma.stockMovement.create({
      data: {
        ingredientId: id,
        type,
        quantity: actualQuantity,
        balance: newBalance,
        reason,
        reference,
      },
    });

    // Update the ingredient's current stock
    await prisma.ingredient.update({
      where: { id },
      data: {
        currentStock: newBalance,
      },
    });

    return NextResponse.json(movement, { status: 201 });
  } catch (error) {
    console.error('Error recording stock movement:', error);
    return NextResponse.json(
      { error: 'Failed to record stock movement' },
      { status: 500 }
    );
  }
}

// GET /api/ingredients/[id]/movements - Get stock movements for an ingredient
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const movements = await prisma.stockMovement.findMany({
      where: { ingredientId: id },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(movements);
  } catch (error) {
    console.error('Error fetching stock movements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock movements' },
      { status: 500 }
    );
  }
}