/**
 * language-colors.ts — Per-language brand colors for the LanguageBar.
 * Pure constants (no DOM, no fs). Single source of truth for language→color.
 */

/** Neutral fallback for unknown languages. */
const DEFAULT_LANGUAGE_COLOR = '#9db4d0';

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
  return LANGUAGE_COLORS[name] ?? DEFAULT_LANGUAGE_COLOR;
}
