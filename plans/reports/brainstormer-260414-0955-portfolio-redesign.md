---
type: brainstorm
date: 2026-04-14
author: brainstormer
topic: Portfolio redesign — Soft Modern Minimal + Astro + Liquid Shader
status: final
---

# Portfolio Redesign Brainstorm — Hoàng Đức Long

> Thay thế `COMPLETE_PORTFOLIO_MASTERPLAN.md` (cyber-noir) bằng hướng **Soft Modern Minimal** với stack **Astro + React islands**, content **markdown-driven**, signature **3D shader liquid gradient**. Deploy GitHub Pages, dễ update CV.

---

## 1. Problem Statement

Masterplan cũ cyber-noir (neon green, glitch, terminal) quá "ồn" cho recruiter quốc tế và không phù hợp yêu cầu **"mềm mại, đẹp, hiện đại"**. Cần:

- Aesthetic mềm, chuyên nghiệp, inspired bởi Linear / Vercel / Paper.design
- Content markdown-driven → chỉ sửa `.md` là update CV, projects, blog
- 3D điểm nhấn độc đáo nhưng nhẹ, không phá trải nghiệm đọc
- Stack tối ưu cho GitHub Pages (100% static, no server)
- Hỗ trợ i18n EN/VI
- Lighthouse ≥ 95

## 2. Locked Decisions (từ discovery phase)

| Quyết định | Chọn | Lý do |
|---|---|---|
| Aesthetic | **Soft Modern Minimal** | Mềm mại, timeless, hợp recruiter, dễ mở rộng dark/light |
| Framework | **Astro 5 + React islands** | Static-first, content collections, ship ~0KB JS, best cho GH Pages |
| Content pipeline | **Astro Content Collections (markdown + frontmatter Zod schema)** | Type-safe, built-in, không cần custom plugin |
| 3D signature | **Shader-based liquid gradient mesh** (WebGL GLSL) | Mềm mại, hiện đại, 1 canvas duy nhất < 50KB, không cần GLB asset |
| CV source | User sẽ export Google Docs → `.md` | Paste vào `src/content/` sau |

---

## 3. Aesthetic System — "Soft Aurora"

### 3.1 Concept

Cảm hứng: **Linear.app × Vercel × Arc Browser × Paper.design**. Nền sáng/trung tính, color thông qua gradient aurora mềm, typography cao cấp serif+sans pairing, không dùng neon mạnh. Dark mode default, light mode switchable.

### 3.2 Color Tokens

```css
:root {
  /* ═══ LIGHT MODE (default for readability) ═══ */
  --bg-base:        #fafaf9;     /* warm off-white, not pure */
  --bg-elevated:    #ffffff;
  --bg-subtle:      #f4f4f2;
  --text-primary:   #0a0a0b;
  --text-secondary: #52525b;
  --text-tertiary:  #a1a1aa;
  --border:         rgba(10,10,11,0.08);
  --border-strong:  rgba(10,10,11,0.14);

  /* ═══ AURORA ACCENTS (dùng cho gradient + highlights) ═══ */
  --aurora-1:       #6366f1;     /* indigo */
  --aurora-2:       #8b5cf6;     /* violet */
  --aurora-3:       #06b6d4;     /* cyan */
  --aurora-4:       #f472b6;     /* soft pink */
  --aurora-gradient: linear-gradient(135deg,
                       var(--aurora-1) 0%,
                       var(--aurora-2) 50%,
                       var(--aurora-3) 100%);

  /* ═══ SEMANTIC ═══ */
  --accent:         var(--aurora-1);
  --accent-hover:   #4f46e5;
  --success:        #10b981;
  --warning:        #f59e0b;
}

[data-theme="dark"] {
  --bg-base:        #0b0b0f;
  --bg-elevated:    #12121a;
  --bg-subtle:      #18181f;
  --text-primary:   #fafafa;
  --text-secondary: #a1a1aa;
  --text-tertiary:  #52525b;
  --border:         rgba(255,255,255,0.08);
  --border-strong:  rgba(255,255,255,0.14);
  /* aurora vẫn giữ, glow hơn chút trên dark */
}
```

### 3.3 Typography

```css
/* Display — elegant serif cho tên, hero */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');
/* Body — geometric humanist sans */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
/* Code/mono — chỉ cho snippet, terminal block */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

--font-display: 'Instrument Serif', Georgia, serif;  /* hero name, section titles */
--font-body:    'Inter', system-ui, sans-serif;
--font-mono:    'JetBrains Mono', ui-monospace, monospace;
```

Rationale: **Instrument Serif** (free, đang trend ở Vercel/Linear style) tạo cảm giác cao cấp nhân văn, đối lập với geometric sans. Signature detail: tên "Hoàng Đức Long" set bằng Instrument Serif italic ở hero → instant "designer taste".

