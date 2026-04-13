# Phase 02 — Content Schemas & Seed

## Context Links
- Brainstorm §4.3 (Zod schemas), §5 (file structure), §16 (full CV inventory)
- CV: `CV Hoang Duc Long.md`, `Hoang Duc Long SWE.docx.md`
- Brainstorm: [`plans/reports/brainstormer-260414-0955-portfolio-redesign.md`](../reports/brainstormer-260414-0955-portfolio-redesign.md)

## Overview
- **Priority:** P1
- **Status:** Complete (implemented 2026-04-14)
- **Brief:** Define type-safe Astro Content Collections via Zod for `profile`, `experience`, `projects`, `papers`, `skills`. Seed all collections with REAL CV content from brainstorm §16. Copy CV PDF to `public/cv.pdf`.

## Key Insights
- Schemas locked in brainstorm §4.3 — copy verbatim, do not redesign
- Bilingual fields use `z.object({ en: z.string(), vi: z.string() })`
- `experience` and `projects` are `type: 'content'` (markdown body matters); `profile` and `skills` are `type: 'data'` (yaml only)
- NO `blog` collection (scope locked)
- About bio is two separate files (`bio.en.md`, `bio.vi.md`) NOT a collection — read directly via `Astro.glob`

## Requirements
**Functional**
- `src/content.config.ts` exports all 5 collections with full Zod schemas
- One seed file per experience entry, project entry, paper entry
- `profile/main.yaml` and `skills/main.yaml` populated from §16
- `public/cv.pdf` exists (downloadable)
- `astro check` passes (zero schema validation errors)

**Non-functional**
- Each markdown file under 100 lines
- Image references use `/covers/*.webp` (placeholders ok this phase, real images phase 09)
- `publishedAt` dates plausible
- All emails / URLs valid format

## Architecture
```
src/content.config.ts (Zod)
        │
        ├─ profile  ─→  src/content/profile/main.yaml
        ├─ experience ─→ src/content/experience/01..04.md
        ├─ projects ─→ src/content/projects/*.md  (6 featured)
        ├─ papers   ─→ src/content/papers/*.md   (3 entries)
        └─ skills   ─→ src/content/skills/main.yaml

src/content/about/bio.en.md
src/content/about/bio.vi.md   (read directly, not via collection)

public/cv.pdf
public/covers/*.webp (placeholder)
```

## Related Code Files

**Create:**
- `src/content.config.ts` — full Zod schemas (paste from brainstorm §4.3)
- `src/content/profile/main.yaml`
- `src/content/skills/main.yaml`
- `src/content/experience/01-fpt-telecom.md`
- `src/content/experience/02-cyber-eye.md`
- `src/content/experience/03-fsi.md`
- `src/content/projects/face-detection-ml-system.md`
- `src/content/projects/booking-duongcam-art.md`
- `src/content/projects/legal-prompts.md`
- `src/content/projects/alqac-2023.md`
- `src/content/projects/text2sql-vietnamese.md`
- `src/content/projects/ocr-api.md`
- `src/content/papers/alqac-2023-ieee-kse.md`
- `src/content/papers/sao-khue-2022.md`
- `src/content/papers/tds-vn-2021.md`
- `src/content/about/bio.en.md`
- `src/content/about/bio.vi.md`
- `public/cv.pdf` (copy from existing CV export)
- `public/covers/.gitkeep`

**Modify:**
- `tsconfig.json` — ensure `astro/types` referenced for content collection types

**Move (from root, after seeded):**
- `CV Hoang Duc Long.md` → `src/content/cv/cv-source.md` (kept as raw source-of-truth)
- `Hoang Duc Long SWE.docx.md` → `src/content/cv/cv-polished.md`

## Implementation Steps

