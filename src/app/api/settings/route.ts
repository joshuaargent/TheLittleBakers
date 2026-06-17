import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.businessSettings.findFirst();
    
    if (!settings) {
      // Create default settings
      settings = await prisma.businessSettings.create({
        data: {
          businessName: 'The Little Bakers',
          currency: 'GBP',
          currencySymbol: '£',
        },
      });
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Get existing settings
    let existingSettings = await prisma.businessSettings.findFirst();
    
    if (existingSettings) {
      // Update existing settings
      const updatedSettings = await prisma.businessSettings.update({
        where: { id: existingSettings.id },
        data: body,
      });
      return NextResponse.json(updatedSettings);
    } else {
      // Create new settings
      const newSettings = await prisma.businessSettings.create({
        data: body,
      });
      return NextResponse.json(newSettings);
    }
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}