# The Little Bakers - Admin Dashboard Specification

## 1. Concept & Vision

A warm, professional admin dashboard for a local artisan bakery called "The Little Bakers." The interface balances functional efficiency with the artisanal warmth of a small-batch bakery—clean data presentation with subtle craft touches that reflect the handmade nature of the products. The dashboard empowers you and Chloe to manage every aspect of the business from orders to ingredient inventory with clarity and confidence.

---

## 2. Design Language

### Aesthetic Direction
**Warm Professionalism** — Clean, data-focused interfaces softened with warm undertones and subtle organic shapes. Think: a well-organized bakery counter meets modern SaaS dashboard. Not cold corporate, not overly playful—professionally crafted with personality.

### Color Palette
```css
/* Primary - Warm terracotta/wheat tones */
--color-primary: #C2703E;        /* Rich terracotta - main actions */
--color-primary-hover: #A85D32;  /* Darker terracotta */
--color-primary-light: #FDF4F0;   /* Soft peach tint */

/* Accent - Fresh herb green */
--color-accent: #4A7C59;         /* Sage green - secondary actions */
--color-accent-light: #E8F2EB;   /* Pale sage */

/* Status Colors */
--color-success: #2D6A4F;        /* Deep forest green */
--color-warning: #E9A319;        /* Honey amber */
--color-danger: #C1292E;         /* Baker's cherry */
--color-info: #3D5A80;           /* Dusty blue */

/* Neutrals - Warm grays */
--color-bg-primary: #FDFCFB;    /* Off-white, slight warmth */
--color-bg-secondary: #F7F5F3;  /* Warm gray */
--color-bg-card: #FFFFFF;        /* Pure white cards */
--color-bg-sidebar: #2C2522;     /* Dark warm brown */

/* Text */
--color-text-primary: #1C1917;  /* Near black, warm */
--color-text-secondary: #57534E; /* Medium gray */
--color-text-muted: #A8A29E;     /* Light gray */
--color-text-inverse: #FDFCFB;   /* For dark backgrounds */

/* Borders */
--color-border: #E8E5E2;         /* Warm border */
--color-border-strong: #D6D2CE; /* Emphasized border */
```

### Typography
- **Headings**: `"Fraunces", Georgia, serif` — Warm, slightly quirky serif with personality
- **Body/UI**: `"DM Sans", system-ui, sans-serif` — Clean, readable sans-serif
- **Monospace (data/numbers)**: `"JetBrains Mono", monospace` — Clear number alignment

### Spatial System
- Base unit: 4px
- Component padding: 16px (sm), 24px (md), 32px (lg)
- Section spacing: 48px
- Card border-radius: 12px
- Button border-radius: 8px
- Input border-radius: 8px

### Motion Philosophy
- **Micro-interactions**: Subtle scale (1.02) on card hover, smooth color transitions (150ms)
- **Page transitions**: Gentle fade-in (200ms) with slight upward movement (8px)
- **Data updates**: Brief highlight flash when values change
- **Modals**: Scale from 0.95 with backdrop fade (200ms)
- **Sidebar**: Smooth slide with easing, submenu expand with height animation

### Visual Assets
- **Icons**: Lucide React (consistent stroke width, friendly rounded style)
- **Empty states**: Custom illustrated SVGs with warm, bakery-themed elements
- **Charts**: Recharts with custom warm color palette
- **Decorative**: Subtle grain texture on sidebar, soft shadows on cards

---

## 3. Layout & Structure

