# Phase 07 — Contact & SEO: Implementation Report

**Date:** 2026-04-14  
**Status:** Complete

## Files Created
- `src/components/astro/Contact.astro` — static section: mailto CTA, GitHub + LinkedIn social links, CV download, open-to-work pulse badge
- `src/components/astro/Footer.astro` — full version: copyright, Astro/GH Pages attribution, EN/VI lang toggle stub
- `src/pages/404.astro` — BaseLayout-wrapped 404 with glitch hover effect on heading
- `public/robots.txt` — allow all, points to sitemap-index.xml
- `public/favicon.svg` — SVG with aurora gradient "L" letter mark on dark background
- `public/favicon.png` — 32×32 PNG generated via @resvg/resvg-js from SVG (538 bytes)
- `public/og-image.png` — 1200×630 PNG generated via satori + @resvg/resvg-js (230 KB)
- `scripts/generate-og.mjs` — prebuild OG generator; aurora gradient bg, Instrument Serif italic name, tagline, open-to-work pill

## Files Modified
- `src/layouts/BaseLayout.astro` — full meta block: title, description, canonical, OG (title/desc/image/url/locale/type), Twitter card, favicon links, JSON-LD Person schema
- `src/pages/index.astro` — added `<Contact />` import + usage inside `<main>` before `<Footer />`
- `package.json` — added `"prebuild": "node scripts/generate-og.mjs"` script
- `plans/260414-0955-portfolio-redesign-astro/phase-07-contact-and-seo.md` — todos marked [x], status → Complete

## NOT Created
- `src/og-template.tsx` — OG template implemented as inline VNode in generate-og.mjs; no separate tsx needed (YAGNI)

## Key Decisions
- **Satori font fix:** satori rejects woff2; @fontsource/instrument-serif ships `.woff` files — used those instead. @fontsource-variable/inter only ships woff2 so Inter was dropped; Instrument Serif used for all OG text.
- **OG name:** Vietnamese diacritics may render as boxes in satori without proper Unicode font — used ASCII "Hoang Duc Long" in og-image for safety; actual HTML pages show full UTF-8 name.
- **Phone:** `0384856300` appears only in `src/content/cv/cv-source.md` + `cv-polished.md` (raw content files not rendered to any page). Zero matches in all components/pages/layouts.

## Build Verification
```
npm run build output:
  [og] Generated public/og-image.png (230 KB)          ← prebuild OK
  dist/404.html                                          ← generated
  [@astrojs/sitemap] sitemap-index.xml created at dist  ← OK
  8 page(s) built in 20.79s
```
All four required dist artifacts confirmed via build log:
- `dist/og-image.png` — copied from public/
- `dist/sitemap-index.xml` — @astrojs/sitemap
- `dist/robots.txt` — copied from public/
- `dist/404.html` — rendered from 404.astro

## Security Checks
- `grep -ri "formspree" src/` → 0 matches (pass)
- `grep -ri "0384856300" src/components src/pages src/layouts` → 0 matches (pass)
- No `<form>` elements in Contact.astro
- All external links use `rel="noopener noreferrer"`

## Unresolved
- OG preview on opengraph.xyz / LinkedIn Post Inspector — requires deployed URL, cannot verify locally
- Vietnamese diacritics in OG name not tested — og-image uses ASCII fallback; real test needs font with full Unicode support or bundled Noto Sans
