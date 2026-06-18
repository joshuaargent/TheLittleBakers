# The Little Bakers - Design System

> A complete design system for The Little Bakers brand. High contrast, playful yet clean aesthetic.

---

## Brand Essence

- **Personality:** Playful, friendly, cosy, trustworthy — "small local bakery with care"
- **Visual Feel:** High contrast (black + bright pastels), soft curves, minimal clutter, clear hierarchy
- **Primary Use:** Social graphics, posters, and website

---

## Color System

### Core Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#000000` | Primary background, hero sections, key panels |
| `--color-bg-secondary` | `#111111` | Secondary backgrounds, cards |
| `--color-bg-card` | `#1A1A1A` | Card backgrounds |
| `--color-bg-elevated` | `#222222` | Elevated surfaces, modals |

#### Brand Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-pink` | `#FF5C8A` | CTAs, highlights, small icons, hover states |
| `--color-pink-hover` | `#E64F7A` | Hover state for pink |
| `--color-pink-light` | `rgba(255,92,138,0.15)` | Subtle pink backgrounds |
| `--color-yellow` | `#FFD45A` | Secondary buttons, badges, highlights |
| `--color-yellow-hover` | `#E5BF52` | Hover state for yellow |
| `--color-turquoise` | `#3ED6C4` | Links, accents, decorative elements |
| `--color-turquoise-hover` | `#35C2B3` | Hover state for turquoise |

#### Soft Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-cream` | `#FFEFD5` | Card backgrounds, tags, dividers |
| `--color-beige` | `#F5D7A1` | Script headings, warm accents |

#### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-text` | `#FFFFFF` | Primary text, body copy |
| `--color-text-muted` | `#D0D0D0` | Secondary text, labels |
| `--color-text-subtle` | `#888888` | Helper text, tertiary info |

#### Semantic Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-success` | `#3ED6C4` | Success states (turquoise) |
| `--color-warning` | `#FFD45A` | Warning states (yellow) |
| `--color-danger` | `#FF6B6B` | Error states |
| `--color-info` | `#3ED6C4` | Informational (turquoise) |

#### Borders

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-border` | `#333333` | Default borders |
| `--color-border-subtle` | `#222222` | Subtle dividers |

---

## Typography

### Font Families

```css
/* Display / Script - For logo-like headings */
--font-display: "Pacifico", "Dancing Script", system-ui, cursive;

/* Body / UI - For all readable text */
--font-body: "Poppins", system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
```

### Type Scale

| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Logo/Hero | `--font-display` | ~2.5rem | — | `--color-cream` |
| H1 | System | clamp(2rem, 5vw, 2.5rem) | 600 | `--color-text` |
| H2 | System | clamp(1.5rem, 4vw, 1.75rem) | 600 | `--color-text` |
| H3 | System | clamp(1.25rem, 3vw, 1.4rem) | 600 | `--color-text` |
| Body | `--font-body` | 1rem | 400 | `--color-text` |
| Small | `--font-body` | 0.875rem | 400 | `--color-text-muted` |
| XS | `--font-body` | 0.75rem | 400 | `--color-text-subtle` |

### Usage

```tsx
// Script/Display heading
<h1 className="font-[family-name:var(--font-display)] text-[var(--color-cream)]">
  The Little Bakers
</h1>

// Standard heading
<h2>Section Title</h2>

// Body text
<p>Delicious homemade treats made with love.</p>

// Muted label
<span className="text-[var(--color-text-muted)]">Category</span>
```

---

## Spacing & Layout

### Container Sizes

| Size | Max Width | Use Case |
|------|-----------|----------|
| `sm` | 768px | Narrow content, forms |
| `default` | 1024px | Standard content |
| `lg` | 1152px | Wider sections |
| `xl` | 1280px | Maximum content |
| `full` | 100% | Full-width sections |

### Global Spacing

```css
--spacing-section: 4rem;   /* Between major sections */
--spacing-container: 75rem; /* Container max-width */
```

### Section Padding

```tsx
<section className="py-12 md:py-16 lg:py-20">
  {/* Section content */}
</section>
```

---

## Border Radius

```css
--radius-sm: 0.5rem;     /* 8px - small elements */
--radius-md: 0.75rem;    /* 12px - inputs */
--radius-lg: 1rem;        /* 16px - cards */
--radius-xl: 1.5rem;     /* 24px - large cards */
--radius-card: 1rem;      /* Card default */
--radius-pill: 9999px;    /* Pills, buttons */
```

---

## Shadows

```css
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 16px rgba(0, 0, 0, 0.35);
--shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.4);
--shadow-card: 0 4px 20px rgba(0, 0, 0, 0.35);

/* Glow effects */
--shadow-glow-pink: 0 0 20px rgba(255, 92, 138, 0.4);
--shadow-glow-yellow: 0 0 20px rgba(255, 212, 90, 0.4);
--shadow-glow-turquoise: 0 0 20px rgba(62, 214, 196, 0.4);
```