### Overall Architecture
```
┌─────────────────────────────────────────────────────────────────┐
│  Sidebar (240px fixed)  │  Main Content Area                   │
│  ┌───────────────────┐  │  ┌─────────────────────────────────┐ │
│  │ Logo + Brand      │  │  │ Header (breadcrumb, user)       │ │
│  │                   │  │  ├─────────────────────────────────┤ │
│  │ Navigation        │  │  │                                 │ │
│  │ - Dashboard        │  │  │  Page Content                   │ │
│  │ - Orders           │  │  │  (scrollable)                   │ │
│  │ - Products         │  │  │                                 │ │
│  │ - Ingredients      │  │  │                                 │ │
│  │ - Stock            │  │  │                                 │ │
│  │ - Packaging        │  │  │                                 │ │
│  │ - Finance          │  │  │                                 │ │
│  │                   │  │  │                                 │ │
│  │ ───────────────── │  │  │                                 │ │
│  │ Settings          │  │  │                                 │ │
│  │ Quick Add (+)      │  │  │                                 │ │
│  └───────────────────┘  │  └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Page Types

**Dashboard (Home)**
- Hero stats row: Today's orders, revenue, pending tasks, low stock alerts
- Two-column layout below: Recent orders (left), Quick actions + alerts (right)
- Full-width chart section: Revenue over time, orders by product category

**List Pages (Orders, Products, Ingredients, Stock, Packaging)**
- Header with page title, search bar, filter dropdowns, "Add New" button
- Table view with sortable columns, pagination
- Bulk actions bar when items selected
- Slide-out drawer for quick view/edit

**Detail Pages**
- Full-width header with entity name, status badge, key actions
- Tabbed content sections (Overview, History, Settings)
- Related entities shown in side panel or tabs

**Finance Pages**
- Large data visualization area (charts)
- Filterable transaction table
- Summary cards with key metrics

### Responsive Strategy
- **≥1280px**: Full sidebar + content
- **1024-1279px**: Collapsible sidebar (icons only), expandable on hover
- **768-1023px**: Hidden sidebar with hamburger menu, full-width content
- **<768px**: Mobile-optimized, stacked layouts, bottom navigation

---

## 4. Features & Interactions

### 4.1 Dashboard Overview

**Stats Cards Row**
- Today's Orders: Count with trend arrow vs. yesterday
- Today's Revenue: Currency formatted with trend
- Pending Orders: Count with urgency indicator
- Low Stock Alerts: Count linking to filtered stock view

**Recent Orders Widget**
- Last 5 orders with status badge, customer name, total, time
- Click to expand inline or navigate to full order
- "View All Orders" link

**Quick Actions Panel**
- "New Order" button
- "Quick Stock Check" button
- "Add Product" button

**Alerts Panel**
- Low stock warnings (ingredients below threshold)
- Orders needing attention (status overdue)
- Expired packaging notifications

**Revenue Chart**
- Line chart showing daily/weekly/monthly revenue
- Toggle between views
- Hover to see exact values

**Orders by Category**
- Donut chart showing product category distribution
- Legend with percentages

### 4.2 Orders Management

**Order List View**
- Columns: Order #, Customer, Items, Total, Status, Date, Actions
- Status badges: Pending, Confirmed, In Progress, Ready, Completed, Cancelled
- Filters: Status, Date Range, Customer Search
- Sort by any column
- Pagination (20 per page, configurable)

**Order Detail View**
- Header: Order #, status badge, date, customer info
- Items list: Product, quantity, unit price, line total
- Totals: Subtotal, packaging cost, total
- Notes section
- Status history timeline
- Actions: Update status, Add note, Print receipt, Cancel

**Order Status Flow**
```
Pending → Confirmed → In Progress → Ready → Completed
                 ↓
              Cancelled
