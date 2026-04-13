# Design Guidelines

**Last Updated**: 2026-04-14
**Project**: DucLong06.github.io
**Aesthetic**: Soft Aurora (warm neutrals + aurora gradients)
**Purpose**: Design system, color tokens, typography, component patterns

## Design System Overview

Portfolio follows a **Soft Aurora** aesthetic — warm neutrals paired with aurora-inspired gradient accents (blues, teals, purples). All design values live in `src/styles/tokens.css` (single source of truth). Tailwind config extends from CSS variables; no hardcoded hex values in code.

## Color System

### Soft Aurora Palette

Defined in `src/styles/tokens.css`:

```css
:root {
  /* Neutrals */
  --color-cream: #faf8f3;        /* Page background */
  --color-ivory: #f5f1eb;        /* Card backgrounds */
  --color-taupe: #9d8b7e;        /* Muted text */
  --color-stone: #44403c;        /* Strong text */
  --color-black: #1a1a1a;        /* Text black */
  
  /* Aurora Accents */
  --color-aurora-blue: #3b82f6;
  --color-aurora-teal: #06b6d4;
  --color-aurora-violet: #8b5cf6;
  --color-aurora-pink: #ec4899;
  
  /* Semantic */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}
```

All design decisions prioritize:
- Warm, inviting feel (cream + ivory)
- Subtle aurora gradients (hero, accents)
- High contrast for accessibility
- Respects `prefers-color-scheme` system preference

### Tailwind Integration

Tailwind config extends from CSS vars:
```js
extend: {
  colors: {
    cream: 'var(--color-cream)',
    'aurora-blue': 'var(--color-aurora-blue)',
  },
  spacing: {
    xs: 'var(--space-xs)',
  },
}
```

Result: No hardcoded hex in component code.

## Typography

### Font Stack

| Element | Font | Source | Weight | Size |
|---------|------|--------|--------|------|
| Headings | Instrument Serif | @fontsource (self-hosted) | 400–700 | 2rem–4rem |
| Body | System fonts (fallback) | Platform native | 400 | 1rem |
| Code | `Monaco`, `Courier New` | System | 400 | 0.875rem |

@fontsource fonts are self-hosted in `public/fonts/` to avoid Google CDN latency.

### Sizing Scale (in tokens.css)

```css
:root {
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.5rem;     /* 24px */
  --font-size-2xl: 2rem;      /* 32px */
  --font-size-3xl: 3rem;      /* 48px */
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-loose: 1.75;
}
```

### Heading Hierarchy

```astro
<h1 class="font-serif text-4xl font-bold">Page Title</h1>
<h2 class="font-serif text-3xl font-bold">Section</h2>
<h3 class="font-serif text-2xl font-semibold">Subsection</h3>
<h4 class="font-bold text-lg">Small Heading</h4>
<p class="text-base leading-relaxed">Body text...</p>
```

Instrument Serif conveys sophistication; body text uses system fonts for performance.

## Icons

### FontAwesome 6

Primary icon library for all UI elements.

**Usage**:
```html
<i class="fa-solid fa-circle-check"></i>
<i class="fa-brands fa-github"></i>
```

**Coverage**: 8000+ icons available

**Size Variants**:
```css
.fa-xl { font-size: 2rem; }
.fa-lg { font-size: 1.33rem; }
.fa { font-size: 1rem; }  /* default */
.fa-sm { font-size: 0.875rem; }
.fa-xs { font-size: 0.75rem; }
```

### Linearicons

Alternative lightweight icon set (fallback).

**Usage**:
```html
<span class="lnr lnr-checkmark"></span>
<span class="lnr lnr-heart"></span>
```

### Custom Icons

For portfolio-specific icons, use inline SVG:

```html
<svg width="24" height="24" viewBox="0 0 24 24">
  <path d="..." fill="currentColor"/>
</svg>
```

## Component Patterns

### Buttons

**Primary Button** (CTAs, form submission):
```css
.btn--primary {
  background-color: var(--primary-color);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.btn--primary:hover {
  background-color: var(--accent-color);
}
```

**Secondary Button** (Less prominent actions):
```css
.btn--secondary {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.btn--secondary:hover {
  background-color: var(--primary-color);
  color: white;
}
```

### Cards

**Portfolio Item Card**:
```css
.portfolio-item {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.portfolio-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.15);
}
```

### Forms

**Input Field**:
```css
input[type="text"],
input[type="email"],
textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Roboto', sans-serif;
  transition: border-color 0.3s ease;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}
```

**Form Labels**:
```css
label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--secondary-color);
}
```

### Navigation