1. **Write `src/content.config.ts`** — paste schemas from brainstorm §4.3 verbatim (profile, experience, projects, papers, skills). Ensure `export const collections = {...}`.
2. **Profile yaml** — populate from §16.8:
   ```yaml
   name:
     en: "Hoàng Đức Long"
     vi: "Hoàng Đức Long"
   tagline:
     en: "Full-stack AI engineer shipping production ML at telecom scale."
     vi: "Kỹ sư AI full-stack, ship hệ thống ML production ở quy mô viễn thông."
   location: "Hà Nội, Việt Nam"
   email: "hoangduclongg@gmail.com"
   socials:
     github: "https://github.com/DucLong06"
     linkedin: "https://linkedin.com/in/hoangduclong"
   cvFile: "/cv.pdf"
   ```
3. **Skills yaml** — paste full structure from brainstorm §16.7 (6 groups: Languages, AI/ML, Backend, Frontend, DevOps/Cloud, Security).
4. **Experience markdown** — one file per role from §16.3:
   - `01-fpt-telecom.md`: order=1, period 2023-present, stack array, body lists 5 sub-projects (GitLab Bot, RAG Chatbot, Blacklist Bot, TechHub, Enterprise Events) with metrics
   - `02-cyber-eye.md`: order=2, 2020-2023, AX-OCR + API Marketplace + BID Stats
   - `03-fsi.md`: order=3, 2019-2020, OpenVINO intern
5. **Projects markdown** — 6 files mirroring §16.6 table. `face-detection-ml-system` has `featured: true`, `stars: 38`, body with architecture sketch. Each has `cover: /covers/<slug>.webp` placeholder.
6. **Papers markdown** — 3 files:
   - `alqac-2023-ieee-kse.md` with `award: "🏆 1st Prize ALQAC 2023"`, doi link
   - `sao-khue-2022.md` (VINASA award)
   - `tds-vn-2021.md` (3rd prize)
7. **About bios** — write English + Vietnamese versions, ~150 words each, narrative voice (not bullet list). Pull tone from brainstorm §16.1.
8. **Copy CV PDF** — user provides export → place at `public/cv.pdf`. If unavailable, leave a `cv.pdf.todo` marker.
9. **Move CV source files** to `src/content/cv/` for record-keeping.
10. **Validate**: `npx astro check` and `npm run build` — both must succeed.

## Todo List
- [x] Write `src/content.config.ts` with all 5 Zod schemas
- [x] Create `profile/main.yaml`
- [x] Create `skills/main.yaml` (all 6 groups)
- [x] Create 3 experience markdown files
- [x] Create 6 project markdown files
- [x] Create 3 paper markdown files
- [x] Create `about/bio.en.md` + `about/bio.vi.md`
- [x] Place `public/cv.pdf` (or todo marker) — marker at `public/cv.pdf.todo`
- [x] Move CV source files to `src/content/cv/`
- [x] Run `astro check` — zero errors
- [x] Run `npm run build` — succeeds
- [ ] Commit

## Success Criteria
**Definition of Done:**
- `astro check` exits 0
- `getCollection('experience')` returns 3 entries in dev console (verify in placeholder page)
- `getCollection('projects')` returns 6 entries with `featured` flag honored
- `public/cv.pdf` is a real PDF (or marker noted as TODO blocker)
- Schema validation fails immediately if a required field is missing (test by deleting one field)

**Validation:**
- Add a test page that lists all collection slugs; visit and confirm count
- Intentional bad frontmatter triggers Zod error message at build time

## Risk Assessment
| Risk | Mitigation |
|---|---|
| CV content not yet exported | Use brainstorm §16 inventory as authoritative seed (already real); flag PDF as TODO |
| Bilingual content drift | Single yaml/md per item with `{en, vi}` object — no parallel directory trees |
| Forgetting `featured: true` on hero project | Schema default `false`; phase 05 query filters explicitly |
| Image covers missing | Use placeholder gradient SVG until phase 09 |

## Security Considerations
- Email exposed in yaml — accept (already public on LinkedIn/GitHub)
- Phone number from §16.8 — DO NOT seed into yaml; phase 07 will gate behind click-to-reveal
- No API keys in content files

## Next Steps
- **Unblocks:** Phase 03 (hero needs profile data), Phase 04 (about/exp/skills consume), Phase 05 (projects bento), Phase 06 (papers)
- **Follows into:** Phase 03 — Nav, Hero, Liquid Shader
