/**
 * neon-halo.ts — Additive radial-gradient sprite used as cheap "fake bloom"
 * around emissive structures (ported from the prototype `makeHalo` + `haloTex`).
 *
 * The shared `haloTex` canvas texture is built once and reused by every halo and
 * by the Skills ledger glint Points, so we never allocate per-structure textures.
 */
import {
  AdditiveBlending,
  CanvasTexture,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  type ColorRepresentation,
} from 'three';

/** Soft white radial-gradient texture (transparent edges) shared by all halos. */
export const haloTex: CanvasTexture = (() => {
  const s = 128;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const x = c.getContext('2d')!;
  const g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,.55)');
  g.addColorStop(0.55, 'rgba(255,255,255,.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, s, s);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
})();

/** Build an additive-blended halo sprite of the given color + world size. */
export function makeHalo(color: ColorRepresentation, size: number): Sprite {
  const m = new SpriteMaterial({
    map: haloTex,
    color,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
    opacity: 0.85,
  });
  const sp = new Sprite(m);
  sp.scale.set(size, size, 1);
  return sp;
}
