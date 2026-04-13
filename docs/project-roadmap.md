# Project Roadmap

**Last Updated**: 2026-04-14
**Status**: v1.0 Complete (Astro 5 Redesign)
**Project**: DucLong06.github.io

## Executive Summary

DucLong06.github.io has completed a major redesign from jQuery static site to Astro 5 SSG + React islands (v1.0, released 2026-04-14). The portfolio now ships with zero client JS by default, content-driven architecture via Zod, bilingual support (EN/VI), and a signature WebGL liquid-shader hero. Future work focuses on optional enhancements (analytics, blog, custom domain).

## Phase Breakdown

### Phase 0–10: Portfolio v1.0 — Astro 5 Migration (✅ Complete)

**Status**: Released 2026-04-14
**Duration**: 2026-04-14 baseline
**Effort**: 10–14 days (estimated; completed)

**Achievements**:
- ✅ Astro 5 SSG scaffold + build pipeline
- ✅ Tailwind v3 + design tokens system
- ✅ Zod content schemas + 15 featured projects
- ✅ Navigation + layout + footer
- ✅ OGL WebGL liquid-shader hero with framer-motion
- ✅ About + Experience + Skills sections
- ✅ Project showcase (bento grid) + detail pages
- ✅ Papers/publications list
- ✅ Contact page (Formspree CTA)
- ✅ Astro native i18n (EN + VI routes)
- ✅ Performance & accessibility sweep (Lighthouse ≥95)
- ✅ GitHub Actions native Pages deployment
- ✅ v1.0 release + documentation

**Outcome**: Live Astro 5 portfolio with SSG, islands, i18n, WebGL, at https://duclong06.github.io

---

### Phase 11: Maintenance & Stability (🔄 Current)

**Status**: Active
**Timeline**: 2026-04-14 onward

**Focus**: Keep v1.0 running, content updates, minor bug fixes

**Current Activities**:
- 🔄 Monitor site uptime and performance
- 🔄 Update portfolio content (projects, experience, skills)
- 🔄 Test across browsers/devices
- 🔄 Keep dependencies patched (npm audit)

**Success Criteria**:
- Lighthouse ≥ 95 maintained
- All routes load correctly
- Theme/lang toggle functional
- Deployment working
- No console errors

---

### Phase 12: Post-Launch Backlog (📋 Planned - Q3 2026+)

**Status**: Backlog (not in v1.0 scope)
**Priority**: Medium
**Difficulty**: Low–Medium

#### 12.1 Analytics Integration
**Effort**: 5 hours

**Goal**: Privacy-friendly analytics (Plausible)

**Tasks**:
- [ ] Sign up for Plausible (paid service)
- [ ] Add Plausible script tag to BaseLayout
- [ ] Configure domain + goals
- [ ] Dashboard review

**Benefits**: Understand visitor behavior without tracking cookies

**Risk**: Adds external dependency

#### 12.2 Blog System
**Effort**: 30 hours

**Goal**: Add blog collection for technical writing

**Options**:
- Astro collection (simplest; markdown-driven)
- Headless CMS (Contentful, Sanity)
- Custom API (overkill for portfolio)

**Recommendation**: Astro collection (matches current stack)

