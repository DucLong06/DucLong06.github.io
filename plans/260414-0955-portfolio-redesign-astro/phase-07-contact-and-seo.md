# Phase 07 — Contact & SEO

## Context Links
- Brainstorm §6 (Contact section), §16.8 (contact info), §18 (scope locks)
- Phase 03 (`BaseLayout`, `Footer.astro` skeleton)

## Overview
- **Priority:** P1
- **Status:** Complete
- **Brief:** Contact section = email + social links only (NO form, NO Formspree). Phone **fully hidden** (not displayed, not revealable). Sitewide SEO meta (OG, favicon, sitemap, robots.txt, 404 page). OG image **auto-generated at build time** via satori + resvg. NO blog. NO analytics.

## Key Insights
- Dropping form removes third-party dependency, bundle shrinks, zero PII handling
- Recruiters already use email/LinkedIn by default — form is rarely the preferred channel
- OG image auto-gen keeps preview always in sync with profile data without manual Figma work
- Phone fully removed per user request → no reveal island needed
- 404 page reuses `BaseLayout` with friendly message + back link
- `@astrojs/sitemap` integration auto-emits `sitemap-index.xml`

## Requirements
**Functional**
- `<Contact />` section: large email CTA (`mailto:hoangduclongg@gmail.com`), social grid (GitHub, LinkedIn, Facebook optional), "Download CV" button linking to `/cv.pdf`
- "Currently open to opportunities" badge with subtle pulse
- **No phone displayed anywhere** on the site
- **No contact form, no Formspree**
- Footer: minimal — copyright, built with Astro, language toggle
- 404 page exists at `src/pages/404.astro`
- `robots.txt` allows all, points to sitemap
- Favicon set (svg + png fallback)
- **OG image generated at build time** via `scripts/generate-og.mjs` using satori (JSX → SVG) + @resvg/resvg-js (SVG → PNG), output to `public/og-image.png`
- BaseLayout `<head>` references `/og-image.png`

**Non-functional**
- All meta tags lighthouse-validated
- Zero third-party runtime scripts on contact section
- Bundle delta from contact section ≈ 0 KB JS (pure Astro static)
- OG generation runs in `prebuild` script, finishes < 3s

## Architecture
```
index.astro
 └─ <Contact />
      ├─ Big email mailto button (static)
      ├─ Social link grid (GitHub, LinkedIn, Facebook)
      ├─ "Download CV" button → /cv.pdf
      └─ "Open to work" badge (pulse animation)

BaseLayout.astro <head>
 ├─ title, description, canonical
 ├─ OG tags (og:image=/og-image.png)
 ├─ Twitter card summary_large_image
 ├─ favicon set
 └─ JSON-LD Person schema

scripts/generate-og.mjs
 ├─ Read profile data from src/content/profile/main.yaml
 ├─ Render JSX template via satori
 ├─ Convert SVG → PNG via @resvg/resvg-js
 └─ Write public/og-image.png (1200×630)

src/pages/404.astro
public/robots.txt
public/og-image.png         ← generated, gitignored OR committed
public/favicon.svg + favicon.png
```

## Related Code Files

**Create:**
- `src/components/astro/Contact.astro` — static section, no islands needed
- `src/components/astro/Footer.astro` (full version, replaces phase 03 skeleton)
- `src/pages/404.astro`
- `public/robots.txt`
- `public/favicon.svg`
- `public/favicon.png`
- `scripts/generate-og.mjs` — Node script, satori + resvg
- `src/og-template.tsx` — JSX template consumed by satori (Inter font embed, aurora gradient bg, name + tagline + avatar)

**Modify:**
- `src/layouts/BaseLayout.astro` — add full meta tags, JSON-LD, OG image ref
- `src/pages/index.astro` — append `<Contact />` and use `<Footer />`
- `astro.config.mjs` — verify `sitemap()` integration
- `package.json` — add `prebuild` script: `node scripts/generate-og.mjs && astro build` (or run in build hook)
- `.gitignore` — optionally ignore `public/og-image.png` if regenerated every build

**Do NOT create (removed from scope):**
- ~~`src/components/react/ContactForm.tsx`~~
- ~~`src/components/react/PhoneReveal.tsx`~~
- ~~`.env.example` with `PUBLIC_FORMSPREE_ID`~~

## Implementation Steps

1. **Install OG deps**:
   ```bash
   npm i -D satori @resvg/resvg-js
   ```
2. **`src/og-template.tsx`** — JSX returning a 1200×630 layout:
   - Aurora gradient background (match site palette)
   - Instrument Serif italic name "Hoàng Đức Long"
   - Sub: "Full-stack AI Software Engineer"
   - Small: "duclong06.github.io"
   - Optional: avatar circle top-right
