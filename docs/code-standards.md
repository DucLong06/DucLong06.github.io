# Code Standards & Conventions

**Last Updated**: 2026-04-14
**Applies To**: All code in DucLong06.github.io repository
**Status**: Current project practices (Astro 5 + React)

## Overview

This document describes coding conventions for the Astro 5 SSG + React islands portfolio. Emphasis: type safety (TS strict), content-first (Zod), minimal client JS, and Tailwind-first styling with design tokens.

## Core Principles

**Type Safety**: TypeScript strict mode enabled; all content validated with Zod.

**Content-First**: Markdown/YAML + schemas; content changes don't require code changes.

**Performance**: Ship zero JS by default; React islands load only when interactive.

**Tailwind-First**: All styles via Tailwind utilities; design tokens live in `tokens.css` (single source of truth).

## TypeScript & Astro Standards

### File Organization
- **Components**: `src/components/astro/*.astro` (zero-JS) + `src/components/react/*.tsx` (islands)
- **Pages**: `src/pages/*.astro` (routes auto-mapped)
- **Content**: `src/content/*.md` (with YAML frontmatter)
- **Schemas**: `src/content.config.ts` (Zod definitions)
- **Utilities**: `src/lib/*.ts` (build-time helpers)

### Naming Conventions

**Files**: kebab-case
```
src/components/astro/project-card.astro
src/components/react/liquid-shader.tsx
src/lib/github-stats.ts
```

**Components**: PascalCase
```tsx
export default function ProjectCard() { }
export default function LiquidShader({ props }) { }
```

**TypeScript**: Strict mode required
```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitAny": true
  }
}
```

### Zod Schema Example
```ts
import { z } from 'astro:content';

const projectSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string(),
  tech: z.array(z.string()),
  featured: z.boolean().default(false),
  publishedDate: z.date(),
});

export type Project = z.infer<typeof projectSchema>;
```

## Styling Standards (Tailwind + Design Tokens)

### Organization

1. **tokens.css** — Design token definitions (source of truth)
2. **globals.css** — Reset, base typography, transitions
3. **Tailwind utilities** — Applied directly in component templates
4. **Astro component styles** — Scoped `<style>` blocks (rare; prefer Tailwind)
5. **React component styles** — Tailwind className (via `clsx` if conditional)

### Design Tokens (tokens.css)

Define all colors, spacing, typography in CSS variables:
```css
:root {
  /* Soft Aurora palette */
  --color-cream: #faf8f3;
  --color-ivory: #f5f1eb;
  --color-aurora-blue: #3b82f6;
  --color-aurora-teal: #06b6d4;
  
  /* Spacing scale */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  
  /* Typography */
  --font-serif: 'Instrument Serif', serif;
  --font-sans: system-ui, sans-serif;
}
```

Tailwind config extends from these:
```js
// tailwind.config.js
extend: {
  colors: {
    primary: 'var(--color-aurora-blue)',
  },
  spacing: {
    xs: 'var(--space-xs)',
  },
}
```

### Tailwind-First Approach

```astro
<!-- Good -->
<div class="flex gap-4 py-6 px-4 bg-cream rounded-lg">
  <h2 class="font-serif text-2xl font-bold">Title</h2>
  <p class="text-sm text-gray-600">Description</p>
</div>

<!-- Avoid custom CSS when Tailwind class exists -->
<div style="display: flex; gap: 1rem;">...</div>
```

### Conditional Classes

Use `clsx` for conditional Tailwind:
```tsx
import clsx from 'clsx';

export function ProjectCard({ featured }: { featured: boolean }) {
  return (
    <div className={clsx(
      'p-4 rounded-lg border',
      featured ? 'border-amber-400 bg-yellow-50' : 'border-gray-200'
    )}>
      ...
    </div>
  );
}
```

### Astro-Scoped Styles

Only use `<style>` for animations or selectors Tailwind can't handle:
```astro
<div class="hero-section">
  <canvas class="shader-canvas"></canvas>
</div>

<style>
  .shader-canvas {
    animation: shimmer 3s ease-in-out infinite;
  }
  
  @keyframes shimmer {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }
</style>
```

### Responsive Design

Mobile-first via Tailwind breakpoints:
```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <ProjectCard />
</div>
```

### Reduced Motion

Respect user preference in all animations:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## React & TypeScript Standards

### File Organization

**React Components**: Functional components with hooks (no classes)
```tsx
// src/components/react/project-card.tsx
import { useState } from 'react';
import clsx from 'clsx';
import type { Project } from '@content';

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export default function ProjectCard({ project, featured }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className={clsx('p-4 rounded-lg', featured && 'border-amber-400')}>
      {project.title}
    </div>
  );
}
```

