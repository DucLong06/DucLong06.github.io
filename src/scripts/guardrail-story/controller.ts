/**
 * controller.ts — wires the Guardrail Story together: layout fitting (landscape
 * ↔ compact), scene state machine (morph → hold), autoplay, scroll-driven
 * steps, prev / pause / next controls, reduced-motion handling and the
 * requestAnimationFrame loop. Entry point: `initGuardrailStory(root)`.
 *
 * Scroll model: `.gs-track` is (SCENES + 1) × 100svh tall and `.gs-sticky`
 * pins the stage. Scene k is shown while the track offset is in
 * [k·step, (k+1)·step). Autoplay advances scenes AND syncs the scroll offset,
 * so manual scrolling and autoplay never disagree. Wheel / touch / keys pause
 * autoplay; it stops entirely once the reader is past the story.
 */
import { landscapeLayout } from './layout-landscape';
import { compactLayout } from './layout-compact';
import type { Pt, StoryLayout } from './layout-types';
import { buildScene, type SceneGeometry } from './geometry';
import { createParticles, retarget, flyParticles, advanceSignals, type Particle } from './particles';
import { makeBackdrop, makeRain, drawRain, sampleGlyphs, SERIF, type RainColumn } from './background';
import { strokeAll, drawScanBeam, drawParticles, fitCanvas } from './render';
import { positionLayers, paintLayers, type StoryRuntime } from './dom-layer';

