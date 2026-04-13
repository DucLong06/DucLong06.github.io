/**
 * i18n-helpers.ts — Utilities for Astro native i18n routing.
 * Strategy: `/` = EN (default, no prefix), `/vi/` = VI.
 */

import { STRINGS, type Lang, type StringKey } from '../i18n/strings';

// Re-export Lang so consumers can import from a single module
export type { Lang };

/**
 * getLang — extract current locale from Astro context.
 * Falls back to 'en' when locale is undefined (e.g. static 404 page).
 */
export function getLang(astro: { currentLocale?: string }): Lang {
  const locale = astro.currentLocale;
  if (locale === 'vi') return 'vi';
  return 'en';
}

/**
 * t — lookup a UI string by key and language.
 * Falls back to EN value if key missing in target lang (should not happen with satisfies guard).
 */
export function t(key: StringKey, lang: Lang): string {
  const val = STRINGS[lang][key] ?? STRINGS['en'][key];
  if (!val && typeof process !== 'undefined') {
    console.warn(`[i18n] Missing string key: "${key}" for lang: "${lang}"`);
  }
  return val ?? key;
}

/**
 * mirrorUrl — swap between EN and VI URL paths.
 * EN → VI: prepend /vi/
 * VI → EN: strip /vi prefix
 *
 * Examples:
 *   mirrorUrl('/', 'vi')               → '/vi/'
 *   mirrorUrl('/projects/foo/', 'vi')  → '/vi/projects/foo/'
 *   mirrorUrl('/vi/', 'en')            → '/'
 *   mirrorUrl('/vi/projects/foo/', 'en') → '/projects/foo/'
 */
export function mirrorUrl(path: string, targetLang: Lang): string {
  const isCurrentlyVi = path.startsWith('/vi/') || path === '/vi';

  if (targetLang === 'vi') {
    if (isCurrentlyVi) return path; // already VI
    // prepend /vi — preserve trailing slash
    const normalised = path.startsWith('/') ? path : `/${path}`;
    return `/vi${normalised}`;
  }

  // targetLang === 'en'
  if (!isCurrentlyVi) return path; // already EN
  // strip /vi prefix
  const stripped = path.replace(/^\/vi/, '') || '/';
  return stripped;
}