### 3.4 Spacing, Radius, Motion

- **Spacing scale**: 4px base (`0.25 / 0.5 / 0.75 / 1 / 1.5 / 2 / 3 / 4 / 6 / 8 / 12 / 16 / 24rem`)
- **Radius**: `--r-sm: 6px, --r-md: 12px, --r-lg: 20px, --r-xl: 28px` (bo tròn lớn = mềm mại)
- **Motion**: ease out cubic-bezier `(0.22, 1, 0.36, 1)` — "soft spring", không bounce cheesy
- **Shadow**: multi-layer, soft — `0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.06), 0 24px 48px rgba(99,102,241,.08)` (có aurora tint)

---

## 4. Tech Stack

### 4.1 Core

```json
{
  "dependencies": {
    "astro": "^5.2.0",
    "@astrojs/react": "^4.1.0",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/sitemap": "^3.2.0",
    "@astrojs/tailwind": "^5.1.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.11.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.115.0",
    "three": "^0.170.0",
    "ogl": "^1.0.11",
    "lenis": "^1.1.14",
    "i18next": "^24.0.0",
    "astro-i18next": "^1.0.0",
    "shiki": "^1.22.0"
  },
  "devDependencies": {
    "@types/three": "^0.170.0",
    "typescript": "^5.6.0",
    "prettier-plugin-astro": "^0.14.0"
  }
}
```

### 4.2 Why Astro > Vite+React đơn thuần

| Tiêu chí | Astro | Vite+React | Ghi chú |
|---|---|---|---|
| Default JS shipped | **~0 KB** | ~120 KB | Astro render HTML static |
| Markdown pipeline | **Built-in** (Content Collections, Zod) | Phải tự code | Tiết kiệm 1-2 ngày |
| React islands | **Selective hydration** | Tất cả đều hydrate | 3D canvas chỉ hydrate khi visible |
| GH Pages | Support 1st-class (`site` + `base`) | OK | Ngang nhau |
| Lighthouse mobile | 98+ tiêu biểu | 80-90 | Astro thắng rõ |
| SEO / RSS / sitemap | Built-in | Plugin | Astro thắng |
| DX | Component syntax lai | Pure React | Hơi lạ lúc đầu |

### 4.3 Content Collections Schema (type-safe)

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';

const profile = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.object({ en: z.string(), vi: z.string() }),
    tagline: z.object({ en: z.string(), vi: z.string() }),
    location: z.string(),
    email: z.string().email(),
    socials: z.object({
      github: z.string().url(),
      linkedin: z.string().url(),
      facebook: z.string().url().optional(),
    }),
    cvFile: z.string(), // path to /public/cv.pdf
  }),
});

const experience = defineCollection({
  type: 'content',
  schema: z.object({
    company: z.string(),
    role: z.object({ en: z.string(), vi: z.string() }),
    period: z.object({ start: z.string(), end: z.string().nullable() }),
    logo: z.string().optional(),
    stack: z.array(z.string()),
    order: z.number(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    summary: z.object({ en: z.string(), vi: z.string() }),
    cover: z.string(),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    stack: z.array(z.string()),
    featured: z.boolean().default(false),
    stars: z.number().optional(),
    category: z.enum(['ai-ml', 'backend', 'devops', 'web', 'research']),
    publishedAt: z.date(),
  }),
});

const papers = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number(),
    pdf: z.string().optional(),
    doi: z.string().optional(),
    award: z.string().optional(), // "🏆 1st Place ALQAC 2023"
  }),
});

const skills = defineCollection({
  type: 'data',
  schema: z.object({
    groups: z.array(z.object({
      category: z.string(),
      items: z.array(z.object({
        name: z.string(),
        level: z.number().min(1).max(5),
        years: z.number().optional(),
        icon: z.string().optional(),
      })),
    })),
  }),
});

export const collections = { profile, experience, projects, papers, skills };
```

→ Update profile: chỉ cần sửa file markdown tương ứng, schema tự validate.

---

## 5. Content Architecture (Markdown-driven)

```
src/content/
├── profile/
│   └── main.yaml               # thông tin gốc (name, socials, tagline)
├── experience/
│   ├── 01-current-role.md
│   ├── 02-previous.md
│   └── ...                     # frontmatter + body mô tả
├── projects/
│   ├── face-detection-mlops.md
│   ├── legal-prompts.md
│   ├── alqac-2023.md
│   └── ...
├── papers/
│   └── alqac-2023-ieee-kse.md
├── skills/
│   └── main.yaml
├── blog/
│   └── 2026-04-hello-world.md
└── about/
    ├── bio.en.md
    └── bio.vi.md
