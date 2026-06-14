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
  /** Highlighted HTML of the role's full markdown body (3D reading panel). */
  bodyHtml?: string;
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
  /** Highlighted HTML of the project's full markdown write-up (3D reading panel). */
  bodyHtml?: string;
}

export interface ScenePaper {
  title: string;
  venue: string;
  year: number;
  award?: string;
  /** Highlighted HTML of the paper's full markdown write-up (3D reading panel). */
  bodyHtml?: string;
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
  about: { title: string; paragraphs: string[]; bioHtml: string };
  experience: SceneExperience[];
  skills: SceneSkillGroup[];
  projects: { featured: SceneProject[]; all: SceneProject[]; total: number };
  papers: ScenePaper[];
  github: SceneGitHub;
  /** Full UI string table for the active language (small, ~50 keys). */
  strings: Record<string, string>;
}
