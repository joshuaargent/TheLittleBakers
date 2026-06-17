const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create Order Statuses
  const orderStatuses = [
    { code: 'PENDING', name: 'Pending', sortOrder: 1, description: 'Order received, awaiting confirmation' },
    { code: 'CONFIRMED', name: 'Confirmed', sortOrder: 2, description: 'Order confirmed, preparing' },
    { code: 'IN_PROGRESS', name: 'In Progress', sortOrder: 3, description: 'Order being prepared' },
    { code: 'READY', name: 'Ready', sortOrder: 4, description: 'Order ready for collection/delivery' },
    { code: 'COMPLETED', name: 'Completed', sortOrder: 5, isFinal: true, description: 'Order completed' },
    { code: 'CANCELLED', name: 'Cancelled', sortOrder: 6, isFinal: true, description: 'Order cancelled' },
  ];

  for (const status of orderStatuses) {
    await prisma.orderStatus.upsert({
      where: { code: status.code },
      update: status,
      create: status,
    });
  }
  console.log('✓ Order statuses created');

  // Create Transaction Categories
  const transactionCategories = [
    { code: 'ORDER_REVENUE', name: 'Order Revenue', type: 'INCOME', description: 'Income from product sales' },
    { code: 'DELIVERY_FEE', name: 'Delivery Fee', type: 'INCOME', description: 'Delivery charges' },
    { code: 'CATERING', name: 'Catering', type: 'INCOME', description: 'Catering service income' },
    { code: 'INGREDIENTS', name: 'Ingredients', type: 'EXPENSE', description: 'Ingredient purchases' },
    { code: 'PACKAGING', name: 'Packaging', type: 'EXPENSE', description: 'Packaging materials' },
    { code: 'RENT', name: 'Rent', type: 'EXPENSE', description: 'Premises rent' },
    { code: 'UTILITIES', name: 'Utilities', type: 'EXPENSE', description: 'Electricity, gas, water' },
    { code: 'EQUIPMENT', name: 'Equipment', type: 'EXPENSE', description: 'Equipment purchases and maintenance' },
    { code: 'MARKETING', name: 'Marketing', type: 'EXPENSE', description: 'Advertising and promotion' },
    { code: 'STAFF_WAGES', name: 'Staff Wages', type: 'EXPENSE', description: 'Staff salaries and wages' },
    { code: 'INSURANCE', name: 'Insurance', type: 'EXPENSE', description: 'Business insurance' },
    { code: 'OTHER', name: 'Other', type: 'EXPENSE', description: 'Other expenses' },
  ];

  for (const cat of transactionCategories) {
    await prisma.transactionCategory.upsert({
      where: { code: cat.code },
      update: cat,
      create: cat,
    });
  }
  console.log('✓ Transaction categories created');

  // Create Waste Types
  const wasteTypes = [
    { code: 'EXPIRED', name: 'Expired', costRecoverable: false, description: 'Items past expiry date' },
    { code: 'DAMAGED', name: 'Damaged', costRecoverable: false, description: 'Physically damaged items' },
    { code: 'SPOILED', name: 'Spoiled', costRecoverable: false, description: 'Spoiled or contaminated items' },
    { code: 'OVERPRODUCTION', name: 'Overproduction', costRecoverable: true, description: 'Excess production beyond demand' },
    { code: 'QUALITY_FAIL', name: 'Quality Failed', costRecoverable: false, description: 'Failed quality control checks' },
    { code: 'CONTAMINATION', name: 'Contamination', costRecoverable: false, description: 'Cross-contamination issues' },
    { code: 'RETURNED', name: 'Returned', costRecoverable: true, description: 'Customer returns' },
    { code: 'OTHER', name: 'Other', costRecoverable: false, description: 'Other waste types' },
  ];

  for (const waste of wasteTypes) {
    await prisma.wasteType.upsert({
      where: { code: waste.code },
      update: waste,
      create: waste,
    });
  }
  console.log('✓ Waste types created');

  // Create Product Categories
  const productCategories = [
    { code: 'BREAD', name: 'Bread', sortOrder: 1 },
    { code: 'PASTRIES', name: 'Pastries', sortOrder: 2 },
    { code: 'CAKES', name: 'Cakes', sortOrder: 3 },
    { code: 'COOKIES', name: 'Cookies', sortOrder: 4 },
    { code: 'SAVOURY', name: 'Savoury', sortOrder: 5 },
    { code: 'SEASONAL', name: 'Seasonal', sortOrder: 6 },
    { code: 'DRINKS', name: 'Drinks', sortOrder: 7 },
    { code: 'SPECIAL', name: 'Special', sortOrder: 8 },
  ];

  for (const cat of productCategories) {
    await prisma.productCategory.upsert({
      where: { code: cat.code },
      update: cat,
      create: cat,
    });
  }
  console.log('✓ Product categories created');

  // Create Ingredient Categories
  const ingredientCategories = [
    { code: 'FLOUR', name: 'Flour' },
    { code: 'SUGAR', name: 'Sugar' },
    { code: 'EGGS', name: 'Eggs' },
    { code: 'DAIRY', name: 'Dairy' },
    { code: 'FATS', name: 'Fats' },
    { code: 'FRUITS', name: 'Fruits' },
    { code: 'NUTS', name: 'Nuts' },
    { code: 'CHOCOLATE', name: 'Chocolate' },
    { code: 'FLAVOURINGS', name: 'Flavourings' },
    { code: 'RAISING_AGENTS', name: 'Raising Agents' },
    { code: 'SALT', name: 'Salt' },
    { code: 'SPICES', name: 'Spices' },
    { code: 'OTHER', name: 'Other' },
  ];

  for (const cat of ingredientCategories) {
    await prisma.ingredientCategory.upsert({
      where: { code: cat.code },
      update: cat,
      create: cat,
    });
  }
  console.log('✓ Ingredient categories created');

  // Create Packaging Categories
  const packagingCategories = [
    { code: 'BOX', name: 'Box' },
    { code: 'BAG', name: 'Bag' },
    { code: 'WRAP', name: 'Wrap' },
    { code: 'CONTAINER', name: 'Container' },
    { code: 'SLEEVE', name: 'Sleeve' },
    { code: 'TRAY', name: 'Tray' },
    { code: 'LINER', name: 'Liner' },
    { code: 'LABEL', name: 'Label' },
    { code: 'NAPKIN', name: 'Napkin' },
    { code: 'CUTLERY', name: 'Cutlery' },
    { code: 'OTHER', name: 'Other' },
  ];

  for (const cat of packagingCategories) {
    await prisma.packagingCategory.upsert({
      where: { code: cat.code },
      update: cat,
      create: cat,
    });
  }
  console.log('✓ Packaging categories created');

  // Create Allergens
  const allergens = [
    { code: 'GLUTEN', name: 'Gluten', severity: 'CONTAINS' },
    { code: 'DAIRY', name: 'Dairy', severity: 'CONTAINS' },
    { code: 'EGGS', name: 'Eggs', severity: 'CONTAINS' },
    { code: 'NUTS', name: 'Nuts', severity: 'CONTAINS' },
    { code: 'PEANUTS', name: 'Peanuts', severity: 'CONTAINS' },
    { code: 'SOYA', name: 'Soya', severity: 'CONTAINS' },
    { code: 'FISH', name: 'Fish', severity: 'CONTAINS' },
    { code: 'SHELLFISH', name: 'Shellfish', severity: 'CONTAINS' },
    { code: 'SESAME', name: 'Sesame', severity: 'CONTAINS' },
    { code: 'CELERY', name: 'Celery', severity: 'CONTAINS' },
    { code: 'MUSTARD', name: 'Mustard', severity: 'CONTAINS' },
    { code: 'LUPIN', name: 'Lupin', severity: 'CONTAINS' },
    { code: 'SULPHITES', name: 'Sulphites', severity: 'CONTAINS' },
  ];

  for (const allergen of allergens) {
    await prisma.allergen.upsert({
      where: { code: allergen.code },
      update: allergen,
      create: allergen,
    });
  }
  console.log('✓ Allergens created');

  // Create Dietary Labels
  const dietaryLabels = [
    { code: 'VEGAN', name: 'Vegan', description: 'Contains no animal products' },
    { code: 'VEGETARIAN', name: 'Vegetarian', description: 'Contains no meat' },
    { code: 'GLUTEN_FREE', name: 'Gluten Free', description: 'Contains no gluten' },
    { code: 'DAIRY_FREE', name: 'Dairy Free', description: 'Contains no dairy' },
    { code: 'NUT_FREE', name: 'Nut Free', description: 'Contains no nuts' },
    { code: 'HALAL', name: 'Halal', description: 'Prepared according to Islamic law' },
    { code: 'KOSHER', name: 'Kosher', description: 'Prepared according to Jewish law' },
  ];

  for (const label of dietaryLabels) {
    await prisma.dietaryLabel.upsert({
      where: { code: label.code },
      update: label,
      create: label,
    });
  }
  console.log('✓ Dietary labels created');

  // Create Storage Locations
  const storageLocations = [
    { code: 'AMBIENT', name: 'Ambient Storage', temperature: '18-22C', humidity: 'Medium' },
    { code: 'FRIDGE', name: 'Fridge', temperature: '0-4C', humidity: 'Medium' },
    { code: 'FREEZER', name: 'Freezer', temperature: '-18C', humidity: 'Low' },
    { code: 'COOLER', name: 'Cooler', temperature: '8-12C', humidity: 'Medium' },
    { code: 'PROOFING_BOX', name: 'Proofing Box', temperature: '25-30C', humidity: 'High' },
  ];

  for (const loc of storageLocations) {
    await prisma.storageLocation.upsert({
      where: { code: loc.code },
      update: loc,
      create: loc,
    });
  }
  console.log('✓ Storage locations created');

  // Create Business Settings (if not exists)
  const existingSettings = await prisma.businessSettings.findFirst();
  if (!existingSettings) {
    await prisma.businessSettings.create({
      data: {
        businessName: 'The Little Bakers',
        currency: 'GBP',
        currencySymbol: '£',
        vatRate: 20,
        vatRegistered: false,
        hourlyRate: 12,
        prepRate: 15,
        bakeRate: 12,
        overtimeRate: 18,
        overheadPercent: 20,
        targetMargin: 40,
        orderLeadTime: 72,
        maxDailyOrders: 10,
        cutoffTime: '15:00',
        deliveryEnabled: false,
        minDeliveryOrder: 2500,
        maxDeliveryDistance: 10,
        preorderEnabled: true,
        emailNotifications: true,
        orderAlerts: true,
      },
    });
    console.log('✓ Business settings created');
  } else {
    console.log('✓ Business settings already exists');
  }

  console.log('\n✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