```

### Ví dụ `projects/face-detection-mlops.md`

```markdown
---
title: Face Detection MLOps Pipeline
slug: face-detection-mlops
summary:
  en: "Production-grade YOLOv11 face detection deployed on GKE with full observability."
  vi: "Pipeline MLOps triển khai YOLOv11 trên GKE với monitoring đầy đủ."
cover: /covers/face-detection.webp
repo: https://github.com/DucLong06/face-detection-ml-system
stack: [Python, YOLOv11, Kubernetes, GKE, Prometheus, Grafana, Docker]
featured: true
stars: 38
category: ai-ml
publishedAt: 2024-11-20
---

## Architecture

Mô tả chi tiết bằng markdown — có thể embed mermaid, code block,
image, math, iframe demo...
```

**Update flow:** Sửa `.md` → push master → GitHub Actions build Astro → deploy `gh-pages` → live sau ~60s.

---

## 6. Site Layout — Soft Aurora Sections

```
┌─────────────────────────────────────────────┐
│  NAV (sticky, frosted glass blur)            │  ← always visible
├─────────────────────────────────────────────┤
│                                              │
│  HERO                                        │
│  ┌─ Liquid shader gradient background ──┐   │
│  │                                         │   │
│  │  Hoàng Đức Long   ← Instrument Serif   │   │
│  │  italic, 72px                            │   │
│  │                                         │   │
│  │  Backend engineer · AI researcher      │   │
│  │  × designer from Hà Nội                 │   │
│  │                                         │   │
│  │  [View work →]  [Download CV]           │   │
│  └─────────────────────────────────────────┘   │
│                                              │
├─────────────────────────────────────────────┤
│  MARQUEE — tech stack logos, infinite scroll │  (smooth, CSS-only)
├─────────────────────────────────────────────┤
│  ABOUT                                       │
│   Grid 2 cột: bio (left)  |  avatar + stats  │
│   Stats cards: years coding, repos, papers   │
├─────────────────────────────────────────────┤
│  EXPERIENCE — vertical timeline              │
│   Card list, framer-motion stagger on scroll │
├─────────────────────────────────────────────┤
│  SELECTED WORK — bento grid 3×2              │
│   6 featured projects, 1 "lớn" span 2 cột    │
│   Hover: subtle tilt + aurora glow           │
├─────────────────────────────────────────────┤
│  SKILLS — progress mini-chart theo group     │
│   hoặc tag cloud có weight                   │
├─────────────────────────────────────────────┤
│  PAPERS & AWARDS                             │
│   List paper, badge "🏆 1st Place ALQAC"    │
├─────────────────────────────────────────────┤
│  GITHUB LIVE STATS                           │
│   Fetch ở build-time từ GitHub API           │
│   Contribution heatmap, top languages        │
├─────────────────────────────────────────────┤
│  BLOG / NOTES (optional)                     │
├─────────────────────────────────────────────┤
│  CONTACT                                     │
│   Form (Formspree), socials, "currently      │
│   open to opportunities" badge               │
├─────────────────────────────────────────────┤
│  FOOTER                                      │
└─────────────────────────────────────────────┘
```

### 6.1 Navigation

- Desktop: horizontal pills, backdrop-blur, border mờ. Active pill có aurora gradient nền mờ.
- Mobile: hamburger → fullscreen sheet (framer-motion slide).
- Language toggle EN/VI + theme toggle.

### 6.2 Hero — Simplicity is the Hero

Bỏ terminal typing. Thay bằng:

- Background: liquid shader (section 7)
- Headline: tên italic serif khổng lồ
- Subline: 1 câu định vị rõ ràng
- 2 CTA tối giản, border subtle, hover aurora glow
- Scroll hint: tiny arrow fade in-out

---

## 7. 3D Signature — "Aurora Liquid" Shader

### 7.1 Concept

Một `<canvas>` full-width sau hero text, render một mặt phẳng GLSL morph liên tục, màu aurora gradient chảy mượt. Phản ứng với con trỏ (mouse tạo distortion mềm).

### 7.2 Why shader > model 3D?

| Aspect | Liquid shader | GLB model | Icosahedron R3F |
|---|---|---|---|
| File size | **~2 KB GLSL** | 300 KB - 2 MB | ~80 KB geometry |
| Mobile perf | **60fps** (1 quad) | 30fps | 40-50fps |
| "Soft" feel | **★★★★★** | ★★★ | ★★ (hard edges) |
| Unique | **Rất** (tự viết) | Phụ thuộc asset | Phổ biến |
| Degraded mode | CSS gradient fallback | Hide | Static SVG |

### 7.3 Shader Spec

Dùng **OGL** (lightweight 3KB) thay vì Three.js full cho hero, chỉ load R3F ở island khác nếu cần.

```glsl
// Fragment shader — simplex noise + fbm liquid flow
precision highp float;

uniform float uTime;
uniform vec2  uMouse;       // normalized [-1..1]
uniform vec2  uResolution;

