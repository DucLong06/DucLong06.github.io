/**
 * explore-data.ts — Server-side payload assembler for the 3D explore island.
 *
 * Reads the SAME content collections the classic view uses and flattens them into
 * a small, locale-resolved, JSON-serializable payload (the island is client:only
 * and can't read collections directly). Single fetch path → no data divergence.
 *
 * Called from src/pages/explore.astro + vi/explore.astro.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { FEATURED_ORDER } from './featured-projects-order';
import githubStats from '../data/github-stats-cache.json';
import type { Lang } from '../i18n/strings';
import type {
  ExploreData,
  ExperienceItem,
  WorkCard,
  OffclockInterest,
} from '../components/react/explore/explore-types';

function entrySlug(id: string): string {
  return id.replace(/\.(md|mdx)$/, '');
}

function projectHref(slug: string, lang: Lang): string {
  return lang === 'vi' ? `/vi/projects/${slug}` : `/projects/${slug}`;
}

// Bio markdown lives outside getCollection access for rendering → use glob like About.astro.
const bioModules = import.meta.glob<{ compiledContent?: () => string | Promise<string> }>(
  '../content/about/bio.*.md',
  { eager: true },
);

async function renderBio(lang: Lang): Promise<string> {
  const key =
    Object.keys(bioModules).find((k) => k.endsWith(`bio.${lang}.md`)) ??
    Object.keys(bioModules).find((k) => k.endsWith('bio.en.md'));
  if (!key) return '';
  const mod = bioModules[key];
  const html = mod.compiledContent ? await mod.compiledContent() : '';
  return html ?? '';
}

type ExpEntry = CollectionEntry<'experience'>;
type ExpProject = ExpEntry['data']['projects'][number];
type ProjEntry = CollectionEntry<'projects'>;
type PaperEntry = CollectionEntry<'papers'>;
type OffclockEntry = CollectionEntry<'offclock'>;
type OffclockRaw = OffclockEntry['data']['interests'][number];
type OffclockFactRaw = OffclockRaw['facts'][number];
type ProfileEntry = CollectionEntry<'profile'>;
type Highlight = ProfileEntry['data']['highlights'][number];

async function buildExperience(lang: Lang): Promise<ExperienceItem[]> {
  const entries: ExpEntry[] = await getCollection('experience');
  return entries
    .sort((a: ExpEntry, b: ExpEntry) => a.data.order - b.data.order)
    .map((e: ExpEntry): ExperienceItem => {
      const start = e.data.period.start;
      const end = e.data.period.end ?? (lang === 'vi' ? 'Hiện tại' : 'Present');
      return {
        company: e.data.company,
        role: e.data.role[lang] ?? e.data.role.en,
        period: `${start} — ${end}`,
        stack: e.data.stack,
        projects: e.data.projects.map((p: ExpProject) => ({
          name: p.name,
          summary: p.summary[lang] ?? p.summary.en,
          tech: p.tech,
        })),
      };
    });
}

async function buildWork(lang: Lang): Promise<WorkCard[]> {
  const allFeatured: ProjEntry[] = await getCollection(
    'projects',
    (e: ProjEntry) => e.data.featured === true,
  );
  const projectCards: WorkCard[] = FEATURED_ORDER.map((slug: string) =>
    allFeatured.find((e: ProjEntry) => entrySlug(e.id) === slug),
  )
    .filter((e): e is ProjEntry => e !== undefined)
    .map((e: ProjEntry) => {
      const slug = entrySlug(e.id);
      return {
        slug,
        title: e.data.title,
        summary: e.data.summary[lang] ?? e.data.summary.en,
        cover: e.data.cover,
        stack: e.data.stack,
        href: projectHref(slug, lang),
        repo: e.data.repo,
        demo: e.data.demo,
        isResearch: false,
      };
    });

  const papers: PaperEntry[] = await getCollection('papers');
  const paperCards: WorkCard[] = papers
    .sort((a: PaperEntry, b: PaperEntry) => b.data.year - a.data.year)
    .map((p: PaperEntry) => ({
      slug: entrySlug(p.id),
      title: p.data.title,
      summary: p.data.award ?? '',
      cover: '',
      stack: [],
      href: p.data.pdf ?? (p.data.doi ? `https://doi.org/${p.data.doi}` : '#'),
      isResearch: true,
      venue: `${p.data.venue} · ${p.data.year}`,
    }));

  return [...projectCards, ...paperCards];
}

async function buildOffclock(lang: Lang): Promise<OffclockInterest[]> {
  const entry = await getEntry('offclock', 'main');
  if (!entry) return [];
  return entry.data.interests.map((i: OffclockRaw) => ({
    key: i.key,
    icon: i.icon,
    title: i.title[lang] ?? i.title.en,
    blurb: i.blurb[lang] ?? i.blurb.en,
    facts: i.facts.map((f: OffclockFactRaw) => ({ label: f.label[lang] ?? f.label.en, value: f.value })),
  }));
}

export async function getExploreData(lang: Lang): Promise<ExploreData> {
  const profile = await getEntry('profile', 'main');
  const skillsEntry = await getEntry('skills', 'main');

  const [bioHtml, experience, work, offclock] = await Promise.all([
    renderBio(lang),
    buildExperience(lang),
    buildWork(lang),
    buildOffclock(lang),
  ]);

  return {
    about: {
      headline: profile.data.tagline[lang] ?? profile.data.tagline.en,
      bioHtml,
      location: profile.data.location,
    },
    experience,
    work,
    stats: {
      highlights: profile.data.highlights.map((h: Highlight) => ({
        value: h.value[lang] ?? h.value.en,
        label: h.label[lang] ?? h.label.en,
        accent: h.accent,
      })),
      github: {
        repos: githubStats.totalRepos,
        stars: githubStats.totalStars,
        topLanguages: githubStats.topLanguages,
      },
    },
    skills: skillsEntry.data.groups,
    offclock,
  };
}