---

## Buttons

### Button Variants

```tsx
import { Button } from '@/components/ui/Button';

// Primary CTA - Pink pill
<Button variant="primary">Order Now</Button>

// Secondary - Yellow pill
<Button variant="secondary">View Menu</Button>

// Outline - Cream outline pill
<Button variant="outline">Learn More</Button>

// Ghost - Text only with cream
<Button variant="ghost">Cancel</Button>

// Link - Turquoise text link
<Button variant="link">Read more</Button>

// Danger - Red for destructive actions
<Button variant="danger">Delete</Button>
```

### Button Sizes

| Size | Height | Padding | Use |
|------|--------|---------|-----|
| `sm` | 36px | px-4 | Compact actions |
| `md` | 44px | px-6 | Default |
| `lg` | 56px | px-8 | Primary CTAs |
| `icon` | 40px | — | Icon buttons |

### Button States

```tsx
// Loading state
<Button isLoading>Processing...</Button>

// With icons
<Button leftIcon={<CartIcon />}>Add to Cart</Button>
<Button rightIcon={<ArrowRight />}>Continue</Button>
```

---

## Cards

### Card Variants

```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

// Dark card (default)
<Card>
  <CardHeader>
    <CardTitle>Chocolate Croissant</CardTitle>
  </CardHeader>
  <CardContent>
    Buttery, flaky layers with dark chocolate.
  </CardContent>
</Card>

// Cream card
<Card variant="cream">
  {/* ... */}
</Card>

// Elevated card
<Card variant="elevated">
  {/* ... */}
</Card>

// Card with hover effect
<Card hover>
  {/* Lifts on hover */}
</Card>
```

### Card Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'dark' \| 'cream' \| 'elevated'` | `'dark'` | Background style |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Internal padding |
| `hover` | `boolean` | `false` | Enable lift on hover |

---

## Forms

### Input

```tsx
import { Input } from '@/components/ui/Input';

// Basic input
<Input label="Email" type="email" placeholder="you@example.com" />

// With hint
<Input label="Password" type="password" hint="Must be 8+ characters" />

// With error
<Input label="Email" error="Email is required" />

// Full example
<Input
  label="Full Name"
  type="text"
  placeholder="Jane Doe"
  error={errors.name}
  {...register('name')}
/>
```

### Textarea

```tsx
import { Textarea } from '@/components/ui/Textarea';

<Textarea
  label="Special Requests"
  placeholder="Any allergies or dietary requirements?"
  rows={4}
/>
```

### Form Input Styling

| Element | Style |
|---------|-------|
| Background | `--color-bg-secondary` (`#111111`) |
| Border | `--color-border` (`#333333`) |
| Border radius | `--radius-md` (12px) |
| Focus | Pink ring (`--color-pink`) |
| Text | `--color-text` (`#FFFFFF`) |
| Label | `--color-text-muted` |
| Error | `--color-danger` |

---

## Links

```tsx
// Default link (turquoise)
<a href="/menu">View Menu</a>

// With hover underline
<a href="/about" className="hover:underline">About Us</a>
```

| State | Color |
|-------|-------|
| Default | `--color-turquoise` |
| Hover | `--color-turquoise-hover` |

---

## Layout Components

### Container

```tsx
import { Container } from '@/components/layout/Container';

// Standard content
<Container>...</Container>

// Narrow content (forms, etc.)
<Container size="sm">...</Container>

// Wide sections
<Container size="lg">...</Container>
```

### Navbar

- Fixed position at top
- Black background with blur on scroll
- Logo in `--font-display` with cream color
- Navigation links in pill style
- Mobile hamburger menu

### Footer

- Black secondary background
- 4-column grid layout
- Social icons with pink hover
- "Made with ♥" using pink heart

---

## Animations

### Utility Classes

```tsx
// Fade in
<div className="animate-fade-in">...</div>

// Slide up
<div className="animate-slide-up">...</div>

// Scale in
<div className="animate-scale-in">...</div>

// Soft bounce
<div className="animate-bounce-soft">...</div>

// Pulse glow (pink)
<div className="animate-pulse-glow">...</div>
```

### Staggered Animations

```tsx
<div className="animate-slide-up stagger-1">First</div>
<div className="animate-slide-up stagger-2">Second</div>
<div className="animate-slide-up stagger-3">Third</div>
```

### Transition Tokens

```css
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;
--transition-bounce: 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
```

---

## Gradient Utilities

```tsx
// Brand gradient (pink to yellow)
<div className="bg-gradient-brand">...</div>

// Subtle dark gradient
<div className="bg-gradient-subtle">...</div>

// Glow effects
<div className="glow-pink">...</div>
<div className="glow-yellow">...</div>
<div className="glow-turquoise">...</div>

// Text gradient
<h1 className="text-gradient-pink">Fancy Title</h1>
```