3. **`scripts/generate-og.mjs`**:
   - Load Inter + Instrument Serif font files from `node_modules` or `public/fonts/`
   - Import og-template, call `satori(template, { width: 1200, height: 630, fonts })`
   - `const png = new Resvg(svg).render().asPng()`
   - `fs.writeFileSync('public/og-image.png', png)`
4. **`package.json`**:
   ```json
   "scripts": {
     "prebuild": "node scripts/generate-og.mjs",
     "build": "astro build",
     "dev": "astro dev"
   }
   ```
5. **`Contact.astro`**:
   - `<SectionTitle eyebrow="Get in touch" title="Let's talk." />`
   - Large clickable email block (`mailto:hoangduclongg@gmail.com`) with copy-on-click micro-interaction (optional 1-line JS, still static)
   - Social grid: GitHub, LinkedIn, Facebook (optional), each with icon + label
   - "Download CV" button → `/cv.pdf` (target `_blank`, `download` attr)
   - "Open to opportunities" pill badge with CSS pulse
   - Two-col on desktop, stacked on mobile
6. **`Footer.astro`** — copyright year, "built with Astro", small lang toggle stub (wired in phase 08).
7. **`BaseLayout.astro` meta**:
   - `<title>{title} | Hoàng Đức Long</title>`
   - `<meta name="description">`
   - OG: `og:title`, `og:description`, `og:image` (absolute URL), `og:url`, `og:type=website`, `og:locale`
   - Twitter card `summary_large_image`
   - `<link rel="canonical">`
   - JSON-LD Person schema (name, jobTitle, url, sameAs socials, email)
8. **Favicon set** — SVG mark (single letter "L" in Instrument Serif italic, aurora gradient fill) + PNG fallback 32×32.
9. **`robots.txt`**:
   ```
   User-agent: *
   Allow: /
   Sitemap: https://duclong06.github.io/sitemap-index.xml
   ```
10. **`404.astro`** — full BaseLayout, friendly message, link back to `/`, optional glitch effect on "404".
11. **Build & verify** — `dist/sitemap-index.xml`, `dist/robots.txt`, `dist/404.html`, `dist/og-image.png` all exist and render.

## Todo List
- [x] Install satori + @resvg/resvg-js
- [x] Create `src/og-template.tsx` with aurora layout (implemented inline in generate-og.mjs as VNode — no separate tsx file needed)
- [x] Create `scripts/generate-og.mjs` producing `public/og-image.png`
- [x] Wire `prebuild` script in package.json
- [x] Create `Contact.astro` with email CTA + social grid + CV button + open-to-work badge
- [x] Full `Footer.astro`
- [x] BaseLayout meta tags + OG + JSON-LD Person schema
- [x] Generate + commit favicons (svg + png)
- [x] `robots.txt`
- [x] `404.astro`
- [x] Wire `<Contact />` + `<Footer />` into `index.astro`
- [x] Run `npm run build`, verify `dist/og-image.png`, sitemap, robots, 404
- [ ] Validate OG preview on opengraph.xyz
- [ ] Commit

## Success Criteria
**Definition of Done:**
- Contact section shows email (clickable mailto) + socials + CV button + open-to-work badge
- **Zero phone number rendered anywhere** in final HTML
- **Zero form elements** on the site
- `public/og-image.png` regenerates on every build with current profile data
- `dist/sitemap-index.xml` lists all pages
- `dist/404.html` loads on bad URL
- OG preview validates on opengraph.xyz / LinkedIn Post Inspector
- JSON-LD validates with Google Rich Results Test

**Validation:**
- Lighthouse SEO ≥ 100
- Hit `/random-bad-url` → 404 page
- `grep -ri "0384856300" dist/` returns zero matches
- `grep -ri "formspree" src/` returns zero matches
- View source of `/` shows full meta block with valid OG image URL

## Risk Assessment
| Risk | Mitigation |
|---|---|
| `satori` font loading fails in CI | Bundle Inter + Instrument Serif TTFs into `public/fonts/` and load with absolute path |
| OG image cache stale on social platforms | Version filename (`og-image-v1.png`) or add `?v=<hash>` query param when profile changes |
| 404 page not served by GH Pages | GH Pages auto-uses `404.html` from root of artifact — Astro emits this automatically |
| Email scraping from mailto | Accepted trade-off; spam filters handle it. Alternative: JS-obfuscate the mailto href (not recommended, breaks a11y) |
| OG gen script breaks build | Script wrapped in try/catch, logs warning, reuses previous `og-image.png` if exists |

## Security Considerations
- No form → no CSRF, no honeypot, no captcha needed
- No third-party runtime scripts loaded on contact section
- No analytics → zero PII collection
- All external links `rel="noopener noreferrer"` with `target="_blank"`
- Email is public info — `mailto:` safe
- Phone **completely removed** from DOM, not hidden via CSS

## Next Steps
- **Unblocks:** Phase 08 (i18n needs all sections complete)
- **Follows into:** Phase 08 — i18n EN/VI