varying vec2 vUv;

// Aurora palette
const vec3 COLOR_A = vec3(0.388, 0.400, 0.945); // #6366f1
const vec3 COLOR_B = vec3(0.545, 0.361, 0.965); // #8b5cf6
const vec3 COLOR_C = vec3(0.024, 0.714, 0.831); // #06b6d4
const vec3 COLOR_D = vec3(0.957, 0.447, 0.714); // #f472b6

// Simplex noise (Ashima) — omitted for brevity, ~30 lines
float snoise(vec2 v) { /* ... */ }

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  // Mouse distortion — soft falloff
  vec2 m = uMouse * 0.5;
  float dist = length(uv - m);
  float pull = exp(-dist * 3.0) * 0.15;

  // Flowing noise field
  float t = uTime * 0.08;
  vec2 q = uv + vec2(fbm(uv + t), fbm(uv - t));
  float n = fbm(q + pull);

  // Blend 4 aurora colors by noise bands
  vec3 col = mix(COLOR_A, COLOR_B, smoothstep(0.2, 0.6, n));
  col = mix(col, COLOR_C, smoothstep(0.4, 0.8, n));
  col = mix(col, COLOR_D, smoothstep(0.6, 1.0, n));

  // Soft vignette + film grain (subtle)
  float vig = 1.0 - length(vUv - 0.5) * 0.8;
  col *= vig;

  // Lower saturation cho light mode, giữ nguyên cho dark
  gl_FragColor = vec4(col, 0.85);
}
```

### 7.4 Performance

- Canvas bị giới hạn `devicePixelRatio ≤ 1.5` trên mobile
- Pause render khi `document.hidden` hoặc out of viewport (IntersectionObserver)
- `prefers-reduced-motion: reduce` → render frame 0 tĩnh → export ảnh PNG base64 làm fallback
- Target: 60fps desktop, 45fps mobile mid-range, < 30ms/frame GPU

---

## 8. Animation & Effects Library

| Effect | Library | Dùng ở đâu |
|---|---|---|
| Scroll orchestration | **Lenis** (smooth scroll) | Toàn site |
| Reveal on scroll | **framer-motion** `whileInView` | Sections, cards |
| Marquee | CSS `@keyframes` (no lib) | Tech stack strip |
| Card tilt | **@react-spring/web** hoặc CSS 3D transform | Project bento |
| Text split/stagger | framer-motion manual split | Hero, section titles |
| Counter | framer-motion `useMotionValue` + `animate` | Stats |
| Page transitions | **Astro View Transitions API** native | Route changes |
| Magnetic button | Custom React hook (6 dòng) | CTAs |
| Shader background | **OGL** | Hero, contact |
| Icons | **lucide-react** | Throughout |

Quy tắc: **mỗi effect phải có lý do**. Nếu không nâng cao trải nghiệm → bỏ.

---

## 9. GitHub Pages Constraints

GitHub Pages có quy định cần tuân thủ:

1. **Repo name quyết định base URL**: `DucLong06.github.io` = user site → deploy ở root `/`, KHÔNG cần `base` config. ✅
2. **File size**: mỗi file ≤ 100MB, repo nên ≤ 1GB. → đưa GLB/video nặng lên CDN ngoài (Cloudflare R2) nếu cần.
3. **Bandwidth**: soft limit 100GB/tháng. → tối ưu ảnh WebP/AVIF, lazy load.
4. **Build**: GH Pages có Jekyll mặc định. Phải **disable Jekyll** bằng file `.nojekyll` ở root output (Astro tự làm được qua config).
5. **Branches**: deploy từ `gh-pages` branch (action) hoặc `/docs` folder. Recommend `gh-pages` branch qua Actions workflow.
6. **HTTPS**: auto, free. ✅
7. **Custom domain** (tùy chọn): thêm file `CNAME` ở `public/`, trỏ DNS.
8. **SPA routing**: nếu dùng client routing, cần `404.html` fallback. Astro static SSG thì không cần — mỗi route là 1 file HTML.
9. **No server-side**: không env secret runtime → dùng GitHub Actions secrets cho build-time (GITHUB_TOKEN để fetch API).
10. **CORS**: Analytics + form submit phải qua bên thứ 3 (Plausible, Formspree, EmailJS).

### Astro config cho GH Pages

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://duclong06.github.io',
  // base: '/' (user site, không cần set)
  output: 'static',
  integrations: [react(), mdx(), sitemap(), tailwind()],
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  build: { assets: 'assets', inlineStylesheets: 'auto' },
  vite: {
    ssr: { noExternal: ['ogl'] },
  },
});
```

### Deploy workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push: { branches: [master] }
  workflow_dispatch:
permissions: { contents: read, pages: write, id-token: write }
concurrency: { group: "pages", cancel-in-progress: true }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with: { path: ./dist }
  deploy:
    needs: build
    environment: { name: github-pages, url: ${{ steps.deployment.outputs.page_url }} }
    runs-on: ubuntu-latest
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

→ Dùng **GitHub Pages native deployment** (không cần branch `gh-pages` riêng). Đơn giản hơn `gh-pages` package.

---

## 10. File Structure (đề xuất)

```
DucLong06.github.io/
├── .github/workflows/deploy.yml
├── astro.config.mjs
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── public/
│   ├── cv.pdf                    ← export từ Google Docs vào đây
│   ├── covers/*.webp             ← project covers
│   ├── avatar.webp
│   └── og-image.png
├── src/
│   ├── content.config.ts         ← Zod schemas
│   ├── content/
│   │   ├── profile/main.yaml
│   │   ├── experience/*.md
│   │   ├── projects/*.md
│   │   ├── papers/*.md
│   │   ├── skills/main.yaml
│   │   ├── blog/*.mdx
│   │   └── about/{bio.en.md,bio.vi.md}
│   ├── components/
│   │   ├── astro/               ← static Astro components
│   │   │   ├── Nav.astro
│   │   │   ├── Hero.astro
│   │   │   ├── SectionTitle.astro
│   │   │   ├── ProjectCard.astro
│   │   │   └── Footer.astro
│   │   ├── react/               ← interactive islands
│   │   │   ├── ThemeToggle.tsx
│   │   │   ├── LangToggle.tsx
│   │   │   ├── LiquidShader.tsx     ← OGL shader hero
│   │   │   ├── ContactForm.tsx
│   │   │   ├── TimelineAnimated.tsx
│   │   │   └── MagneticButton.tsx
│   │   └── icons/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/
│   │   ├── index.astro          ← EN home
│   │   ├── vi/index.astro       ← VI home
│   │   ├── projects/[slug].astro
│   │   ├── blog/[slug].astro
│   │   ├── rss.xml.js
│   │   └── 404.astro
│   ├── styles/
│   │   ├── global.css
│   │   ├── tokens.css           ← design tokens
│   │   └── typography.css
│   ├── lib/
│   │   ├── github-stats.ts      ← build-time fetch
│   │   ├── i18n.ts
│   │   └── format.ts
│   └── shaders/
│       ├── aurora.vert.glsl
│       └── aurora.frag.glsl
├── plans/                       ← keep
├── docs/                        ← keep
├── COMPLETE_PORTFOLIO_MASTERPLAN.md  ← giữ tham khảo, archive
└── README.md
```

---

## 11. Build Phases & Timeline (~10-14 ngày part-time)

| Phase | Nội dung | Ước tính |
|---|---|---|
| **00 — Archive & Bootstrap** | Backup HTML cũ vào `legacy/`, init Astro project, commit baseline | 0.5 ngày |
| **01 — Design tokens** | tokens.css, Tailwind config, Instrument Serif setup, dark/light toggle | 1 ngày |
| **02 — Content schemas** | Zod collections, seed dữ liệu mẫu từ masterplan + GitHub repos | 1 ngày |
| **03 — Nav + Hero + Liquid Shader** | Nav, hero layout, OGL shader, fallback, mouse interaction | 2 ngày |
| **04 — About + Experience + Skills** | Sections có scroll animation, marquee tech | 2 ngày |
| **05 — Projects bento grid** | Featured grid, card tilt, project detail page `/projects/[slug]` | 1.5 ngày |
| **06 — Papers + GitHub Stats** | Papers list, fetch GH API build-time, contribution viz | 1 ngày |
| **07 — Contact + Blog** | Formspree form, blog collection, RSS, SEO meta | 1 ngày |
| **08 — i18n EN/VI** | astro-i18next setup, translate sections, language toggle | 1 ngày |
| **09 — Perf + a11y** | Lighthouse, image optim, prefers-reduced-motion, aria | 1 ngày |
| **10 — Deploy + polish** | GitHub Actions, custom domain (nếu có), final QA | 0.5 ngày |

**Deliverable sau Phase 03**: hero đẹp có thể ship "coming soon" ngay nếu cần deadline gấp.

---

## 12. Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Shader quá nặng trên mobile cũ | Medium | Medium | `devicePixelRatio ≤ 1.5`, fallback CSS gradient static, detect `navigator.hardwareConcurrency < 4` |
| Astro learning curve (lần đầu) | Low | Low | Docs rất tốt, 2-3h đọc là đủ |
| GitHub API rate limit (60/h unauth) | Low | Low | Fetch build-time với `GITHUB_TOKEN`, cache JSON vào repo |
| CV content chưa có | **High now** | Medium | User export `.md` → paste vào `content/`, không chặn code |
| i18n làm chậm launch | Medium | Low | Launch EN-first, VI thêm ở Phase 08 (có thể defer) |
| Shader breaks `prefers-reduced-motion` | Medium | High (a11y) | Pre-render 1 frame thành PNG, serve khi reduce-motion |
| Bundle size 3D lib | Medium | Medium | OGL (3KB) thay Three.js full cho hero; R3F chỉ dùng nếu thật cần |