```

**Create/Edit Order**
- Customer search or quick-add
- Product selector with live search
- Quantity input with stock validation
- Packaging selection
- Notes field
- Auto-calculate totals

### 4.3 Products Management

**Product List View**
- Grid or table toggle
- Columns: Image, Name, Category, Price, Cost, Margin %, Status, Actions
- Filters: Category, Status (Active/Discontinued), Price Range
- Categories: Bread, Pastries, Cakes, Cookies, Seasonal, Special

**Product Detail View**
- Header: Image, name, category, status badge
- Pricing section: Current price, price history table
- Cost section: Ingredient costs, packaging cost, total cost, margin
- Ingredients breakdown: List of ingredients with quantities used
- Sales stats: Total sold, revenue generated, avg per week
- Allergen information
- Image gallery

**Create/Edit Product**
- Name, description (rich text)
- Category selector
- Image upload with crop
- Pricing: Selling price, auto-calculate from costs or manual
- Ingredient quantities (search & select ingredients, specify amount)
- Packaging default
- Allergens multi-select
- Status toggle

**Price History**
- Table: Date, Old Price, New Price, Reason, Changed By
- Visual chart of price over time
- Export functionality

### 4.4 Ingredients Management

**Ingredient List View**
- Columns: Name, Unit, Current Stock, Reorder Point, Cost per Unit, Supplier, Actions
- Filters: Category, Supplier, Stock Status (In Stock, Low, Out)
- Group by category option

**Ingredient Detail View**
- Header: Name, category, current stock
- Stock history: Table of in/out movements with dates, quantities, reason
- Cost history: Table of price changes with dates
- Suppliers list with contact info
- Products using this ingredient (calculated)

**Ingredient Movements**
- Stock in: Add to inventory (quantity, cost, supplier, date, notes)
- Stock out: Remove from inventory (quantity, reason, linked order optional)
- Adjustment: Correct inventory (quantity, reason, notes)

**Create/Edit Ingredient**
- Name, description
- Category (Flour, Sugar, Eggs, Dairy, Fruits, Nuts, Flavorings, etc.)
- Unit of measurement (kg, g, L, mL, pcs, dozen)
- Current stock level
- Reorder point (auto-alert threshold)
- Cost per unit
- Supplier selection
- Allergen info

**Stock Alerts**
- Dashboard widget showing low stock
- Automatic notification when below reorder point
- Suggested reorder quantity based on usage rate

### 4.5 Stock Management

**Stock Overview**
- Combined view of all ingredients with stock levels
- Visual indicators: Green (>50% of reorder point), Yellow (25-50%), Red (<25%)
- Filter by category, supplier
- Bulk actions: Export, Print labels

**Stock Movements Log**
- Chronological list of all stock changes
- Filter by: Date range, Ingredient, Movement type, Reason
- Running balance shown
- Export to CSV

**Stocktake Feature**
- Start stocktake session
- Physical count entry for each ingredient
- Discrepancy highlighting (expected vs. actual)
- Approve/adjust counts
- Generate adjustment report

### 4.6 Packaging Management

**Packaging List View**
- Columns: Name, Type, Dimensions, Cost per Unit, Current Stock, Min Stock, Actions
- Types: Boxes, Bags, Wraps, Labels, Containers, Other
- Filters: Type, Stock Status

**Packaging Detail View**
- Header: Name, type, current stock
- Stock history
- Cost history
- Products using this packaging

**Create/Edit Packaging**
- Name, type
- Dimensions (optional)
- Cost per unit
- Current stock
- Minimum stock level (for alerts)
- Supplier info

### 4.7 Finance & Reporting

**Financial Dashboard**
- Date range selector (Today, This Week, This Month, Custom)
- Key metrics cards:
  - Total Revenue
  - Total Costs (ingredients + packaging)
  - Gross Profit
  - Profit Margin %
- Revenue vs. Costs line chart
- Profit breakdown by category (donut chart)

**Income/Expense Tracking**
- Income: Order revenue, Other income
- Expenses: Ingredient purchases, Packaging purchases, Other expenses
- Manual entry for non-order expenses
- Category tags

**Balance Sheet**
- Assets: Current stock value, Cash, Accounts receivable
- Liabilities: Accounts payable, Loans
- Equity: Owner's investment, Retained earnings, Current profit/loss

**Profit & Loss Statement**
- Revenue section (by product category)
- Cost of Goods Sold (ingredient costs + packaging costs)
- Gross Profit
- Operating expenses (future)
- Net Profit

**Reports**
- Sales by product report
- Sales by day/week/month report
- Ingredient usage report
- Margin analysis report
- Export to PDF/CSV

### 4.8 Quick Add Menu

Floating action button (+) in sidebar that opens:
- New Order
- New Product
- New Ingredient
- New Packaging Type
- Record Stock In
- Record Stock Out
- Record Expense
- Record Income

---

## 5. Component Inventory

### Navigation Components

**Sidebar**
- States: Expanded (240px), Collapsed (64px icons only), Hidden (mobile)
- Logo at top with brand name
- Nav items with icons, labels, active state highlight
- Collapse toggle button at bottom
- Quick Add FAB
- Subtle grain texture background

**Sidebar Nav Item**
- States: Default, Hover (bg lighten), Active (accent bg + left border), Disabled
- Icon + label, tooltip when collapsed
- Badge for counts (pending orders, low stock)

**Breadcrumb**
- Home > Section > Page
- Clickable links
- Current page not linked

**User Menu**
- Avatar, name, role
- Dropdown: Profile, Settings, Logout

### Data Display

**Stat Card**
- Icon (colored circle bg), label, value (large), trend indicator
- Hover: subtle lift shadow
- Click: navigates to detail view

**Data Table**
- Header row with sort indicators
- Row hover highlight
- Checkbox column for bulk select
- Action buttons (view, edit, delete)
- Empty state with illustration
- Loading state with skeleton rows
- Pagination controls

**Table Row**
- States: Default, Hover (bg change), Selected (accent bg), Disabled (muted)

**Badge**
- Variants: Success (green), Warning (amber), Danger (red), Info (blue), Neutral (gray)
- Sizes: Small (inline), Default

**Price Display**
- Currency symbol
- Thousands separator
- Optional decimal places
- Negative values in parentheses

### Form Components

**Input Field**
- Label (required indicator)
- Input with placeholder
- Help text below
- Error state: red border, error message
- Disabled state: muted, not editable

**Select Dropdown**
- Searchable option
- Multi-select variant
- Clear button
- Placeholder

**Number Input**
- Increment/decrement buttons
- Min/max validation
- Currency formatting option

**Date Picker**
- Calendar popup
- Range selection support
- Quick presets (Today, This Week, etc.)

**Search Input**
- Magnifying glass icon
- Clear button
- Debounced search
- Loading indicator during search

**Checkbox / Toggle**
- Checkbox for multi-select
- Toggle for on/off settings
- Disabled state

**Textarea**
- Auto-resize option
- Character count
- Max length

### Feedback Components

**Toast Notification**
- Types: Success, Error, Warning, Info
- Auto-dismiss (5s)
- Manual dismiss
- Stacked when multiple
- Position: top-right

**Modal Dialog**
- Overlay with backdrop blur
- Header with title + close button
- Body content
- Footer with actions
- Sizes: Small (400px), Medium (600px), Large (800px)

**Slide-out Drawer**
- Slides from right
- Full height
- Overlay backdrop
- Close button
- Used for quick view, filters

**Confirmation Dialog**
- Icon (warning/danger)
- Title, message
- Cancel + Confirm buttons
- Destructive actions in red

**Loading States**
- Spinner: For buttons, small areas
- Skeleton: For content areas, tables
- Progress bar: For file uploads, long operations

### Chart Components

**Line Chart**
- Multiple series support
- Tooltip on hover
- Legend
- Responsive sizing
- Time range selector

**Bar Chart**
- Vertical/horizontal variants
- Stacked option
- Comparison mode

**Donut Chart**
- Center label with total
- Legend with percentages
- Hover highlights segment

**Area Chart**
- Gradient fill
- Overlaid with other series

---

## 6. Technical Approach

### Stack
- **Framework**: Next.js 16 with App Router
- **Database**: SQLite with Prisma ORM (for local development, easy to swap to PostgreSQL)
- **State Management**: Zustand for client state, React Query patterns for server state
- **Styling**: Tailwind CSS with custom theme
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Prisma Data Model

```prisma
// Core entities

