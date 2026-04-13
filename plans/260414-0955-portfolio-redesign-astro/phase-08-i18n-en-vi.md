# Phase 08 — i18n EN/VI

## Context Links
- Brainstorm §4.3 (bilingual schemas), §6.1 (lang toggle), §18 (EN-first launch)
- Phases 02-07 (all sections must exist)

## Overview
- **Priority:** P2
- **Status:** Complete
- **Brief:** Wire `astro-i18next` (or native Astro i18n routing — choose native, simpler). Route strategy: `/` = EN, `/vi/` = VI. Wire language toggle, swap content fields by lang, add hreflang tags. EN remains canonical.

## Key Insights
- Astro 5 has native i18n routing — prefer over `astro-i18next` library (KISS, fewer deps)
- Bilingual content already in `{en, vi}` objects (phase 02) → no content migration
- Static UI strings in a single `src/i18n/strings.ts` keyed by lang
- Language toggle preserves current path: `/projects/foo` ↔ `/vi/projects/foo`
- `hreflang` tags pair EN ↔ VI URLs

## Requirements
**Functional**
- Astro config `i18n: { defaultLocale: 'en', locales: ['en', 'vi'] }`
- All pages render at `/` AND `/vi/...`
- `LangToggle.tsx` (from phase 03 stub) becomes functional, links to mirror URL
- Components read `Astro.currentLocale` and pick `summary[lang]`, `name[lang]`, etc.
- `<link rel="alternate" hreflang="en" href="..."> + hreflang="vi"` in `<head>`
- About bio uses `bio.en.md` vs `bio.vi.md` based on locale
- Static strings (nav labels, CTAs, section eyebrows) translated

**Non-functional**
- No client JS for translation (server-rendered)
- Both locales build with zero warnings
- 404 page localized

## Architecture
```
astro.config.mjs
  i18n: { defaultLocale: 'en', locales: ['en','vi'], routing: { prefixDefaultLocale: false } }

src/pages/
  index.astro              → /         (EN)
  vi/index.astro           → /vi/      (VI)
  projects/[slug].astro    → /projects/foo
  vi/projects/[slug].astro → /vi/projects/foo

src/i18n/strings.ts
  export const STRINGS = { en: {...}, vi: {...} } as const;

src/lib/i18n-helpers.ts
  - getLang(Astro): 'en' | 'vi'
  - t(key, lang): string
  - mirrorUrl(currentPath, targetLang): string
```

## Related Code Files

**Create:**
- `src/i18n/strings.ts` — all static UI strings keyed
- `src/lib/i18n-helpers.ts` — `getLang`, `t`, `mirrorUrl`
- `src/pages/vi/index.astro` — VI home (imports same components, passes `lang='vi'`)
- `src/pages/vi/projects/[slug].astro` — VI project detail
- `src/pages/vi/404.astro` (optional, or single 404)

**Modify:**
- `astro.config.mjs` — add `i18n` config
- `src/layouts/BaseLayout.astro` — accept `lang` prop, set `<html lang>`, add hreflang `<link>` pair
- `src/components/react/LangToggle.tsx` — actual logic (mirror URL swap)
- `src/components/astro/Nav.astro` — translate labels via `t()`
- `src/components/astro/About.astro` — load `bio.{lang}.md`
- `src/components/astro/Hero.astro` — read `name[lang]`, `tagline[lang]`
- `src/components/astro/ProjectCard.astro` — `summary[lang]`
- `src/components/astro/Experience.astro` — `role[lang]`
- All other content components consuming bilingual fields

## Implementation Steps

1. **Astro config**:
   ```js
   i18n: {
     defaultLocale: 'en',
     locales: ['en', 'vi'],
     routing: { prefixDefaultLocale: false }
   }
   ```
2. **`src/i18n/strings.ts`** — extract every hard-coded string from Nav, Hero CTAs, section titles, footer, contact form labels, 404 message, etc. Two top-level keys `en` and `vi`.
3. **`src/lib/i18n-helpers.ts`**:
   - `getLang(Astro)` returns `Astro.currentLocale ?? 'en'`
   - `t(key, lang)` looks up `STRINGS[lang][key]`
   - `mirrorUrl(path, targetLang)` swaps `/vi/x` ↔ `/x`
4. **BaseLayout** accepts `lang` prop, sets `<html lang>`, emits hreflang link pair pointing at mirror URLs.
5. **Refactor components** — replace hard-coded strings with `t(...)`, replace `data.summary.en` with `data.summary[lang]`, etc.
6. **Duplicate page files for `/vi/`** — minimal: each VI page imports same component tree, passes `lang='vi'`. Use `getStaticPaths` for dynamic routes.
7. **`LangToggle.tsx`** — read current path via `window.location.pathname`, on click navigate to `mirrorUrl(path, otherLang)`.
8. **Test both locales** — `/` and `/vi/` render fully; switching toggle preserves position; hreflang pair valid in source.

## Todo List
- [x] Add `i18n` to `astro.config.mjs`
- [x] Write `src/i18n/strings.ts` with all UI keys (en + vi)
- [x] Write `src/lib/i18n-helpers.ts`
- [x] Update `BaseLayout` (lang prop, hreflang)
- [x] Refactor Nav with `t()`
- [x] Refactor Hero with bilingual profile fields
- [x] Refactor About to load `bio.{lang}.md`
- [x] Refactor Experience, Projects, Skills, Papers, Contact, Footer
- [x] Wire `LangToggle.tsx` mirror logic
- [x] Create `src/pages/vi/index.astro` + `vi/projects/[slug].astro`
- [x] Build, verify both `/` and `/vi/` load
- [x] Validate hreflang in source
- [ ] Commit

## Success Criteria
**Definition of Done:**
- `/` and `/vi/` both render full site
- Toggling lang on `/projects/foo` lands on `/vi/projects/foo` and vice versa
- `view-source` shows `<link rel="alternate" hreflang="en">` + `hreflang="vi"`
- All content sections honor lang choice
- Build succeeds with zero warnings
- Lighthouse on both locales unchanged

**Validation:**
- `npm run build && ls dist/vi/` shows mirror tree
- Manual switch test on every section
- `curl dist/index.html | grep hreflang` returns 2 entries

## Risk Assessment
| Risk | Mitigation |
|---|---|
| Doubled build time | Shared component tree, only data swaps; should add ≤ 30% |
| Missing translation key | `t()` throws in dev / falls back to EN in prod with console.warn |
| `/vi/` breaks anchors | Anchors are relative (`#work`), preserved across locales |
| Content drift between langs | Single yaml/md per item, both langs in same file |

## Security Considerations
- No new external resources
- `lang` attr correctly set for screen readers (a11y win)

## Next Steps
- **Unblocks:** Phase 09 (perf/a11y can audit final shape)
- **Follows into:** Phase 09 — Performance & Accessibility
