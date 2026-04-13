/**
 * theme-init.ts
 * Exports a JS string meant to be inlined inside <script> in <head>
 * BEFORE any stylesheet loads — eliminates FOUC on theme switch.
 *
 * Logic:
 *   1. Read localStorage('theme')
 *   2. Fall back to prefers-color-scheme
 *   3. Apply to document.documentElement.dataset.theme
 *   4. After DOMContentLoaded, add 'theme-ready' class so CSS transitions
 *      kick in only after first paint (prevents transition on page load).
 *
 * Size target: < 1 KB minified.
 */
export const themeInitScript = /* js */ `
(function () {
  var stored = localStorage.getItem('theme');
  var preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  var theme = stored === 'dark' || stored === 'light' ? stored : preferred;
  document.documentElement.dataset.theme = theme;
  document.addEventListener('DOMContentLoaded', function () {
    document.documentElement.classList.add('theme-ready');
  });
})();
`.trim();

/** Valid theme values */
export type Theme = 'light' | 'dark';

/** Toggle helper — call from React island or Astro component */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem('theme', theme);
}

/** Read current theme from DOM */
export function getTheme(): Theme {
  return (document.documentElement.dataset.theme as Theme) ?? 'light';
}