---

## Responsive Breakpoints

| Breakpoint | Width | Description |
|------------|-------|-------------|
| Mobile | < 640px | Phone screens |
| Tablet | 640px - 1023px | Tablet portrait |
| Desktop | ≥ 1024px | Desktop/laptop |

### Common Responsive Patterns

```tsx
// Stack on mobile, side-by-side on desktop
<div className="flex flex-col lg:flex-row">
  <div>Content</div>
  <div>Image</div>
</div>

// Full-width buttons on mobile
<Button className="w-full md:w-auto">Order Now</Button>

// Text alignment
<p className="text-center lg:text-left">...</p>
```

---

## Component Examples

### Hero Section

```tsx
<section className="py-12 md:py-16 lg:py-20">
  <Container>
    <div className="flex flex-col lg:flex-row items-center gap-12">
      {/* Text Content */}
      <div className="flex-1 text-center lg:text-left">
        <h1 className="font-[family-name:var(--font-display)] text-[var(--color-cream)]">
          Fresh from the Oven
        </h1>
        <p className="text-[var(--color-text-muted)] mt-4 max-w-xl">
          Handcrafted with love, served with a smile.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button variant="primary" size="lg">Order Now</Button>
          <Button variant="outline">View Menu</Button>
        </div>
      </div>
      
      {/* Image */}
      <div className="flex-shrink-0">
        <div className="rounded-[var(--radius-card)] border border-[var(--color-cream)] overflow-hidden">
          <img src="/hero.jpg" alt="Fresh bread" />
        </div>
      </div>
    </div>
  </Container>
</section>
```

### Product Card

```tsx
<Card hover className="overflow-hidden">
  <img 
    src="/croissant.jpg" 
    alt="Chocolate Croissant"
    className="w-full h-48 object-cover"
  />
  <CardContent className="p-4">
    <CardTitle>Chocolate Croissant</CardTitle>
    <p className="text-[var(--color-text-muted)] text-sm mt-2">
      Buttery, flaky layers with dark chocolate filling.
    </p>
    <div className="flex items-center justify-between mt-4">
      <span className="text-[var(--color-yellow)] font-semibold">$4.50</span>
      <Button size="sm" variant="primary">Add</Button>
    </div>
  </CardContent>
</Card>
```

### Contact Form

```tsx
<Card variant="dark" padding="lg" className="max-w-md mx-auto">
  <CardHeader>
    <CardTitle>Get in Touch</CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    <Input label="Name" placeholder="Your name" />
    <Input label="Email" type="email" placeholder="you@example.com" />
    <Textarea label="Message" placeholder="How can we help?" />
    <Button className="w-full">Send Message</Button>
  </CardContent>
</Card>
```

---

## CSS Variables Reference

```css
:root {
  /* Colors */
  --color-bg: #000000;
  --color-pink: #FF5C8A;
  --color-yellow: #FFD45A;
  --color-turquoise: #3ED6C4;
  --color-cream: #FFEFD5;
  --color-beige: #F5D7A1;
  --color-text: #FFFFFF;
  --color-text-muted: #D0D0D0;

  /* Fonts */
  --font-display: "Pacifico", "Dancing Script", cursive;
  --font-body: "Poppins", system-ui, sans-serif;

  /* Radius */
  --radius-card: 1rem;
  --radius-pill: 9999px;
}
```

---

## Implementation Notes

### For AI Agents

1. **Always use CSS variables** - Don't hardcode colors or spacing values
2. **Use existing components** - Don't recreate Button, Card, Input, etc.
3. **Follow type scale** - Use semantic headings, not arbitrary sizes
4. **Maintain contrast** - White text on black backgrounds
5. **Use brand colors intentionally** - Pink for CTAs, turquoise for links, yellow for prices/highlights

### For Developers

1. **Import fonts** - Pacifico and Poppins are loaded via Next.js font optimization
2. **No dark mode** - This is a single dark theme design
3. **Mobile-first** - Design for mobile, enhance for desktop
4. **Use Tailwind utilities** - Most spacing/typography uses Tailwind classes
5. **Check accessibility** - Ensure focus states and contrast ratios are maintained

---

## File Structure

```
src/
├── app/
│   └── globals.css          # Design tokens, base styles, utilities
├── components/
│   ├── layout/
│   │   ├── Container.tsx    # Layout container
│   │   ├── Navbar.tsx       # Navigation
│   │   └── Footer.tsx       # Footer
│   └── ui/
│       ├── Button.tsx       # Button component
│       ├── Card.tsx         # Card components
│       ├── Input.tsx        # Form input
│       └── Textarea.tsx     # Form textarea
└── lib/
    └── constants.ts         # Site configuration
```

---

*Last updated: 2024*