**Sticky Sidebar Nav**:
```css
#main-navigation {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: var(--light-bg);
  overflow-y: auto;
}

#main-navigation a {
  display: block;
  padding: 1rem;
  color: var(--secondary-color);
  text-decoration: none;
  transition: background-color 0.3s ease;
}

#main-navigation a:hover,
#main-navigation a.active {
  background-color: var(--primary-color);
  color: white;
}
```

## Spacing System

Consistent spacing scale (powers of 2):

```css
--spacing-xs: 0.25rem   /* 4px */
--spacing-sm: 0.5rem    /* 8px */
--spacing-md: 1rem      /* 16px */
--spacing-lg: 2rem      /* 32px */
--spacing-xl: 4rem      /* 64px */
--spacing-2xl: 8rem     /* 128px */
```

**Apply via**:
```css
margin: var(--spacing-md);
padding: var(--spacing-lg) var(--spacing-md);
gap: var(--spacing-sm);
```

## Layout Patterns

### Container

Standard max-width wrapper:

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-sm);
  }
}
```

### Grid Layouts

Flexible auto-fit grid for portfolio items:

```css
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
}
```

### Flexbox Utility

Common flex patterns:

```css
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.flex-col {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}
```

## Animations & Transitions

### Timing Curve

Standard easing for consistency:

```css
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
--easing-linear: linear;
--easing-ease: ease;
--easing-ease-in: ease-in;
--easing-ease-out: ease-out;
--easing-ease-in-out: ease-in-out;
```

### Common Animations

**Fade In**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}
```

**Slide In (from left)**:
```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideInLeft 0.4s ease-out;
}
```

**Hover Scale**:
```css
.scale-hover {
  transition: transform 0.3s ease;
}

.scale-hover:hover {
  transform: scale(1.05);
}
```

## Responsive Design

### Breakpoints

Mobile-first approach:

```css
/* Mobile (default) */
/* 0–640px */

/* Tablet */
@media (min-width: 641px) { ... }

/* Desktop */
@media (min-width: 1024px) { ... }

/* Large Desktop */
@media (min-width: 1280px) { ... }
```

### Responsive Image

Always use responsive images with fallback:

```html
<picture>
  <source srcset="img/hero-mobile.webp" media="(max-width: 640px)">
  <source srcset="img/hero-desktop.webp">
  <img src="img/hero-desktop.jpg" alt="Hero image" loading="lazy">
</picture>
```

## Accessibility

### Color Contrast

Ensure WCAG AA compliance (4.5:1 for normal text):

```css
/* Good contrast */
color: #333333;           /* Dark text */
background: #FFFFFF;      /* Light background */

/* Avoid low-contrast pairs */
color: #CCCCCC;           /* Too light */
background: #EEEEEE;      /* Not enough contrast */
```

### Focus States

Always provide visible focus indicators:

```css
a:focus,
button:focus,
input:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

### Semantic HTML

```html
<!-- Good -->
<button aria-label="Toggle theme">
  <i class="fa-solid fa-moon"></i>
</button>

<!-- Avoid -->
<div onclick="toggleTheme()">
  <span class="theme-icon"></span>
</div>
```

## Dark Mode Considerations

Current theme system supports dark variants:

```css
/* Light theme (default) */
body.theme-light {
  --bg: #FFFFFF;
  --text: #333333;
}

/* Dark theme (future) */
body.theme-dark {
  --bg: #1A1A1A;
  --text: #EEEEEE;
}
```

To implement system preference detection:

```javascript
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (prefersDark) {
  document.body.classList.add('theme-dark');
}
```

## Brand Voice

### Tone

- Professional but approachable
- Clear and concise
- Focused on capabilities, not hype
- Educational and transparent

### Messaging Patterns

```
"Build beautiful things with code"
"Explore my work and journey"
"Let's create something amazing together"
```

## Performance Guidelines

### Image Optimization

- JPEG for photos: 85% quality minimum
- PNG for graphics with transparency
- WebP for modern browsers (with JPEG fallback)
- Max file size: 200 KB per image

### CSS Performance

- Avoid deep nesting
- Use CSS Grid/Flexbox (not float)
- Minimize media query counts
- Leverage browser defaults

### JavaScript Performance

- Debounce scroll/resize handlers
- Cache DOM queries
- Minimize repaints/reflows
- Lazy-load non-critical scripts

## Design Debt

### Known Issues

- jQuery (3.2.1) is outdated—plan migration to vanilla ES6+
- Font file sizes could be optimized (Google Fonts subset)
- Some CSS could be refactored (duplicated rules in theme files)

### Future Improvements

- SCSS/CSS preprocessor for maintainability
- Design token system (Figma tokens or CSS-in-JS)
- Atomic design component library
- Automated accessibility testing

## Related Documentation

- [Code Standards](./code-standards.md) — CSS/JS conventions
- [System Architecture](./system-architecture.md) — Theme switching mechanism
- [Project Overview](./project-overview-pdr.md) — Design goals & constraints
