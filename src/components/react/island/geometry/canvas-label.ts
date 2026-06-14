/**
 * canvas-label.ts — Crisp canvas-text sprite for in-world labels, hash glyphs,
 * and readouts (ported from the prototype `makeLabel`).
 *
 * The `mono` option uses the self-hosted Bitcount family (Phase 06). Because the
 * font may not be parsed when the texture first bakes, mono labels re-bake once
 * `document.fonts.ready` resolves so the LED/ledger glyphs render correctly
 * instead of falling back to a generic monospace.
 */
import { CanvasTexture, Sprite, SpriteMaterial, SRGBColorSpace } from 'three';

export interface LabelOptions {
  color?: string;
  glow?: string;
  font?: number;
  mono?: boolean;
  weight?: string;
  opacity?: number;
  wpx?: number;
  hpx?: number;
}

const MONO_FAMILY = "'Bitcount Prop Single', ui-monospace, monospace";
const SANS_FAMILY = 'Segoe UI, system-ui, sans-serif';

/** Build (or re-bake) the text texture onto an existing canvas. */
function bake(cv: HTMLCanvasElement, text: string, opt: Required<LabelOptions>): CanvasTexture {
  const cx = cv.getContext('2d')!;
  cx.clearRect(0, 0, opt.wpx, opt.hpx);
  cx.font = `${opt.weight} ${opt.font}px ${opt.mono ? MONO_FAMILY : SANS_FAMILY}`;
  cx.textAlign = 'center';
  cx.textBaseline = 'middle';
  cx.shadowColor = opt.glow;
  cx.shadowBlur = 14;
  cx.fillStyle = opt.color;
  cx.fillText(text, opt.wpx / 2, opt.hpx / 2);
  const tex = new CanvasTexture(cv);
  tex.colorSpace = SRGBColorSpace;
  return tex;
}

/** Create a label sprite. Caller sets final world scale via `sprite.scale`. */
export function makeLabel(text: string, options: LabelOptions = {}): Sprite {
  const opt: Required<LabelOptions> = {
    color: '#cfeeff',
    glow: '#38e1ff',
    font: 26,
    mono: false,
    weight: 'bold',
    opacity: 0.95,
    wpx: 256,
    hpx: 64,
    ...options,
  };
  const cv = document.createElement('canvas');
  cv.width = opt.wpx;
  cv.height = opt.hpx;
  const tex = bake(cv, text, opt);
  const mat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: opt.opacity });
  const sp = new Sprite(mat);
  sp.scale.set(opt.wpx / opt.hpx, 1, 1);

  // Bitcount may load after the first bake — re-bake once the font is ready so
  // mono glyphs use the LED face rather than a fallback (Phase 06 requirement).
  if (opt.mono && typeof document !== 'undefined' && document.fonts?.ready) {
    document.fonts.ready.then(() => {
      const next = bake(cv, text, opt);
      mat.map = next;
      mat.needsUpdate = true;
      tex.dispose();
    });
  }
  return sp;
}
