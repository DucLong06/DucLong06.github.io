/**
 * build-journey-data.ts — Top-level assembler for the Data Pipeline Journey.
 * Runs at build time (Astro side) and produces a single JSON-serializable
 * JourneyData payload for the client island. Single source of truth = the same
 * Zod content collections the 2D site uses (no content duplication).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { buildSkillClusters } from './build-skill-clusters';
import { buildExperienceTrack } from './build-experience-track';
import { buildDeployProjects } from './build-deploy-projects';
import { buildImpactData } from './build-impact-data';
import type { JourneyData, Lang } from './pipeline-data-types';

// Raw bio markdown (no frontmatter) — same source the 2D About.astro renders.
const BIO_RAW = import.meta.glob<string>('../../content/about/bio.*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

/** Minimal markdown → HTML: paragraphs split on blank lines, **bold** preserved. */
function bioParagraphs(lang: Lang): string[] {
  const key =
    Object.keys(BIO_RAW).find((k) => k.endsWith(`bio.${lang}.md`)) ??
    Object.keys(BIO_RAW).find((k) => k.endsWith('bio.en.md'));
  const raw = key ? BIO_RAW[key] : '';
  return raw
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'));
}

export async function buildJourneyData(lang: Lang): Promise<JourneyData> {
  const profiles = await getCollection('profile');
  const profile = profiles.find(
    (e: CollectionEntry<'profile'>) => e.id.replace(/\.\w+$/, '') === 'main',
  )!;
  const [clusters, epochs, projects, impact] = await Promise.all([
    buildSkillClusters(),
    buildExperienceTrack(lang),
    buildDeployProjects(lang),
    buildImpactData(lang),
  ]);

  return {
    lang,
    name: profile.data.name[lang] ?? profile.data.name.en,
    tagline: profile.data.tagline[lang] ?? profile.data.tagline.en,
    email: profile.data.email,
    cvFile: profile.data.cvFile,
    bioParagraphs: bioParagraphs(lang),
    clusters,
    epochs,
    projects,
    impact,
    endpoint: {
      email: profile.data.email,
      github: profile.data.socials.github,
      linkedin: profile.data.socials.linkedin,
      cvFile: profile.data.cvFile,
    },
  };
}
