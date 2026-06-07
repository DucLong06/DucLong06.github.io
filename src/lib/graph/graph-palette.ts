/**
 * graph-palette.ts — Single source of truth for graph colors + sizes.
 * Pure constants (no DOM, no fs) so BOTH the build assembler and the client
 * graph island can import it. Values track the dark Aurora pastel theme.
 */
import type { GraphNodeType } from './graph-data-types';

/** Base node color per type (language nodes override via LANGUAGE_COLORS). */
export const NODE_COLORS: Record<GraphNodeType, string> = {
  root: '#f7d6e0',     // warm pink — the person, brightest
  company: '#7dd3ff',  // cyan — employer clusters
  project: '#c4f5e8',  // mint — shipped work
  tech: '#9db4d0',     // muted steel — supporting tech
  section: '#b794ff',  // violet — nav targets
  stat: '#ffd9a0',     // amber — GitHub headline stats
  language: '#9db4d0', // default; usually replaced by LANGUAGE_COLORS
};

/** Relative node radius per type. Languages scale by % at build time. */
export const NODE_SIZES: Record<GraphNodeType, number> = {
  root: 2.4,
  company: 1.6,
  section: 1.3,
  project: 1.05,
  stat: 0.95,
  language: 0.8,
  tech: 0.6,
};

/** Per-language brand colors (reused by LanguageBar for DRY). */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f7df1e',
  Python: '#3572a5',
  'C++': '#f34b7d',
  'C#': '#9b4f96',
  C: '#888888',
  Go: '#00acd7',
  'Go Template': '#00acd7',
  Rust: '#dea584',
  Java: '#b07219',
  Kotlin: '#a97bff',
  Swift: '#f05138',
  Dart: '#00b4ab',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Smarty: '#f0c040',
  'Jupyter Notebook': '#da5b0b',
  Vue: '#41b883',
  Svelte: '#ff3e00',
};

export function languageColor(name: string): string {
  return LANGUAGE_COLORS[name] ?? NODE_COLORS.language;
}
