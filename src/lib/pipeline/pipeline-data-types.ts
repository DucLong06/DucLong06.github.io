/**
 * pipeline-data-types.ts — Serializable shapes passed from the Astro build side
 * into the client R3F island. Everything here must survive JSON serialization
 * (no Date objects, no functions) so the island hydrates cleanly.
 */
import type { Lang } from '../i18n-helpers';

export type { Lang };

/** A quantified metric (mirrors content.config experienceMetric, resolved per-lang). */
export interface PipelineMetric {
  label: string;
  value: number;
  suffix: string;
  kind: 'count' | 'percent' | 'award';
  text?: string;
}

/** TRANSFORM — one skill cluster + its sub-skills. */
export interface SkillCluster {
  category: string;
  color: string;
  items: { name: string; level: number; years?: number }[];
}

/** TRAIN — one career epoch (chronological). */
export interface ExperienceEpoch {
  company: string;
  role: string;
  periodLabel: string;
  ongoing: boolean;
  stack: string[];
  projects: {
    name: string;
    summary: string;
    tech: string[];
    metrics: PipelineMetric[];
  }[];
}

/** DEPLOY — one project container. */
export interface DeployProject {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  category: string;
  featured: boolean;
  repo?: string;
  demo?: string;
  href: string; // i18n-correct /projects/[slug] (or /vi/...)
}

/** IMPACT — headline metric + papers. */
export interface ImpactData {
  highlights: { value: string; label: string; accent: 'neon' | 'amber' }[];
  papers: { title: string; venue: string; year: number; link?: string; award?: string }[];
}

/** ENDPOINT — contact card. */
export interface EndpointData {
  email: string;
  github: string;
  linkedin: string;
  cvFile: string;
}

/** Full payload serialized into the journey island. */
export interface JourneyData {
  lang: Lang;
  name: string;
  tagline: string;
  email: string;
  cvFile: string;
  bioParagraphs: string[]; // INGEST — bio (bold preserved as <strong>)
  clusters: SkillCluster[];
  epochs: ExperienceEpoch[];
  projects: DeployProject[];
  impact: ImpactData;
  endpoint: EndpointData;
}
