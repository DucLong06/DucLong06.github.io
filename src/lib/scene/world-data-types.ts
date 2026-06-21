/**
 * world-data-types.ts — Shared types for the Quantum World (Vue island) payload.
 *
 * Assembled server-side by `build-world-stations.ts` and passed to the
 * `client:only="vue"` island. Everything here MUST be JSON-serializable
 * (no functions, no class instances) — it crosses the SSR → client boundary.
 *
 * The payload carries BOTH languages (en + vi) so the in-island language
 * toggle can swap copy instantly without a re-fetch (mirrors the prototype's
 * bilingual PANELS / ASIDE tables).
 */
import type { Lang } from '../../i18n/strings';

export type { Lang };

/** Stable station identifiers, in tour order. */
export type WorldStationId =
  | 'identity'
  | 'telemetry'
  | 'expertise'
  | 'quantum'
  | 'ledger'
  | 'dockyard'
  | 'signal';

/** A chart block rendered inside the left InfoCard. `type` keys a renderer. */
export interface ChartSpec {
  /** Renderer key (radar | line | bars | donut | gauge | heatmap | bloch | circuit | ledger | k8s). */
  type: string;
  /** Header label shown above the chart. */
  title: string;
  /** Optional "LIVE / STREAM / COHERENT …" status badge text. */
  live?: string;
  /** Gold status dot variant (ledger). */
  gold?: boolean;
  /** Wider block (ledger chain). */
  wide?: boolean;
  /** Resolved, JSON-serializable data for the renderer (null = self-contained). */
  data?: unknown;
}

/** Left InfoCard content for one language. */
export interface Panel {
  kicker: string;
  title: string;
  role: string;
  /** HTML paragraphs (may contain <strong>). */
  body: string[];
  loc?: string;
  badges: string[];
  /** Contact-link block (signal station only). */
  links?: boolean;
}

/** Right DataSheet block kinds (port of `renderAsideBlocks`). */
export type AsideBlock =
  | { kind: 'timeline'; title: string; items: { h: string; s: string }[] }
  | { kind: 'rows'; title: string; items: { k: string; v: string }[] }
  | { kind: 'list'; title: string; items: { h: string; s: string }[] }
  | { kind: 'tags'; title: string; items: string[] };

/** Right DataSheet content for one language. */
export interface Aside {
  heading: string;
  blocks: AsideBlock[];
}

/** One station's full bilingual content + chart specs. */
export interface WorldStation {
  id: WorldStationId;
  /** Hex color (number) — matches the scene palette accent for this station. */
  color: number;
  panel: Record<Lang, Panel>;
  aside: Record<Lang, Aside>;
  /** Chart blocks per language (titles are localized; data is shared). */
  charts: Record<Lang, ChartSpec[]>;
}

/** Localized chrome strings (nav hint, classic-view link, tour labels). */
export interface ChromeStrings {
  touring: string;
  paused: string;
  classic: string;
  hint: string;
  igniting: string;
}

/** Contact channels (signal station links). */
export interface WorldContact {
  email: string;
  github: string;
  linkedin: string;
  handle: string;
}

/** Top-level payload for the Quantum World island. */
export interface WorldData {
  stations: WorldStation[];
  chrome: Record<Lang, ChromeStrings>;
  contact: WorldContact;
}