model Product {
  id            String    @id @default(cuid())
  name          String
  description   String?
  category      ProductCategory
  status        ProductStatus @default(ACTIVE)
  imageUrl      String?
  allergens     String[]  // JSON array of allergen names
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Pricing
  priceHistory  PriceHistory[]
  
  // Relations
  ingredients   ProductIngredient[]
  orderItems    OrderItem[]
}

model PriceHistory {
  id          String   @id @default(cuid())
  productId   String
  price       Decimal  @db.Decimal(10, 2)
  effectiveDate DateTime @default(now())
  reason      String?
  product     Product  @relation(fields: [productId], references: [id])
}

model Ingredient {
  id              String   @id @default(cuid())
  name            String
  category        IngredientCategory
  unit            String   // kg, g, L, mL, pcs, dozen
  currentStock   Decimal  @default(0) @db.Decimal(10, 5)
  reorderPoint    Decimal  @db.Decimal(10, 5)
  costPerUnit     Decimal  @db.Decimal(10, 4)
  supplier        String?
  supplierContact String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  // History
  stockMovements  StockMovement[]
  priceHistory    IngredientPriceHistory[]
  products       ProductIngredient[]
}

model StockMovement {
  id           String   @id @default(cuid())
  ingredientId String
  type         MovementType
  quantity     Decimal  @db.Decimal(10, 5)
  reason       String?
  reference    String?  // Optional link to order
  createdAt    DateTime @default(now())
  
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
}