---

## 13. Success Metrics

- **Lighthouse** (mobile, 4G): Performance ≥ 95, A11y ≥ 100, Best Practices ≥ 100, SEO ≥ 100
- **Bundle JS lần đầu**: ≤ 80 KB gzipped (Astro mặc định ~0, cộng shader + 1 island)
- **LCP**: < 1.8s trên 4G
- **CLS**: < 0.05
- **Update CV workflow**: sửa 1 file `.md` + push = site cập nhật < 2 phút
- **Recruiter test**: người không biết kỹ thuật mở site vẫn hiểu "Long làm gì" trong 5 giây đầu

---

## 14. Comparison với Masterplan Cũ (để lưu)

| Khía cạnh | Masterplan cũ | Plan mới |
|---|---|---|
| Aesthetic | Cyber-noir terminal hacker | Soft Modern Minimal (Aurora) |
| Stack | Vite + React + R3F + GSAP + tsparticles | Astro + React islands + OGL + framer-motion |
| Default JS | ~250 KB | ~30-60 KB |
| Content | Custom markdown plugin | Astro Content Collections (native) |
| 3D signature | Icosahedron + particle network + globe | 1 liquid shader full-bleed |
| Typography | JetBrains Mono heavy | Instrument Serif + Inter |
| Section names | `> man long`, `> dpkg --list` | "About", "Experience", "Selected Work" |
| i18n | react-i18next | astro-i18next (build-time split) |
| Tone | Technical, in-your-face | Confident, quiet, timeless |

---

## 15. Next Steps (nếu user approve)

1. User export Google Docs CV → `.md` hoặc `.pdf`, đặt vào `public/cv.pdf` + paste nội dung làm base cho `src/content/about/bio.{en,vi}.md`, `experience/*.md`
2. Chạy `/ck:plan` để chuyển brainstorm này thành implementation plan chi tiết theo format `plans/{date}-{slug}/phase-XX-*.md`
3. Phase 00-03 implement tuần đầu → có hero đẹp để demo
4. Iterate content sau khi core layout chạy

---

## 16. Content Inventory (từ CV thật + GitHub)

### 16.1 Positioning (updated)

> **Hoàng Đức Long** — Full-stack AI Software Engineer
> Python · C++ · C# / .NET · TypeScript · JavaScript
> Shipping production AI/ML systems at telecom scale since 2020.

Tagline options (pick 1, test A/B):
1. *"Full-stack AI engineer shipping production ML at telecom scale."*
2. *"I build AI systems that ship — from OCR kernels in C++ to RAG chatbots on GCP."*
3. *"Trust me, I'm an engineer." (kept from old bio — self-aware)*

### 16.2 Hero stats strip (real numbers — headline-worthy)

```
6,000+ MRs / month     5,000+ users     90% security acc.    75.5% RAG acc.
reviewed by AI bot     on TechHub        GitLab Bot           Vertex AI chatbot

200+ repos covered    98% OCR digits    1st  ALQAC 2023      Sao Khuê 2022
by code-review bot    AX OCR engine     IEEE KSE paper       VINASA award
```

### 16.3 Experience timeline (content ready to drop into `experience/*.md`)

**1. FPT Telecom — Software Engineer (2023 – Present)**
- **GitLab Bot (AI Code Review)** — 200+ repos, 6,000 MRs/month, 90% security / 70% quality accuracy. SAST scanning, MR summarization, fix suggestions with full codebase impact analysis. `Python · LLM APIs · Langchain`
- **Customer Service RAG Chatbot** (`dvkh247.fpt.net`) — Vertex AI + ChromaDB + GCS, 75.5% accuracy on telecom package consultation. `Python · FastAPI · GCP · Vertex AI · ChromaDB`
- **Blacklist Bot** — Near-real-time crawler ingesting government SOC feeds → instant domain blocking across FPT Telecom network. `Python · BeautifulSoup · Selenium · web-check`
- **TechHub** (internal knowledge platform) — Reddit-style, 5,000+ users. UI/UX designed in Figma, full-stack shipped. `Django · Vue3 · TailwindCSS`
- **Enterprise Event Solutions** — 4-person team delivered full-stack conference apps for 1,000+ executives in 2-week sprints (Strategic Conference 2022, 2023). End-to-end incl. AI gamification.

