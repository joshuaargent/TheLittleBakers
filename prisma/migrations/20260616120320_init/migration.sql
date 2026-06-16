-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "imageUrl" TEXT,
    "allergens" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "current_price" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ProductPriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "effective_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProductPriceHistory_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "current_stock" REAL NOT NULL DEFAULT 0,
    "reorder_point" REAL NOT NULL DEFAULT 0,
    "cost_per_unit" REAL NOT NULL DEFAULT 0,
    "supplier" TEXT,
    "supplier_contact" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ingredient_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    "balance" REAL NOT NULL,
    "reason" TEXT,
    "reference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StockMovement_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "Ingredient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IngredientPriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ingredient_id" TEXT NOT NULL,
    "cost_per_unit" REAL NOT NULL,
    "effective_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "supplier" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IngredientPriceHistory_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "Ingredient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProductIngredient" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "product_id" TEXT NOT NULL,
    "ingredient_id" TEXT NOT NULL,
    "quantity" REAL NOT NULL,
    CONSTRAINT "ProductIngredient_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProductIngredient_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "Ingredient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Packaging" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "dimensions" TEXT,
    "cost_per_unit" INTEGER NOT NULL DEFAULT 0,
    "current_stock" INTEGER NOT NULL DEFAULT 0,
    "min_stock" INTEGER NOT NULL DEFAULT 0,
    "supplier" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PackagingPriceHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "packaging_id" TEXT NOT NULL,
    "cost_per_unit" INTEGER NOT NULL,
    "effective_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PackagingPriceHistory_packaging_id_fkey" FOREIGN KEY ("packaging_id") REFERENCES "Packaging" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_number" TEXT NOT NULL,
    "customer_name" TEXT NOT NULL,
    "customer_contact" TEXT,
    "customer_email" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "subtotal" INTEGER NOT NULL DEFAULT 0,
    "packaging_cost" INTEGER NOT NULL DEFAULT 0,
    "total" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "completed_at" DATETIME
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" INTEGER NOT NULL,
    "total_price" INTEGER NOT NULL,
    "packaging_id" TEXT,
    CONSTRAINT "OrderItem_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_packaging_id_fkey" FOREIGN KEY ("packaging_id") REFERENCES "Packaging" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderStatusHistory_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "ProductPriceHistory_product_id_idx" ON "ProductPriceHistory"("product_id");

-- CreateIndex
CREATE INDEX "StockMovement_ingredient_id_idx" ON "StockMovement"("ingredient_id");

-- CreateIndex
CREATE INDEX "StockMovement_createdAt_idx" ON "StockMovement"("createdAt");

-- CreateIndex
CREATE INDEX "IngredientPriceHistory_ingredient_id_idx" ON "IngredientPriceHistory"("ingredient_id");

-- CreateIndex
CREATE INDEX "ProductIngredient_product_id_idx" ON "ProductIngredient"("product_id");

-- CreateIndex
CREATE INDEX "ProductIngredient_ingredient_id_idx" ON "ProductIngredient"("ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "ProductIngredient_product_id_ingredient_id_key" ON "ProductIngredient"("product_id", "ingredient_id");

-- CreateIndex
CREATE INDEX "PackagingPriceHistory_packaging_id_idx" ON "PackagingPriceHistory"("packaging_id");

-- CreateIndex
CREATE UNIQUE INDEX "Order_order_number_key" ON "Order"("order_number");

-- CreateIndex
CREATE INDEX "OrderItem_order_id_idx" ON "OrderItem"("order_id");

-- CreateIndex
CREATE INDEX "OrderItem_product_id_idx" ON "OrderItem"("product_id");

-- CreateIndex
CREATE INDEX "OrderStatusHistory_order_id_idx" ON "OrderStatusHistory"("order_id");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE INDEX "Transaction_type_idx" ON "Transaction"("type");
