/**
 * graph-data-types.ts — Shared types for the force-directed knowledge graph.
 *
 * GraphData is assembled server-side (Astro SSR, build-graph-data.ts) and
 * serialized to JSON for the `client:visible` graph island. Everything here
 * MUST be JSON-serializable (no functions, no Dates).
 *
 * Node positions (x/y/z) are precomputed at build time by graph-layout.ts so
 * the client ships zero physics code — it only renders + drifts.
 */
import type { Lang } from '../../i18n/strings';

export type { Lang };

export type GraphNodeType =
  | 'root'      // YOU — the person, graph center
  | 'company'   // an employer cluster
  | 'project'   // a shipped project (leaf under a company)
  | 'tech'      // a technology/skill, cross-linked to every project using it
  | 'section'   // a site section nav target (about/experience/…)
  | 'stat'      // a GitHub headline stat (repos/stars/…)
  | 'language'; // a GitHub language (sized by %)

export type GraphLinkType = 'belongs' | 'uses' | 'nav';

/** A single quantified figure shown on a project node / detail panel. */
export interface GraphMetric {
  label: string;                       // localized
  value: number;                       // numeric target (count-up + ring)
  suffix: string;                      // appended verbatim, e.g. "+", "%", "/mo"
  kind: 'count' | 'percent' | 'award';
  text?: string;                       // localized — non-numeric metrics (awards)
}

/** Where a click on this node should take the user. */
export interface GraphNav {
  kind: 'scroll' | 'route';
  target: string; // '#experience' for scroll, '/projects/slug/' for route
}

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;          // localized display name
  sublabel?: string;      // localized secondary line (role / summary / value)
  color: string;          // resolved at build from type (+ language color)
  size: number;           // relative node radius
  nav?: GraphNav;

  // Panel payload (projects / companies)
  summary?: string;       // localized
  metrics?: GraphMetric[];
  tech?: string[];
  repo?: string;
  demo?: string;
  href?: string;          // localized project URL
  award?: string;         // localized

  // Aux payload (languages / stats)
  value?: string;         // pre-formatted stat value, e.g. "72"
  percentage?: number;    // language share

  // Precomputed layout position (build-time force sim)
  x: number;
  y: number;
  z: number;
}

export interface GraphLink {
  source: string; // node id
  target: string; // node id
  type: GraphLinkType;
}

export interface GraphData {
  lang: Lang;
  nodes: GraphNode[];
  links: GraphLink[];
}
