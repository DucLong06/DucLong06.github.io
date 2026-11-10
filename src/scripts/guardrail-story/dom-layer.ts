/**
 * dom-layer.ts — the text sits in the DOM (SEO, i18n, selectable) and is
 * positioned to match the canvas geometry. Every positioned element carries
 * `data-gs="<key>"`; `layoutBoxes()` maps those keys onto the StoryLayout so
 * the same markup works for the landscape and compact stages.
 * `paintLayers()` applies the dynamic bits: layer opacity, HUD strings,
 * guardrail check reveal and the hex-scramble decode of the name.
 */
import type { Box, StoryLayout } from './layout-types';

export interface StoryRuntime {
  words: string[];
  sceneLabels: string[];
  hud: { auto: string; paused: string; play: string; pause: string };
}

export interface PaintState {
  scene: number;
  formed: boolean;
  playing: boolean;
  reduced: boolean;
  scr: number;   // scan x position in stage units; 9999 = fully decoded
  chk: number;   // number of guardrail checks revealed (0..5)
}

/** Flatten the layout into `data-gs` key → Box. */
export function layoutBoxes(L: StoryLayout): Record<string, Box> {
  const b: Record<string, Box> = {};
  const { s0, s1, s2, s3 } = L;
  b['role'] = s0.role; b['request'] = s0.request; b['checks'] = s0.checks; b['tagline'] = s0.tagline;
  s0.words.forEach((x, i) => { b[`word-${i}`] = x; b[`hex-${i}`] = s0.hex[i]; b[`token-${i}`] = s0.token[i]; });

  b['s1-title'] = s1.title;
  s1.heads.forEach((x, i) => (b[`s1-head-${i}`] = x));
  s1.sys.forEach((x, i) => { b[`s1-sys-${i}`] = x; b[`s1-res-${i}`] = s1.res[i]; s1.cells[i].forEach((c, j) => (b[`s1-cell-${i}-${j}`] = c)); });

  b['s2-title'] = s2.title; b['s2-out'] = s2.outLabel;
  s2.heads.forEach((x, i) => (b[`s2-head-${i}`] = x));
  s2.langLabels.forEach((x, i) => (b[`s2-lang-${i}`] = x));
  s2.buildLabels.forEach((x, i) => (b[`s2-build-${i}`] = x));
  s2.shipLabels.forEach((x, i) => (b[`s2-ship-${i}`] = x));

  b['s3-title'] = s3.title; b['s3-core'] = s3.core;
  s3.left.forEach((x, i) => { b[`s3-left-${i}`] = x; b[`s3-right-${i}`] = s3.right[i]; });
  return b;
}

/** Write left/top/width/height onto every `[data-gs]` element. */
export function positionLayers(root: HTMLElement, L: StoryLayout): void {
  const boxes = layoutBoxes(L);
  root.querySelectorAll<HTMLElement>('[data-gs]').forEach((el) => {
    const bx = boxes[el.dataset.gs!];
    if (!bx) return;
    el.style.left = `${bx.x}px`;
    el.style.top = `${bx.y}px`;
    el.style.width = `${bx.w}px`;
    el.style.height = `${bx.h}px`;
  });
}

const POOL = '0123456789ABCDEF#$%&<>/=+*';

/**
 * Decode effect: characters left of the scan position show the real letter,
 * the rest show a random hex-ish glyph. Thresholds are relative to each
 * token box (the demo's 210 + 320a + … expressed in box units).
 */
function scrambled(word: string, bx: Box, scr: number): string {
  const chars = Array.from(word);
  let txt = '';
  for (let b = 0; b < chars.length; b++) {
    const threshold = bx.x + bx.w * (40 / 300) + ((b + 1) / chars.length) * bx.w * (220 / 300);
    txt += scr >= threshold ? chars[b] : POOL.charAt(Math.floor(Math.random() * POOL.length));
  }
  return txt;
}

/** Apply HUD strings, layer visibility, check reveal and name decode. */
export function paintLayers(root: HTMLElement, rt: StoryRuntime, L: StoryLayout, st: PaintState): void {
  const q = <T extends Element>(sel: string) => root.querySelectorAll<T>(sel);
  const label = root.querySelector<HTMLElement>('.gs-label');
  const hud = root.querySelector<HTMLElement>('.gs-hud');
  const toggle = root.querySelector<HTMLButtonElement>('.gs-toggle');
  if (label) label.textContent = rt.sceneLabels[st.scene] ?? '';
  if (hud) hud.textContent = st.playing && !st.reduced ? rt.hud.auto : rt.hud.paused;
  if (toggle) {
    toggle.textContent = st.playing ? rt.hud.pause : rt.hud.play;
    toggle.setAttribute('aria-pressed', st.playing ? 'true' : 'false');
    toggle.hidden = st.reduced;
  }
  q<HTMLElement>('[data-o]').forEach((el) => {
    el.style.opacity = Number(el.dataset.o) === st.scene && st.formed ? '1' : '0';
  });
  q<HTMLElement>('[data-c]').forEach((el) => {
    el.style.opacity = st.chk > Number(el.dataset.c) ? '1' : '0';
  });
  q<HTMLElement>('[data-w]').forEach((el) => {
    const i = Number(el.dataset.w);
    el.textContent = scrambled(rt.words[i] ?? '', L.s0.words[i], st.scr);
  });
}