const SCENES = 4;
const MORPH_MS = 3200;
const HOLD_MS = 5600;
const SCAN_TOTAL_MS = 1300;
const CHECK_STEP_MS = 240;

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export function initGuardrailStory(root: HTMLElement): void {
  const rt = JSON.parse(root.querySelector('.gs-runtime')!.textContent || '{}') as StoryRuntime;
  const q = (s: string) => root.querySelector<HTMLElement>(s)!;
  const track = q('.gs-track'), sticky = q('.gs-sticky'), stage = q('.gs-stage');
  const cv = q('.gs-canvas') as HTMLCanvasElement;
  const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- layout + caches ---------- */
  let L: StoryLayout = landscapeLayout();
  let scale = 1;
  let geoCache: (SceneGeometry | undefined)[] = [];
  let glyphCache: Pt[] | null = null;
  let bg = makeBackdrop(L.W, L.H);
  let rain: RainColumn[] = makeRain(L.W, L.H);
  let P: Particle[] = createParticles(L.W, L.H);

  const geo = (k: number) => (geoCache[k] ??= buildScene(k, L));
  const glyphs = () => (glyphCache ??= sampleGlyphs(rt.words, L));

  /* ---------- scene state ---------- */
  let idx = 0, cur: SceneGeometry | null = null, old: SceneGeometry | null = null;
  let phase: 'morph' | 'hold' = 'morph';
  let t0 = 0, h0 = 0, b0 = 0, last = 0;
  let formed = false, playing = !reduced, scr = 0, chk = 0, started = false;
  let scrambleTimer: ReturnType<typeof setInterval> | undefined;

  const paint = () => paintLayers(root, rt, L, { scene: idx, formed, playing, reduced, scr, chk });

  function begin(k: number, now: number): void {
    old = cur;
    cur = geo(k);
    clearInterval(scrambleTimer);
    retarget(P, cur, k === 0 ? glyphs() : null, L.W, L.H);
    idx = k;
    t0 = now;
    phase = 'morph';
    formed = false;
    paint();
  }

  /** Hex glyphs resolve into the name left → right, then the checks pass. */
  function scramble(): void {
    clearInterval(scrambleTimer);
    if (reduced) { scr = 9999; chk = 9; paint(); return; }
    const s0 = performance.now();
    scr = 0; chk = 0; paint();
    scrambleTimer = setInterval(() => {
      const e = performance.now() - s0;
      if (e < SCAN_TOTAL_MS) scr = L.s0.frame.x + (L.s0.frame.w * e) / L.s0.scanMs;
      else {
        chk = Math.floor((e - SCAN_TOTAL_MS) / CHECK_STEP_MS) + 1;
        scr = 9999;
        if (chk >= 5) clearInterval(scrambleTimer);
      }
      paint();
    }, 45);
  }

  /* ---------- fitting ---------- */
  function switchLayout(compact: boolean): void {
    L = compact ? compactLayout() : landscapeLayout();
    root.classList.toggle('gs--compact', compact);
    stage.style.width = `${L.W}px`;
    stage.style.height = `${L.H}px`;
    geoCache = [];
    glyphCache = null;
    bg = makeBackdrop(L.W, L.H);
    rain = makeRain(L.W, L.H);
    P = createParticles(L.W, L.H);
    positionLayers(root, L);
    if (started) begin(idx, performance.now());
  }

  function fit(): void {
    const cw = sticky.clientWidth, ch = sticky.clientHeight;
    if (!cw || !ch) return;
    const compact = cw < 760 || cw < ch * 1.1;
    if (compact !== L.compact) switchLayout(compact);
    scale = Math.min(cw / L.W, ch / L.H);
    stage.style.setProperty('--gs-k', scale.toFixed(4));
  }
  positionLayers(root, L);
  fit();
  new ResizeObserver(fit).observe(sticky);

  /* ---------- scroll steps ---------- */
  let byCode = false;
  const stepH = () => sticky.clientHeight || window.innerHeight;
  const trackTop = () => track.getBoundingClientRect().top + window.scrollY;
  const sceneFromScroll = () => clamp(Math.floor((window.scrollY - trackTop()) / stepH() + 0.001), 0, SCENES - 1);
  const isPast = () => sticky.getBoundingClientRect().bottom <= 0;

  function syncScroll(k: number): void {
    byCode = true;
    window.scrollTo({ top: trackTop() + k * stepH() + 1, behavior: 'instant' as ScrollBehavior });
    requestAnimationFrame(() => requestAnimationFrame(() => { byCode = false; }));
  }
  addEventListener('scroll', () => {
    if (byCode || !started || isPast()) return;
    const k = sceneFromScroll();
    if (k !== idx) begin(k, performance.now());
  }, { passive: true });

  /* ---------- controls ---------- */
  function pause(): void { if (!playing) return; playing = false; paint(); }
  function resume(): void { playing = true; h0 = performance.now(); paint(); }
  function goTo(k: number): void { pause(); k = clamp(k, 0, SCENES - 1); begin(k, performance.now()); syncScroll(k); }
  const userScrolls = () => { if (playing && !isPast()) pause(); };
  addEventListener('wheel', userScrolls, { passive: true });
  addEventListener('touchmove', userScrolls, { passive: true });
  addEventListener('keydown', (e) => {
    if ((e.target as HTMLElement | null)?.closest('input, textarea, select')) return;
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' '].includes(e.key)) userScrolls();
    if (isPast()) return;
    if (e.key === 'ArrowRight') goTo(idx + 1);
    if (e.key === 'ArrowLeft') goTo(idx - 1);
  });
  q('.gs-prev').addEventListener('click', () => goTo(idx - 1));
  q('.gs-next').addEventListener('click', () => goTo(idx + 1));
  q('.gs-toggle').addEventListener('click', () => (playing ? pause() : resume()));

  /* ---------- frame loop ---------- */
  function frame(now: number): void {
    requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    if (!cur || isPast() || document.hidden) return;
    const ctx = fitCanvas(cv, L.W, L.H, scale);
    ctx.clearRect(0, 0, L.W, L.H);
    ctx.drawImage(bg, 0, 0, L.W, L.H);
    if (!reduced) drawRain(ctx, rain, L.H, now, dt);
    const hold = phase === 'hold';
    let r = 1;
    if (!hold) {
      const g = Math.min(1, (now - t0) / (reduced ? 1 : MORPH_MS));
      r = clamp((g - 0.5) / 0.5, 0, 1);
      flyParticles(P, g);
      if (old && g < 0.25) strokeAll(ctx, old, 1, 1 - g * 4);
      if (g >= 1) {
        phase = 'hold'; h0 = b0 = now; formed = true; paint();
        if (idx === 0) scramble();
      }
    } else {
      advanceSignals(P, cur, dt);
      if (playing && !reduced && now - h0 > HOLD_MS) {
        const k = (idx + 1) % SCENES;
        begin(k, now);
        syncScroll(k);
      }
    }
    strokeAll(ctx, cur, r, 1);
    if (hold && !reduced && idx === 0 && now - b0 < SCAN_TOTAL_MS) drawScanBeam(ctx, L.s0.frame, (now - b0) / L.s0.scanMs);
    drawParticles(ctx, P, { hold, sinceHold: now - h0, r });
  }
  requestAnimationFrame(frame);

  /* ---------- start once the serif is ready (glyph sampling needs it) ---------- */
  const go = () => { if (started) return; started = true; begin(sceneFromScroll(), performance.now()); };
  try { document.fonts.load(`600 84px ${SERIF}`, rt.words.join(' ')).then(go, go); } catch { go(); }
  setTimeout(go, 1800);
  paint();
}
