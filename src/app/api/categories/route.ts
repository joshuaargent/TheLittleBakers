import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    // Return all types by default
    const [productCats, ingredientCats, packagingCats, transactionCats] = await Promise.all([
      prisma.productCategory.findMany({ orderBy: { name: 'asc' } }),
      prisma.ingredientCategory.findMany({ orderBy: { name: 'asc' } }),
      prisma.packagingCategory.findMany({ orderBy: { name: 'asc' } }),
      prisma.transactionCategory.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    ]);

    // Filter based on type if specified
    if (type) {
      switch (type) {
        case 'PRODUCT':
          return NextResponse.json(productCats);
        case 'INGREDIENT':
          return NextResponse.json(ingredientCats);
        case 'PACKAGING':
          return NextResponse.json(packagingCats);
        case 'TRANSACTION':
          return NextResponse.json(transactionCats);
        default:
          return NextResponse.json({
            product: productCats,
            ingredient: ingredientCats,
            packaging: packagingCats,
            transaction: transactionCats,
          });
      }
    }

    // No type specified, return all
    return NextResponse.json({
      product: productCats,
      ingredient: ingredientCats,
      packaging: packagingCats,
      transaction: transactionCats,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
