/**
 * explore-types.ts — Shared TS types for the 3D explore island.
 *
 * The payload is assembled server-side (src/lib/explore-data.ts) from the same
 * content collections the classic view uses, then handed to the client island as
 * a prop (the island is client:only and can't read collections directly).
 * Strings are pre-resolved to the active locale on the server → small, flat payload.
 */
import type { Lang } from '../../../i18n/strings';

export type { Lang };

export interface AboutData {
  headline: string;
  /** Pre-rendered bio HTML (already locale-resolved markdown). */
  bioHtml: string;
  location: string;
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  stack: string[];
  projects: { name: string; summary: string; tech: string[] }[];
}

export interface WorkCard {
  slug: string;
  title: string;
  summary: string;
  cover: string;
  stack: string[];
  href: string;
  repo?: string;
  demo?: string;
  /** Papers merged into Work render as Research-tagged cards. */
  isResearch: boolean;
  /** Research-only: venue + year for the card meta line. */
  venue?: string;
}

export interface StatValue {
  value: string;
  label: string;
  accent: 'neon' | 'amber';
}

export interface StatsData {
  highlights: StatValue[];
  github: { repos: number; stars: number; topLanguages: { name: string; percentage: number }[] };
}

export interface SkillItem {
  name: string;
  level: number; // 1–5
  years?: number;
}

export interface SkillGroup {
  category: string;
  items: SkillItem[];
}

export interface OffclockFact {
  label: string;
  value: string;
}

export interface OffclockInterest {
  key: string;
  icon: string;
  title: string;
  blurb: string;
  facts: OffclockFact[];
}

export interface ExploreData {
  about: AboutData;
  experience: ExperienceItem[];
  work: WorkCard[];
  stats: StatsData;
  skills: SkillGroup[];
  offclock: OffclockInterest[];
}
