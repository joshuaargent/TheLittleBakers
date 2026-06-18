// ============================================
// Products Data - The Little Bakers
// ============================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  currentPrice: number;
  image: string;
  available: boolean;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'cakes',
    name: 'Cakes',
    slug: 'cakes',
    description: 'Delicious homemade cakes for every occasion',
    icon: '🎂',
  },
  {
    id: 'pastries',
    name: 'Pastries',
    slug: 'pastries',
    description: 'Buttery croissants and sweet pastries',
    icon: '🥐',
  },
  {
    id: 'breads',
    name: 'Breads',
    slug: 'breads',
    description: 'Freshly baked artisan breads',
    icon: '🍞',
  },
  {
    id: 'cookies',
    name: 'Cookies',
    slug: 'cookies',
    description: 'Crispy, chewy, and everything in between',
    icon: '🍪',
  },
  {
    id: 'seasonal',
    name: 'Seasonal',
    slug: 'seasonal',
    description: 'Limited edition treats',
    icon: '🎄',
  },
];

export const products: Product[] = [
  // Cakes
  {
    id: 'chocolate-fudge-cake',
    name: 'Chocolate Fudge Cake',
    slug: 'chocolate-fudge-cake',
    description: 'Rich, moist chocolate cake with layers of silky fudge frosting. A chocolate lover\'s dream.',
    category: 'cakes',
    currentPrice: 28.00,
    image: '/images/products/chocolate-fudge.jpg',
    available: true,
    featured: true,
  },
  {
    id: 'victoria-sponge',
    name: 'Victoria Sponge',
    slug: 'victoria-sponge',
    description: 'Classic British teatime cake with vanilla sponge, strawberry jam, and fresh cream.',
    category: 'cakes',
    currentPrice: 24.00,
    image: '/images/products/victoria-sponge.jpg',
    available: true,
    featured: true,
  },
  {
    id: 'carrot-cake',
    name: 'Carrot Cake',
    slug: 'carrot-cake',
    description: 'Moist carrot cake with walnuts, raisins, and tangy cream cheese frosting.',
    category: 'cakes',
    currentPrice: 26.00,
    image: '/images/products/carrot-cake.jpg',
    available: true,
    featured: false,
  },
  {
    id: 'cheesecake',
    name: 'New York Cheesecake',
    slug: 'new-york-cheesecake',
    description: 'Creamy, dense cheesecake with a buttery graham cracker crust.',
    category: 'cakes',
    currentPrice: 30.00,
    image: '/images/products/cheesecake.jpg',
    available: true,
    featured: false,
  },
  // Pastries
  {
    id: 'croissants',
    name: 'Butter Croissants',
    slug: 'butter-croissants',
    description: 'Flaky, buttery croissants baked fresh every morning. Perfect for breakfast.',
    category: 'pastries',
    currentPrice: 3.50,
    image: '/images/products/croissants.jpg',
    available: true,
    featured: true,
  },
  {
    id: 'pain-chocolat',
    name: 'Pain au Chocolat',
    slug: 'pain-au-chocolat',
    description: 'Buttery pastry wrapped around rich dark chocolate batons.',
    category: 'pastries',
    currentPrice: 4.00,
    image: '/images/products/pain-chocolat.jpg',
    available: true,
    featured: false,
  },
  {
    id: 'almond-croissant',
    name: 'Almond Croissant',
    slug: 'almond-croissant',
    description: 'Twice-baked croissant filled with almond frangipane and topped with flaked almonds.',
    category: 'pastries',
    currentPrice: 4.50,
    image: '/images/products/almond-croissant.jpg',
    available: true,
    featured: false,
  },
  {
    id: 'danish-pastries',
    name: 'Danish Pastries',
    slug: 'danish-pastries',
    description: 'Sweet pastry with various fruit and custard fillings.',
    category: 'pastries',
    currentPrice: 3.75,
    image: '/images/products/danish.jpg',
    available: true,
    featured: false,
  },
  // Breads
  {
    id: 'sourdough',
    name: 'Artisan Sourdough',
    slug: 'artisan-sourdough',
    description: 'Rustic sourdough loaf with a crispy crust and tangy, open crumb.',
    category: 'breads',
    currentPrice: 6.50,
    image: '/images/products/sourdough.jpg',
    available: true,
    featured: true,
  },
  {
    id: 'ciabatta',
    name: 'Ciabatta',
    slug: 'ciabatta',
    description: 'Italian-style bread with a soft interior and airy holes, perfect for sandwiches.',
    category: 'breads',
    currentPrice: 4.50,
    image: '/images/products/ciabatta.jpg',
    available: true,
    featured: false,
  },
  {
    id: 'baguette',
    name: 'French Baguette',
    slug: 'french-baguette',
    description: 'Classic French bread with a golden crust and light, chewy interior.',
    category: 'breads',
    currentPrice: 3.00,
    image: '/images/products/baguette.jpg',
    available: true,
    featured: false,
  },
  // Cookies
  {
    id: 'choc-chip-cookies',
    name: 'Chocolate Chip Cookies',
    slug: 'chocolate-chip-cookies',
    description: 'Giant, chewy cookies loaded with milk chocolate chips.',
    category: 'cookies',
    currentPrice: 2.50,
    image: '/images/products/choc-chip.jpg',
    available: true,
    featured: true,
  },
  {
    id: 'oatmeal-raisin',
    name: 'Oatmeal Raisin Cookies',
    slug: 'oatmeal-raisin-cookies',
    description: 'Hearty oatmeal cookies with sweet raisins and a hint of cinnamon.',
    category: 'cookies',
    currentPrice: 2.25,
    image: '/images/products/oatmeal.jpg',
    available: true,
    featured: false,
  },
];

export const featuredProducts = products.filter(p => p.featured);

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.category === categorySlug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}
