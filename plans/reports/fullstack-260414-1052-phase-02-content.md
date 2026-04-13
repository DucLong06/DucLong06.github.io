# Phase 02 — Content Schemas & Seed: Implementation Report

## Status
Complete. All todos checked. Build green.

## Files Modified / Created

| File | Action | Notes |
|---|---|---|
| `src/content.config.ts` | Pre-existing (verbatim §4.3) | Added `about` + `cv` passthrough collections to suppress deprecation warning |
| `src/content/profile/main.yaml` | Pre-existing | All fields from §16.8; no phone |
| `src/content/skills/main.yaml` | Pre-existing | All 6 groups from §16.7 |
| `src/content/experience/01-fpt-telecom.md` | Pre-existing | 5 sub-projects, real metrics |
| `src/content/experience/02-cyber-eye.md` | Pre-existing | AX-OCR + API Marketplace + BID Stats |
| `src/content/experience/03-fsi.md` | Pre-existing | OpenVINO intern |
| `src/content/projects/face-detection-ml-system.md` | Pre-existing | `featured: true`, `stars: 38` |
| `src/content/projects/booking-duongcam-art.md` | Pre-existing | |
| `src/content/projects/legal-prompts.md` | Pre-existing | `stars: 11` |
| `src/content/projects/alqac-2023.md` | Pre-existing | |
| `src/content/projects/text2sql-vietnamese.md` | Pre-existing | |
| `src/content/projects/ocr-api.md` | Pre-existing | |
| `src/content/papers/alqac-2023-ieee-kse.md` | Pre-existing | DOI + award |
| `src/content/papers/sao-khue-2022.md` | Pre-existing | |
| `src/content/papers/tds-vn-2021.md` | Pre-existing | |
| `src/content/about/bio.en.md` | Pre-existing | ~180 words narrative |
| `src/content/about/bio.vi.md` | Pre-existing | ~180 words VI |
| `src/content/cv/cv-source.md` | Pre-existing | Copied from root |
| `src/content/cv/cv-polished.md` | Pre-existing | Copied from root |
| `public/cv.pdf.todo` | Pre-existing | Marker noting PDF unavailable |
| `public/covers/.gitkeep` | Pre-existing | Placeholder |
| `CV Hoang Duc Long.md` (root) | **Deleted** | Moved to `src/content/cv/cv-source.md` |
| `Hoang Duc Long SWE.docx.md` (root) | **Deleted** | Moved to `src/content/cv/cv-polished.md` |

All files were already seeded by a prior partial run. This execution audited every file for correctness, deleted the root CV duplicates, and validated the build.

## Tasks Completed

- [x] `src/content.config.ts` — 5 collections (profile, experience, projects, papers, skills) + about/cv passthroughs; exact §4.3 schemas
- [x] `profile/main.yaml` — bilingual name/tagline, email, socials, cvFile; no phone
- [x] `skills/main.yaml` — 6 groups, 29 items total
- [x] 3 experience files — order 1–3, bilingual role, real metrics
- [x] 6 project files — all with cover placeholder `/covers/*.webp`, `featured` flag, publishedAt dates
- [x] 3 paper files — award badges, DOI/PDF links
- [x] `about/bio.en.md` + `bio.vi.md` — narrative, ~180 words each
- [x] `public/cv.pdf.todo` — marker with action instructions
- [x] CV source files at `src/content/cv/`; root copies removed
- [x] `astro check` — 0 errors, 0 warnings
- [x] `npm run build` — 1 page, complete

## Build Output

```
astro check: 0 errors, 0 warnings, 0 hints
npm run build: 1 page built in 2.33s — Complete!
```

## Schema Notes

- `slug` field from brainstorm example is NOT in the Zod schema (§4.3 omits it); Astro uses filename as slug automatically — correct.
- `about` and `cv` collections registered as passthrough to silence "auto-generated collection" deprecation warning.
- `publishedAt: z.date()` — all dates in ISO format (YYYY-MM-DD) which Zod coerces correctly from YAML.

## Blockers / TODOs Carried Forward

- `public/cv.pdf` still a TODO marker — requires manual PDF export before Phase 07 (Download CV button).
- `public/covers/*.webp` — all placeholders; Phase 09 will supply real images.

## Unresolved Questions

None.
