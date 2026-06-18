// ============================================
// Site Configuration - The Little Bakers
// ============================================

export const siteConfig = {
  name: 'The Little Bakers',
  description: 'Handmade bakes crafted with love. Order online for collection or find us at local markets.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://thelittlebakers.com',
  ogImage: '/og-image.png',
  location: 'Surrey, United Kingdom',
  links: {
    youtube: 'https://youtube.com/@joshua_argent',
    github: 'https://github.com/joshuaargent',
    instagram: 'https://instagram.com/joshua_argent',
    facebook: 'https://facebook.com/joshua_argent',
    email: 'mailto:hello@thelittlebakers.com',
  },
  author: {
    name: 'The Little Bakers',
    bio: 'Handmade bakes crafted with love',
  },
};

// ============================================
// Metadata
// ============================================

export const meta = {
  title: 'The Little Bakers',
  description: 'Handmade bakes crafted with love. Order online for collection or find us at local markets.',
  keywords: ['bakery', 'bakes', 'cakes', 'pastries', 'Surrey'] as string[],
  siteName: 'The Little Bakers',
  twitter: '@thelittlebakers',
  instagramHandle: '@thelittlebakers',
};

// ============================================
// Navigation
// ============================================

export const mainNav = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const footerNav = {
  main: [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  content: [
    { label: 'Account', href: '/account' },
    { label: 'Cart', href: '/cart' },
  ],
  social: [
    { label: 'YouTube', href: siteConfig.links.youtube },
    { label: 'Instagram', href: siteConfig.links.instagram },
    { label: 'Facebook', href: siteConfig.links.facebook },
  ],
};

// ============================================
// Design Tokens
// ============================================

export const colors = {
  primary: '#FF5C8A',
  primaryHover: '#E64F7A',
} as const;

// ============================================
// Animation
// ============================================

export const transitions = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
  slower: '500ms ease',
} as const;

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4 },
  },
} as const;