**Tasks**:
- [ ] Create `src/content/blog/` collection
- [ ] Zod schema for blog posts
- [ ] /blog/* routes + index
- [ ] RSS feed generation
- [ ] Search functionality (optional)

#### 12.3 Custom Domain
**Effort**: 1 hour (one-time)

**Goal**: Use custom domain (e.g., `duclong.dev`)

**Prerequisites**: Domain registration + DNS provider access

**Tasks**:
- [ ] Register domain
- [ ] Update DNS records (A + CNAME)
- [ ] Add `public/CNAME` file
- [ ] Wait 24 hours for HTTPS provisioning

#### 12.4 Enhanced GitHub Stats
**Effort**: 4 hours

**Goal**: Auto-refresh GitHub stats via scheduled action

**Current**: Stats fetched at build time (static)

**Idea**: Run scheduled workflow (weekly) to rebuild with fresh stats

**Tasks**:
- [ ] Create `schedule.yml` workflow
- [ ] Trigger `npm run build` on schedule
- [ ] Cache results for dashboard display

---

### Phase 13: Advanced Enhancements (📋 Future)

**Status**: Backlog (lower priority)
**Timeline**: Q4 2026+

#### 13.1 Dark Mode System Detection
- [ ] Detect `prefers-color-scheme` on page load
- [ ] Add dark theme CSS variant
- [ ] Persist preference in localStorage

#### 13.2 More Project Detail Pages
- [ ] Embed live demos (iframe)
- [ ] Add GitHub repo links + stars widget
- [ ] Video/animation showcases

#### 13.3 Search Functionality
- [ ] Client-side search (Lunr.js or similar)
- [ ] Search projects + blog posts
- [ ] Highlight matches

#### 13.4 Community Features (Stretch)
- [ ] Comments on blog posts (Giscus or Utterances)
- [ ] Newsletter signup (optional)
- [ ] Social sharing buttons

---

## Timeline Overview

```
2026-04-14  v1.0 Complete (Astro 5)
    │
    ├─→ Q2 2026 (Now): Maintenance + stabilization
    │   ├─ Monitor uptime, fix bugs
    │   ├─ Content updates (projects, CV, experience)
    │   └─ Cross-browser testing
    │
    ├─→ Q3 2026: Phase 12.1–12.2 (analytics, blog)
    │   ├─ Plausible analytics integration (5 hrs)
    │   └─ Blog system design (start Phase 12.2)
    │
    ├─→ Q4 2026: Blog launch + custom domain
    │   ├─ Complete blog implementation
    │   ├─ First blog posts published
    │   └─ Custom domain setup (if registered)
    │
    └─→ Q1 2027+: Advanced features (Phase 13)
        ├─ Dark mode system detection
        ├─ Enhanced GitHub stats refresh
        └─ Community features (TBD)
```

## Success Metrics

### v1.0 Complete ✅
- ✅ Lighthouse ≥ 95 (mobile)
- ✅ LCP < 1.2s, TTI < 1.5s
- ✅ CLS < 0.05
- ✅ All 15 pages deployed
- ✅ EN + VI routes functional
- ✅ GitHub Actions workflow live
- ✅ Zero console errors
- ✅ WCAG AA compliant

### Phase 11 Goals (Maintenance)
- Site uptime: 99.9%
- No critical bugs
- Regular content updates
- Zero security vulnerabilities

### Phase 12 Goals (Analytics + Blog)
- Plausible dashboard tracking visitors
- 3+ blog posts published
- Blog SEO optimized (meta tags, sitemap)
- Custom domain active (if registered)

### Phase 13 Goals (Advanced)
- Dark mode auto-detection working
- Search feature functional
- Comment system live (if chosen)

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Astro minor version breaks build | Low | Low | Pin astro version, test upgrades |
| GitHub API rate-limiting | Medium | Low | Fallback caching in Phase 12.4 |
| Dependency security vulnerabilities | Medium | Medium | Regular npm audit, dependabot |
| Tailwind/Tailwind config drifts | Low | Low | Document design token changes |
| User feedback requests blog | High | Low | Phase 12.2 addresses this |

## Dependencies & Constraints

### Technical Dependencies
- **Astro 5**: SSG framework (external, tracked via npm)
- **React 18**: Islands only (external)
- **Tailwind v3**: Styling (external)
- **GitHub Pages**: Deployment (GitHub service)
- **GitHub API**: Stats fetch (requires GITHUB_TOKEN)
- **@fontsource**: Self-hosted fonts (npm package)

### Resource Constraints
- Single developer (hobbyist, ~5–10 hrs/month available)
- No budget allocation
- No team coordination needed

### Organizational Context
- Personal portfolio (not commercial)
- Educational emphasis (CS student at EPU)
- Long-term maintenance expected

## Decision Points & Milestones

| Date | Decision | Impact |
|---|---|---|
| Q2 2026 | Blog system priority? | Affects Phase 12.2 effort |
| Q3 2026 | Analytics tool choice? | Plausible vs. others |
| Q4 2026 | Custom domain registration? | One-time DNS setup |
| 2027 | Dark mode toggle? | Adds theme variant UX |

## Success Definition for v1.0

**Portfolio achieved its goals when:**
1. ✅ Astro 5 migration complete & stable
2. ✅ Lighthouse ≥ 95 on production
3. ✅ 15 projects showcased with detail pages
4. ✅ Bilingual EN/VI routes working
5. ✅ Auto-deployment via GitHub Actions
6. ✅ WebGL hero + animations performing well
7. ✅ Content-driven (no code changes for updates)
8. ✅ Documentation complete & current

**All achieved as of 2026-04-14.**

## Related Documentation

- [Project Changelog](./project-changelog.md) — Detailed v1.0 release notes
- [Project Overview](./project-overview-pdr.md) — PDR & requirements
- [Codebase Summary](./codebase-summary.md) — Directory structure
- [System Architecture](./system-architecture.md) — Tech stack & data flow
- [Code Standards](./code-standards.md) — TS, React, Tailwind conventions
- [Design Guidelines](./design-guidelines.md) — Soft Aurora, tokens
- [Deployment Guide](./deployment-guide.md) — GitHub Actions flow

---

**Document Version**: 2.0 (v1.0 release)
**Last Review**: 2026-04-14
**Next Review**: 2026-07-14 (quarterly)