model IngredientPriceHistory {
  id           String   @id @default(cuid())
  ingredientId String
  costPerUnit  Decimal  @db.Decimal(10, 4)
  effectiveDate DateTime @default(now())
  supplier     String?
  
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
}

model ProductIngredient {
  id           String   @id @default(cuid())
  productId    String
  ingredientId String
  quantity     Decimal  @db.Decimal(10, 5)  // Amount needed per unit of product
  
  product      Product   @relation(fields: [productId], references: [id])
  ingredient   Ingredient @relation(fields: [ingredientId], references: [id])
  
  @@unique([productId, ingredientId])
}

model Packaging {
  id           String   @id @default(cuid())
  name         String
  type         PackagingType
  dimensions   String?  // L x W x H
  costPerUnit  Decimal  @db.Decimal(10, 4)
  currentStock Int      @default(0)
  minStock     Int      @default(0)
  supplier     String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  priceHistory PackagingPriceHistory[]
  orderItems   OrderItem[]
}

model PackagingPriceHistory {
  id           String   @id @default(cuid())
  packagingId  String
  costPerUnit  Decimal  @db.Decimal(10, 4)
  effectiveDate DateTime @default(now())
  
  packaging    Packaging @relation(fields: [packagingId], references: [id])
}

model Order {
  id          String      @id @default(cuid())
  orderNumber String      @unique
  customerName String
  customerContact String?
  status      OrderStatus @default(PENDING)
  notes       String?
  subtotal    Decimal     @db.Decimal(10, 2)
  packagingCost Decimal   @default(0) @db.Decimal(10, 2)
  total       Decimal     @db.Decimal(10, 2)
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
  completedAt DateTime?
  
  items       OrderItem[]
  statusHistory OrderStatusHistory[]
}

model OrderItem {
  id         String  @id @default(cuid())
  orderId    String
  productId  String
  quantity   Int
  unitPrice  Decimal @db.Decimal(10, 2)
  totalPrice Decimal @db.Decimal(10, 2)
  packagingId String?
  
  order      Order    @relation(fields: [orderId], references: [id])
  product    Product  @relation(fields: [productId], references: [id])
  packaging  Packaging? @relation(fields: [packagingId], references: [id])
}

model OrderStatusHistory {
  id        String      @id @default(cuid())
  orderId   String
  status    OrderStatus
  note      String?
  createdAt DateTime    @default(now())
  
  order     Order       @relation(fields: [orderId], references: [id])
}

model Transaction {
  id          String          @id @default(cuid())
  type        TransactionType
  category    String
  amount      Decimal         @db.Decimal(10, 2)
  description String?
  date        DateTime        @default(now())
  reference   String?         // Link to order or expense receipt
}

// Enums
enum ProductCategory {
  BREAD
  PASTRIES
  CAKES
  COOKIES
  SEASONAL
  SPECIAL
}

enum ProductStatus {
  ACTIVE
  DISCONTINUED
}

enum IngredientCategory {
  FLOUR
  SUGAR
  EGGS
  DAIRY
  FRUITS
  NUTS
  FLAVORINGS
  RAISING_AGENTS
  FATS
  SALT
  OTHER
}

enum MovementType {
  STOCK_IN
  STOCK_OUT
  ADJUSTMENT
  WASTE
}

enum PackagingType {
  BOXES
  BAGS
  WRAPS
  LABELS
  CONTAINERS
  OTHER
}

enum OrderStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  READY
  COMPLETED
  CANCELLED
}