**2. Cyber Eye Technology — Software Engineer (2020 – 2023)**
- **AX-OCR** — Core team on Vietnam's leading Vietnamese OCR engine. **Sao Khuê Award 2022 (VINASA)**. Led text segmentation + post-processing pipeline.
  - 98% digits · 96% handwritten chars/names/addresses · 97% handwritten dates
  - Offline C++ CPU-only inference for edge deployment on scanners & printers
  - PDF→DOCX converter with ~80% formatting fidelity on scanned PDFs
- **API Marketplace** — Intermediary system RapidAPI-style, packaged AX OCR as consumable API with trial + billing. `Python · Django · ReactJS · Docker · Nginx`
- **BID Statistics** — Data pipeline crawling bidding data from the internet, cleaning into relational DB. `Python · C# · SQL · Selenium · BS4`

**3. FSI Technology — AI Intern (2019 – 2020)**
- Researched **Intel OpenVINO** for AI model optimization + edge deployment. Image processing pipelines. `Python · C++ · OpenCV · TensorFlow · OpenVINO`

### 16.4 Education & Research

- **B.Eng. Software Engineering** — Electric Power University (EPU), Hà Nội, 2018-2023, GPA 3.3/4.0
- **Japan Advanced Institute of Science and Technology (JAIST)** — Exchange student, Nguyen Lab, Jun-Aug 2023. **1st author IEEE paper**: [ieeexplore.ieee.org/document/10299426](https://ieeexplore.ieee.org/document/10299426)

### 16.5 Awards

- 🏆 **1st Prize ALQAC 2023** — Legal Question Answering Task 2 (IEEE KSE Conference)
- 🥉 **3rd Prize Toward Data Science VN 2021** — Data Analytics
- 🏅 **Sao Khuê Award 2022 (VINASA)** — as core team on AX-OCR at Cyber Eye Tech

### 16.6 Featured Projects (bento grid — 6 cards)

| # | Project | Category | Repo / URL | Stack | Why featured |
|---|---|---|---|---|---|
| 1 (span 2) | **face-detection-ml-system** | ai-ml / devops | [github.com/DucLong06/face-detection-ml-system](https://github.com/DucLong06/face-detection-ml-system) ★38 | YOLOv11 · GKE · K8s · Docker · Prometheus · Grafana | Highest stars, production MLOps |
| 2 | **booking.duongcam.art** | full-stack | [booking.duongcam.art](https://booking.duongcam.art/) | Vue3 · Django · 9Pay | Live production với revenue thật |
| 3 | **Legal-Prompts** | research | ★11 repo | Prompt engineering for legal QA | Tied to IEEE paper + ALQAC win |
| 4 | **ALQAC2023** | research | repo | Python · LLM | 1st Prize IEEE KSE |
| 5 | **Text2SQL-Vietnamese** | ai-ml | repo | Python · LLM | Unique VN language work |
| 6 | **ocr-api** | backend / ai | repo | Python · Vietnamese OCR | Personal OCR API, ties to AX-OCR exp |

Work experience (FPT, Cyber Eye) hiển thị trong Experience section, không duplicate vào Projects grid.

### 16.7 Skills grouping (cho `skills/main.yaml`)

```yaml
groups:
  - category: Languages
    items:
      - { name: Python,      level: 5, years: 7 }
      - { name: C++,         level: 4, years: 5 }
      - { name: C#/.NET,     level: 4, years: 4 }
      - { name: TypeScript,  level: 4, years: 3 }
      - { name: JavaScript,  level: 4, years: 5 }
      - { name: Go,          level: 3, years: 1 }
      - { name: SQL,         level: 4 }

  - category: AI / ML
    items:
      - { name: PyTorch,     level: 4 }
      - { name: TensorFlow,  level: 3 }
      - { name: OpenCV,      level: 4 }
      - { name: Langchain,   level: 4 }
      - { name: ChromaDB,    level: 4 }
      - { name: Vertex AI,   level: 4 }
      - { name: OpenVINO,    level: 3 }
      - { name: LLM / RAG,   level: 5 }
      - { name: YOLOv11,     level: 4 }

  - category: Backend
    items:
      - { name: Django,      level: 5 }
      - { name: FastAPI,     level: 5 }
      - { name: REST / gRPC, level: 4 }
      - { name: PostgreSQL,  level: 4 }
      - { name: Redis,       level: 3 }

  - category: Frontend
    items:
      - { name: Vue 3,       level: 4 }
      - { name: React,       level: 4 }
      - { name: TailwindCSS, level: 5 }
      - { name: Figma,       level: 4 }  # UI/UX design

  - category: DevOps / Cloud
    items:
      - { name: Docker,      level: 5 }
      - { name: Kubernetes,  level: 4 }
      - { name: GKE / GCP,   level: 4 }
      - { name: GitLab CI,   level: 4 }
      - { name: Nginx,       level: 4 }

  - category: Security
    items:
      - { name: SAST,        level: 4 }
      - { name: Threat Intel,level: 3 }
      - { name: Web Crawling (Selenium/BS4), level: 4 }
```

### 16.8 Contact

- **Email**: hoangduclongg@gmail.com
- **Phone**: 0384856300 (consider hiding behind a click-to-reveal)
- **LinkedIn**: linkedin.com/in/hoangduclong
- **GitHub**: github.com/DucLong06
- **Location**: Hà Nội, Việt Nam

### 16.9 Updated Hero Copy (final)

```
                 Hoàng Đức Long
            ↑ Instrument Serif italic, 88px

    Full-stack AI engineer shipping production ML
    at telecom scale. Python · C++ · .NET · TS.

    Currently at FPT Telecom. 1st author IEEE paper.
    🏆 ALQAC 2023 · 🏅 Sao Khuê 2022.

    [ View work → ]   [ Download CV ]   [ Email ]
```

### 16.10 Positioning shift vs old masterplan

| Cũ | Mới |
|---|---|
| "Backend Engineer × Designer × AI Researcher" | **Full-stack AI Software Engineer** |
| "Python → Go Microservices & Kubernetes" | Python · C++ · C#/.NET · TS/JS — **polyglot** |
| Đơn lẻ các passion | Narrative thống nhất: "I ship AI products, end-to-end" |
| Hacker aesthetic thống trị | Confident, quiet, real metrics do the talking |

---

## 17. Cleanup Tasks (trước khi implement)

1. **Xóa folders legacy** (user xác nhận): `LoginForm/`, `Mario_Game/`, `Ruou/`, `WebLAH/`
2. **Archive `index.html` + `css/` + `js/` + `fonts/` + `img/` cũ** → commit `chore: archive legacy portfolio` rồi xóa, hoặc move sang branch `legacy-portfolio`
3. **Move `COMPLETE_PORTFOLIO_MASTERPLAN.md`** → `docs/archive/portfolio-masterplan-v1.md` (giữ làm tham khảo lịch sử)
4. **Move CV files** → `src/content/cv/` (nguồn truth) + export `public/cv.pdf` cho download button
5. **Cập nhật `README.md`** → mô tả site mới, stack Astro, dev commands

---

## 18. Readiness Check

**Đã đủ để chạy `/ck:plan` chưa?** ✅ **ĐỦ.**

- ✅ Aesthetic đã chốt (Soft Aurora)
- ✅ Stack đã chốt (Astro + React islands + OGL shader)
- ✅ 3D signature đã chốt (liquid aurora shader)
- ✅ Content pipeline đã chốt (Astro Content Collections + Zod)
- ✅ Domain đã chốt (`duclong06.github.io` free)
- ✅ Legacy cleanup đã approve
- ✅ CV content thật đầy đủ: experience, metrics, awards, paper, projects
- ✅ Positioning rõ: Full-stack AI Software Engineer
- ✅ Skills inventory hoàn chỉnh (6 groups)
- ✅ GitHub repos có data để highlight (top 6 featured)

**Final scope locks (từ discovery lần 2):**
- ❌ **Blog: BỎ hoàn toàn** — portfolio pure, không blog route, không collection
- ❌ **Analytics: KHÔNG** có lúc launch — có thể thêm sau nếu cần
- ⏭️ **i18n**: launch EN trước, VI ở Phase 08 (không phải launch blocker)

→ Giảm Phase 07 xuống còn "Contact + SEO meta" (0.5 ngày thay vì 1 ngày)
→ Xóa `src/content/blog/` và `src/pages/blog/` khỏi file structure
→ Tiết kiệm ~2 ngày khỏi timeline, còn ~8-12 ngày part-time

---

## 19. Unresolved Questions

1. **CV content**: vẫn chưa có nội dung CV cụ thể. User cần export Google Docs (2 link) sang `.md` hoặc paste thẳng. Trước khi đó, không viết được content thật cho About/Experience.
2. **Custom domain**: `duclong06.github.io` hay domain riêng (`duclong.dev`, v.v.)? Ảnh hưởng DNS, CNAME, Open Graph URL.
3. **Blog có launch ngay không**, hay chỉ scaffold? Ảnh hưởng Phase 07 scope.
4. **Analytics**: Plausible (paid, privacy), Umami self-host, hay GA4 (free, bị chặn VN)? Default đề xuất: **Plausible** hoặc không có gì lúc đầu.
5. **Contact form backend**: Formspree free tier (50/tháng) đủ không, hay cần Resend/EmailJS?
6. **Ngôn ngữ chính hiển thị lần đầu**: detect theo browser hay default EN cho recruiter quốc tế?
7. **Legacy content**: `LoginForm/`, `Mario_Game/`, `Ruou/`, `WebLAH/` có giữ không? Đề xuất move sang `/legacy/` subfolder và link nhẹ từ footer.
