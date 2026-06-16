// ============================================
// The Little Bakers - Admin Dashboard Types
// ============================================

// Product Categories
export const PRODUCT_CATEGORIES = [
  'BREAD',
  'PASTRIES',
  'CAKES',
  'COOKIES',
  'SEASONAL',
  'SPECIAL',
] as const;

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

// Product Status
export const PRODUCT_STATUSES = ['ACTIVE', 'DISCONTINUED'] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

// Ingredient Categories
export const INGREDIENT_CATEGORIES = [
  'FLOUR',
  'SUGAR',
  'EGGS',
  'DAIRY',
  'FRUITS',
  'NUTS',
  'FLAVORINGS',
  'RAISING_AGENTS',
  'FATS',
  'SALT',
  'OTHER',
] as const;

export type IngredientCategory = (typeof INGREDIENT_CATEGORIES)[number];

// Packaging Types
export const PACKAGING_TYPES = [
  'BOXES',
  'BAGS',
  'WRAPS',
  'LABELS',
  'CONTAINERS',
  'OTHER',
] as const;

export type PackagingType = (typeof PACKAGING_TYPES)[number];

// Stock Movement Types
export const MOVEMENT_TYPES = [
  'STOCK_IN',
  'STOCK_OUT',
  'ADJUSTMENT',
  'WASTE',
] as const;

export type MovementType = (typeof MOVEMENT_TYPES)[number];

// Order Status
export const ORDER_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'READY',
  'COMPLETED',
  'CANCELLED',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

// Order Status Flow
export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
  IN_PROGRESS: ['READY', 'CANCELLED'],
  READY: ['COMPLETED', 'CANCELLED'],
  COMPLETED: [],
  CANCELLED: [],
};

// Transaction Types
export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

// Transaction Categories
export const INCOME_CATEGORIES = [
  'ORDER_REVENUE',
  'OTHER_INCOME',
] as const;

export const EXPENSE_CATEGORIES = [
  'INGREDIENTS',
  'PACKAGING',
  'UTILITIES',
  'SUPPLIES',
  'RENT',
  'WAGES',
  'MARKETING',
  'OTHER',
] as const;

export const TRANSACTION_CATEGORIES = [
  ...INGREDIENT_CATEGORIES,
  ...EXPENSE_CATEGORIES,
] as const;

export type TransactionCategory = (typeof TRANSACTION_CATEGORIES)[number];

// Allergens
export const ALLERGENS = [
  'Gluten',
  'Dairy',
  'Eggs',
  'Nuts',
  'Peanuts',
  'Soy',
  'Sesame',
  'Sulphites',
] as const;

export type Allergen = (typeof ALLERGENS)[number];

// Units
export const UNITS = ['kg', 'g', 'L', 'mL', 'pcs', 'dozen'] as const;
export type Unit = (typeof UNITS)[number];

// Formatters
export const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(cents / 100);
};

export const parseCurrencyToCents = (value: string): number => {
  const cleaned = value.replace(/[^0-9.-]/g, '');
  return Math.round(parseFloat(cleaned) * 100);
};

// Category Labels
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  BREAD: 'Bread',
  PASTRIES: 'Pastries',
  CAKES: 'Cakes',
  COOKIES: 'Cookies',
  SEASONAL: 'Seasonal',
  SPECIAL: 'Special',
};

export const INGREDIENT_CATEGORY_LABELS: Record<IngredientCategory, string> = {
  FLOUR: 'Flour',
  SUGAR: 'Sugar',
  EGGS: 'Eggs',
  DAIRY: 'Dairy',
  FRUITS: 'Fruits',
  NUTS: 'Nuts',
  FLAVORINGS: 'Flavorings',
  RAISING_AGENTS: 'Raising Agents',
  FATS: 'Fats',
  SALT: 'Salt',
  OTHER: 'Other',
};

export const PACKAGING_TYPE_LABELS: Record<PackagingType, string> = {
  BOXES: 'Boxes',
  BAGS: 'Bags',
  WRAPS: 'Wraps',
  LABELS: 'Labels',
  CONTAINERS: 'Containers',
  OTHER: 'Other',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  IN_PROGRESS: 'In Progress',
  READY: 'Ready',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  STOCK_IN: 'Stock In',
  STOCK_OUT: 'Stock Out',
  ADJUSTMENT: 'Adjustment',
  WASTE: 'Waste',
};

// Status Colors
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  READY: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export const PRODUCT_STATUS_COLORS: Record<ProductStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  DISCONTINUED: 'bg-gray-100 text-gray-800',
};

// Dashboard Stats
export interface DashboardStats {
  todayOrders: number;
  todayOrdersTrend: number;
  todayRevenue: number;
  todayRevenueTrend: number;
  pendingOrders: number;
  lowStockAlerts: number;
}

// Stock Level Indicators
export type StockLevel = 'good' | 'low' | 'critical' | 'out';

export const getStockLevel = (current: number, reorderPoint: number): StockLevel => {
  if (current <= 0) return 'out';
  if (current < reorderPoint * 0.25) return 'critical';
  if (current < reorderPoint) return 'low';
  return 'good';
};

export const STOCK_LEVEL_COLORS: Record<StockLevel, string> = {
  good: 'text-green-600',
  low: 'text-amber-600',
  critical: 'text-red-600',
  out: 'text-red-700 font-bold',
};

// ----- Site Configuration -----
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  location?: string;
  links: {
    youtube: string;
    github: string;
    instagram: string;
    facebook: string;
    strava: string;
    email: string;
  };
  author: {
    name: string;
    bio: string;
    avatar?: string;
  };
}

// ----- Navigation -----
export interface NavItem {
  label: string;
  href: string;
}

// ----- Component Props -----
export interface BaseProps {
  className?: string;
  children?: React.ReactNode;
}

export interface SectionProps extends BaseProps {
  id?: string;
  title?: string;
}

// ----- Form Types -----
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}