enum TransactionType {
  INCOME
  EXPENSE
}
```

### API Routes Structure

```
/api/
├── products/
│   ├── GET          - List products (with filters, pagination)
│   ├── POST         - Create product
│   └── [id]/
│       ├── GET      - Get product detail
│       ├── PUT      - Update product
│       ├── DELETE   - Delete product
│       └── prices   - Price history
│
├── ingredients/
│   ├── GET          - List ingredients
│   ├── POST         - Create ingredient
│   └── [id]/
│       ├── GET      - Get ingredient detail
│       ├── PUT      - Update ingredient
│       ├── DELETE   - Delete ingredient
│       ├── movements - Stock movements
│       ├── prices    - Price history
│       └── stock     - Update stock level
│
├── packaging/
│   ├── GET          - List packaging
│   ├── POST         - Create packaging
│   └── [id]/
│       ├── GET      - Get packaging detail
│       ├── PUT      - Update packaging
│       └── prices   - Price history
│
├── orders/
│   ├── GET          - List orders
│   ├── POST         - Create order
│   └── [id]/
│       ├── GET      - Get order detail
│       ├── PUT      - Update order
│       ├── PATCH    - Update status
│       └── status   - Status history
│
├── transactions/
│   ├── GET          - List transactions
│   ├── POST         - Create transaction
│   └── [id]/
│       ├── GET      - Get transaction detail
│       └── PUT      - Update transaction
│
├── reports/
│   ├── revenue      - Revenue report
│   ├── profit       - Profit & loss
│   ├── ingredients  - Ingredient usage
│   ├── sales        - Sales by product
│   └── stock        - Stock summary
│
└── dashboard/
    ├── stats        - Dashboard statistics
    ├── recent-orders
    └── alerts       - Low stock, pending orders
```

### File Structure

```
src/
├── app/
│   ├── (admin)/
│   │   ├── layout.tsx         # Admin layout with sidebar
│   │   ├── page.tsx           # Dashboard
│   │   ├── orders/
│   │   │   ├── page.tsx       # Orders list
│   │   │   └── [id]/page.tsx  # Order detail
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── ingredients/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── stock/
│   │   │   └── page.tsx
│   │   ├── packaging/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── finance/
│   │       ├── page.tsx
│   │       └── reports/page.tsx
│   └── api/
│       └── [rest of API routes]
├── components/
│   ├── admin/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── ui/
│   │   │   ├── DataTable.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Drawer.tsx
│   │   │   └── ... (more)
│   │   ├── forms/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── IngredientForm.tsx
│   │   │   ├── OrderForm.tsx
│   │   │   └── ... (more)
│   │   └── charts/
│   │       ├── RevenueChart.tsx
│   │       ├── CategoryDonut.tsx
│   │       └── ... (more)
│   └── shared/
│       └── ... (existing shared components)
├── lib/
│   ├── prisma.ts           # Prisma client
│   ├── utils.ts            # Existing utilities
│   └── calculations.ts     # Cost/margin calculations
├── prisma/
│   ├── schema.prisma
│   └── seed.ts             # Seed data
└── types/
    └── index.ts            # TypeScript types
```

---

## 7. Implementation Phases

### Phase 1: Foundation
- Set up Prisma with SQLite
- Create database schema
- Build admin layout (sidebar, header)
- Create base UI components
- Build dashboard page with stats

### Phase 2: Core CRUD
- Products management (full CRUD)
- Ingredients management (full CRUD)
- Packaging management (full CRUD)
- Orders management (full CRUD)

### Phase 3: Inventory & Stock
- Stock movements tracking
- Stock level calculations
- Low stock alerts
- Ingredient cost auto-calculation

### Phase 4: Finance
- Transaction recording
- Revenue tracking
- Cost tracking
- Basic profit/loss reports

### Phase 5: Polish
- Price history for all entities
- Supplier management
- Advanced reporting
- Data export (CSV/PDF)

---

## 8. Seed Data

### Sample Products
- Sourdough Loaf (Bread) - £4.50
- Croissant (Pastries) - £2.80
- Blueberry Muffin (Pastries) - £3.20
- Victoria Sponge (Cakes) - £18.00
- Chocolate Chip Cookies (Cookies) - £2.50 each or £12.00 for 6
- Seasonal: Hot Cross Buns (Easter) - £3.00

### Sample Ingredients
- Strong White Flour (kg)
- Wholemeal Flour (kg)
- Caster Sugar (kg)
- Brown Sugar (kg)
- Free-range Eggs (dozen)
- Butter (kg)
- Fresh Yeast (g)
- Salt (kg)
- Milk (L)
- Chocolate Chips (kg)
- Blueberries (kg)
- Vanilla Extract (L)

### Sample Packaging
- Brown Paper Bag (Small) - for pastries
- Bread Bag - for loaves
- Cake Box 8" - for cakes
- Cellophane Wrap - for cookies
- Price Labels

---

## 9. Future Considerations (Not in Scope)

- Customer accounts and order history
- Online ordering for customers
- Email/SMS notifications
- Barcode/QR code scanning
- Multi-location support
- Staff management and permissions
- Recipe management with instructions
- Waste tracking
- Supplier purchase orders