/**
 * scene-data-types.ts — Shared types for the 3D island scene payload.
 * This object is serialized server-side (Astro) and passed to the
 * `client:only` React island. Everything here MUST be JSON-serializable.
 */
import type { Lang } from '../../i18n/strings';

export type { Lang };

/** Stable identifiers for each clickable section pin / prop. */
export type SectionId =
  | 'about'
  | 'experience'
  | 'skills'
  | 'projects'
  | 'papers'
  | 'contact';

export interface SceneProfile {
  name: string;
  tagline: string;
  location: string;
  email: string;
  github: string;
  linkedin: string;
  facebook?: string;
  cvFile: string;
}

export interface SceneExperience {
  company: string;
  role: string;
  start: string;
  end: string | null;
  stack: string[];
}

export interface SceneSkillGroup {
  category: string;
  items: { name: string; level: number }[];
}

export interface SceneProject {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  repo?: string;
  demo?: string;
  href: string;
  /** Derived from publishedAt.getFullYear() — drives orbit-timeline angle. */
  year: number;
  /** Project category — drives node accent color in the orbit. */
  category: string;
  /** Top-tier project (first 3 in FEATURED_ORDER) — rendered larger. */
  primary: boolean;
}

export interface ScenePaper {
  title: string;
  venue: string;
  year: number;
  award?: string;
}

export interface SceneHighlight {
  value: string;
  label: string;
  accent: 'neon' | 'amber';
}

export interface SceneGitHub {
  totalRepos: number;
  totalStars: number;
  topLanguages: { name: string; percentage: number }[];
  handle: string;
}

export interface SceneData {
  lang: Lang;
  profile: SceneProfile;
  about: { title: string; paragraphs: string[] };
  experience: SceneExperience[];
  skills: SceneSkillGroup[];
  projects: { featured: SceneProject[]; all: SceneProject[]; total: number };
  papers: ScenePaper[];
  highlights: SceneHighlight[];
  github: SceneGitHub;
  /** Full UI string table for the active language (small, ~50 keys). */
  strings: Record<string, string>;
}
