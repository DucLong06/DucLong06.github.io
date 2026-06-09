/**
 * nvim-data-types.ts — JSON-serializable payload for the Neovim shell island.
 * Built server-side (Astro frontmatter) and passed to the `client:only` island.
 * Reuses the existing SceneData (for the 3D `:island` buffer) and augments it
 * with project READMEs, demo media, recent commits, and achievements.
 */
import type {
  SceneData,
  SceneProfile,
  SceneSkillGroup,
  ScenePaper,
  SceneExperience,
  SceneGitHub,
  Lang,
} from '../scene/scene-data-types';

export type { Lang };

/** git status decoration shown in the neo-tree (cosmetic, derived from recency). */
export type GitStatus = 'm' | 'a' | 'u';

/** Live-demo media card config (Phase 05). Optional / backward-compatible. */
export interface DemoMedia {
  /** image under /public (gif for private preview, webp screenshot for public). */
  src: string;
  /** short display URL e.g. "techleague.net" or "gke.face-detect/predict". */
  url?: string;
  /** full href opened by the "open ↗" button (public only). */
  href?: string;
  /** true → render gif + "🔒 private — preview" badge; false → screenshot + open↗. */
  private: boolean;
}

export interface NvimProject {
  key: string;
  title: string;
  desc: string;
  stack: string[];
  stars: number;
  featured: boolean;
  cover?: string;
  href: string;
  repo?: string;
  /** raw markdown rendered in the README buffer view. */
  readme: string;
  demo?: DemoMedia;
  gitStatus?: GitStatus;
}

export interface NvimCommit {
  type: string;
  hash: string;
  msg: string;
}

export interface NvimData {
  lang: Lang;
  profile: SceneProfile;
  about: { paragraphs: string[] };
  experience: SceneExperience[];
  skills: SceneSkillGroup[];
  papers: ScenePaper[];
  github: SceneGitHub;
  projects: NvimProject[];
  commits: NvimCommit[];
  achievements: string[];
  /** alternate-language home URL for the `:lang` toggle. */
  altLangUrl: string;
  strings: Record<string, string>;
  /** Full scene payload reused by the `:island` 3D buffer. */
  scene: SceneData;
}
