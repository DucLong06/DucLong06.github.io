/**
 * explore-i18n.ts — Thin locale lookup for the client island.
 * Mirrors src/lib/i18n-helpers.ts `t()` but usable inside React (no Astro ctx).
 */
import { STRINGS, type Lang, type StringKey } from '../../../i18n/strings';

export type { Lang };

export function makeT(lang: Lang) {
  return (key: StringKey): string => STRINGS[lang][key] ?? STRINGS.en[key] ?? key;
}

export type TFn = ReturnType<typeof makeT>;
