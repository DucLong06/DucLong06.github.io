/**
 * guardrail-story.ts — public entry for the Guardrail Story canvas engine.
 * The implementation is split under ./guardrail-story/ (each module < 200 lines):
 *   layout-types · layout-landscape · layout-compact — stage geometry (one source of truth)
 *   geometry      — polylines per scene         particles — fly-in + signal dots
 *   background    — glows, dot grid, hex rain   render    — strokes, scan beam, dots
 *   dom-layer     — positions/paints the text   controller — scenes, autoplay, scroll, controls
 * Text/data live in src/data/guardrail-story.ts; markup in components/astro/GuardrailStory.astro.
 */
export { initGuardrailStory } from './guardrail-story/controller';
export type { StoryRuntime } from './guardrail-story/dom-layer';
export type { StoryLayout } from './guardrail-story/layout-types';