### Naming Conventions

**Variables**: camelCase
```ts
const projectCount = 15;
const isLoading = false;
```

**Functions**: camelCase (or PascalCase if component)
```ts
const handleClick = () => { };
const formatDate = (date: Date) => { };
export default function MyComponent() { }
```

**Types/Interfaces**: PascalCase
```ts
interface ProjectCardProps { }
type Theme = 'light' | 'dark';
```

**Constants**: UPPER_SNAKE_CASE (if exported)
```ts
const MAX_PROJECTS = 15;
const API_TIMEOUT = 5000;
```

### TypeScript Patterns

**Props typing**:
```ts
interface ButtonProps {
  label: string;
  onClick: (event: React.MouseEvent) => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export default function Button({
  label,
  onClick,
  disabled = false,
  variant = 'primary',
}: ButtonProps) {
  // ...
}
```

**Async/Await**:
```ts
async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch('/api/projects');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}
```

### State Management

Prefer `useState` for simple state; avoid Redux for this portfolio:
```ts
const [theme, setTheme] = useState<'light' | 'dark'>('light');
const [count, setCount] = useState(0);

const handleThemeToggle = () => {
  setTheme(t => t === 'light' ? 'dark' : 'light');
  localStorage.setItem('theme', theme);
};
```

### framer-motion Patterns

Use framer-motion for entrance/exit animations on islands:
```tsx
import { motion } from 'framer-motion';

export function TimelineAnimated({ items }: { items: TimelineItem[] }) {
  return (
    <motion.div layout>
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
        >
          {item.title}
        </motion.div>
      ))}
    </motion.div>
  );
}
```

### Comments & Documentation

Explain complex hooks, custom logic, or non-obvious patterns:
```ts
// Debounce scroll handler to avoid excessive re-renders
const handleScroll = useCallback(
  debounce(() => {
    setIsVisible(window.scrollY > 500);
  }, 200),
  []
);
```

## Content & Zod Schemas

### Define Schemas
All content validated at build time via `src/content.config.ts`:
```ts
import { z } from 'astro:content';

export const collections = {
  projects: {
    schema: z.object({
      title: z.string(),
      slug: z.string(),
      description: z.string(),
      tech: z.array(z.string()),
      featured: z.boolean().default(false),
      heroImage: z.string(),
      publishedDate: z.date(),
      link?: z.string().url().optional(),
    }),
  },
};
```

### Use Content in Pages
```astro
---
import { getCollection } from 'astro:content';

const projects = await getCollection('projects');
const featured = projects.filter(p => p.data.featured);
---

{featured.map(project => (
  <ProjectCard project={project} />
))}
```

### Frontmatter Format
```yaml
---
title: Face Detection with ML
slug: face-detection-ml-system
description: Real-time face detection using OpenCV + PyTorch
tech: [Python, PyTorch, OpenCV, WebAssembly]
featured: true
heroImage: /images/face-detection-hero.png
publishedDate: 2024-06-15
link: https://github.com/DucLong06/face-detection
---

Project details in markdown...
```

## File Size Guidelines

**Build targets**:
- CSS (Tailwind inlined): < 20 KB gzip
- HTML per page: < 30 KB
- Total JS (islands + framer-motion): < 80 KB
- Fonts (@fontsource WOFF2): < 50 KB

**Current**: Highly optimized; ships ~100 KB total per page (compressed).

## Accessibility Standards

### ARIA Labels
```astro
<button 
  aria-label="Toggle dark mode"
  class="p-2 hover:bg-gray-100 rounded"
>
  <Icon />
</button>
```

### Semantic HTML
```astro
<header>
  <nav aria-label="Main navigation">...</nav>
</header>
<main>
  <article>...</article>
</main>
<footer>...</footer>
```

### Color Contrast
All text must meet WCAG AA (4.5:1 normal text). Soft Aurora palette tested.

### Keyboard Navigation
- All interactive elements reachable via Tab
- Focus visible with ring or outline
- Escape closes modals

## Performance Patterns

### Image Optimization
```astro
<img 
  src="/image.webp" 
  alt="Descriptive text"
  loading="lazy"
  decoding="async"
/>
```

### Font Preload
```astro
<link 
  rel="preload"
  as="font"
  href="/fonts/instrument-serif.woff2"
  type="font/woff2"
  crossorigin
/>
```

### Build-Time Optimization
- Astro strips unused CSS at build time
- React islands tree-shaken (framer-motion: ~25 KB)
- satori OG images cached as artifacts

## Related Documentation

- [Codebase Summary](./codebase-summary.md)
- [System Architecture](./system-architecture.md)
- [Design Guidelines](./design-guidelines.md)
- [Deployment Guide](./deployment-guide.md)
