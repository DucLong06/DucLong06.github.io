/**
 * build-scene-data.ts — Server-side assembler for the 3D island payload.
 * Runs in Astro frontmatter during build (SSR), reads the same content
 * collections as the 2D site, and returns a JSON-serializable `SceneData`.
 *
 * Single source of truth: editing `src/content/**` updates BOTH the 2D site
 * and the 3D popups — no 3D code changes needed to update content.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { FEATURED_ORDER } from '../featured-projects-order';
import { getGitHubStats } from '../github-stats';
import { STRINGS, type Lang } from '../../i18n/strings';
import { renderBodyHtml } from './render-body-html';
import type {
  SceneData,
  SceneProject,
  SceneExperience,
  ScenePaper,
  SceneSkillGroup,
} from './scene-data-types';

type SkillItem = { name: string; level: number };

/** Strip .md/.mdx extension from Astro 5 entry.id. */
function entrySlug(id: string): string {
  return id.replace(/\.(md|mdx)$/, '');
}

/**
 * Lightweight markdown → plain-text paragraphs.
 * Good enough for popup excerpts; the full bio still renders in the 2D fallback.
 */
function markdownToParagraphs(md: string, max = 3): string[] {
  // Surgical strip — preserve in-word punctuation like C#, C++, snake_case.
  const text = md
    .replace(/```[\s\S]*?```/g, '')                 // fenced code blocks
    .replace(/`([^`]+)`/g, '$1')                     // inline code → text
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')            // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')         // links → label
    .replace(/\*\*([^*]+)\*\*/g, '$1')               // **bold** → text
    .replace(/(^|\n)\s{0,3}#{1,6}\s+/g, '$1')        // headings (line-start only)
    .replace(/(^|\n)\s{0,3}>\s?/g, '$1')             // blockquotes (line-start)
    .replace(/(^|\n)\s*[-+*]\s+/g, '$1• ');          // list bullets (line-start)
  return text
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .slice(0, max);
}

/** Localized projects (featured first 3 = crates, all 6 = "see all" list). */
async function buildProjects(lang: Lang) {
  const featuredEntries = await getCollection(
    'projects',
    (e: CollectionEntry<'projects'>) => e.data.featured === true,
  );
  const ordered = FEATURED_ORDER.map((s) =>
    featuredEntries.find((e: CollectionEntry<'projects'>) => entrySlug(e.id) === s),
  ).filter((e): e is CollectionEntry<'projects'> => e !== undefined);

  const prefix = lang === 'vi' ? '/vi' : '';
  const toProject = (e: CollectionEntry<'projects'>): SceneProject => ({
    slug: entrySlug(e.id),
    title: e.data.title,
    summary: e.data.summary[lang] ?? e.data.summary.en,
    stack: e.data.stack,
    repo: e.data.repo,
    demo: e.data.demo,
    href: `${prefix}/projects/${entrySlug(e.id)}/`,
    // Project write-ups are single-language; same body serves EN + VI (Phase 06).
    bodyHtml: renderBodyHtml(e.body ?? ''),
  });

  const all = ordered.map(toProject);
  return { featured: all.slice(0, 3), all, total: all.length };
}

/** Assemble the full scene payload for a language. */
export async function buildSceneData(lang: Lang): Promise<SceneData> {
  const profileEntry = (await getCollection('profile')).find(
    (e: CollectionEntry<'profile'>) => entrySlug(e.id) === 'main',
  );
  const p = profileEntry!.data;

  const experience: SceneExperience[] = (await getCollection('experience'))
    .sort(
      (a: CollectionEntry<'experience'>, b: CollectionEntry<'experience'>) =>
        a.data.order - b.data.order,
    )
    .map((e: CollectionEntry<'experience'>) => ({
      company: e.data.company,
      role: e.data.role[lang] ?? e.data.role.en,
      start: e.data.period.start,
      end: e.data.period.end,
      stack: e.data.stack,
      bodyHtml: renderBodyHtml(e.body ?? ''),
    }));

  const skills = (await getCollection('skills'))
    .find((e: CollectionEntry<'skills'>) => entrySlug(e.id) === 'main')!
    .data.groups.map((g: SceneSkillGroup) => ({
      category: g.category,
      items: g.items.map((i: SkillItem) => ({ name: i.name, level: i.level })),
    }));

  const papers: ScenePaper[] = (await getCollection('papers'))
    .sort((a: CollectionEntry<'papers'>, b: CollectionEntry<'papers'>) => b.data.year - a.data.year)
    .map((e: CollectionEntry<'papers'>) => ({
      title: e.data.title,
      venue: e.data.venue,
      year: e.data.year,
      award: e.data.award,
      bodyHtml: renderBodyHtml(e.body ?? ''),
    }));

  const bioEntry = (await getCollection('about')).find(
    (e: CollectionEntry<'about'>) => entrySlug(e.id) === `bio.${lang}`,
  );
  const about = {
    title: STRINGS[lang].about_title,
    paragraphs: bioEntry ? markdownToParagraphs(bioEntry.body ?? '') : [],
    bioHtml: bioEntry ? renderBodyHtml(bioEntry.body ?? '') : '',
  };

  const gh = await getGitHubStats();

  return {
    lang,
    profile: {
      name: p.name[lang] ?? p.name.en,
      tagline: p.tagline[lang] ?? p.tagline.en,
      location: p.location,
      email: p.email,
      github: p.socials.github,
      linkedin: p.socials.linkedin,
      facebook: p.socials.facebook,
      cvFile: p.cvFile,
    },
    about,
    experience,
    skills,
    projects: await buildProjects(lang),
    papers,
    github: {
      totalRepos: gh.totalRepos,
      totalStars: gh.totalStars,
      topLanguages: gh.topLanguages,
      handle: 'DucLong06',
    },
    strings: { ...STRINGS[lang] },
  };
}
