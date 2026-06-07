/**
 * useCoreScroll.ts — The cinematic, R3F-native. ONE damped useFrame reads
 * `scroll.offset` / `scroll.range()` and drives every beat of the intro:
 *   - camera dollies through the glass (HOME_POSE → CAMERA_END)
 *   - glass transmission + opacity (and the inner core) fade to 0
 *   - ambient orbit particles fade out
 *   - the morph field's `uMorph` ramps 0→1 (icosa surface → grid)
 *   - a white FlashPlane spikes at the pass-through to mask the swap
 *
 * Every driven value is eased with frame-rate-independent `damp` (never linear,
 * never allocates). ScrollControls owns the virtual scroll → this IS the pin.
 * Mounted only when motion is allowed (reduced-motion bypass lives in Phase 07).
 */
import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { Vector3, type MeshBasicMaterial, type MeshPhysicalMaterial, type PointsMaterial, type ShaderMaterial } from 'three';
import { CAMERA_END, HOME_POSE, MORPH } from '../core-config';
import { damp } from '../damp-utils';

export interface CoreScrollRefs {
  glassMatRef: React.RefObject<MeshPhysicalMaterial | null>;
  innerMatRef: React.RefObject<MeshBasicMaterial | null>;
  orbitMatRef: React.RefObject<PointsMaterial | null>;
  morphMatRef: React.RefObject<ShaderMaterial | null>;
  flashMatRef: React.RefObject<ShaderMaterial | null>;
  /** Set true once the dolly owns the camera so PointerLerp stops fighting it. */
  suspendCameraRef: React.MutableRefObject<boolean>;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function useCoreScroll(refs: CoreScrollRefs): void {
  const scroll = useScroll();
  const camTarget = useMemo(() => new Vector3(), []);

  useFrame((state, dt) => {
    const o = scroll.offset;

    // ── Camera dolly through the glass ────────────────────────────────────────
    const dolly = scroll.range(MORPH.dollyStart, MORPH.dollyLen); // 0→1
    const owns = o > MORPH.dollyStart - 0.02;
    refs.suspendCameraRef.current = owns;
    if (owns) {
      const cam = state.camera;
      const px = lerp(HOME_POSE.position[0], CAMERA_END.position[0], dolly);
      const py = lerp(HOME_POSE.position[1], CAMERA_END.position[1], dolly);
      const pz = lerp(HOME_POSE.position[2], CAMERA_END.position[2], dolly);
      cam.position.x = damp(cam.position.x, px, 0.18, dt);
      cam.position.y = damp(cam.position.y, py, 0.18, dt);
      cam.position.z = damp(cam.position.z, pz, 0.18, dt);
      camTarget.set(
        lerp(HOME_POSE.target[0], CAMERA_END.target[0], dolly),
        lerp(HOME_POSE.target[1], CAMERA_END.target[1], dolly),
        lerp(HOME_POSE.target[2], CAMERA_END.target[2], dolly),
      );
      cam.lookAt(camTarget);
    }

    // ── Glass + inner core dissolve ───────────────────────────────────────────
    const glassFade = 1 - scroll.range(MORPH.glassFadeStart, MORPH.glassFadeLen);
    const glass = refs.glassMatRef.current;
    if (glass) {
      glass.opacity = damp(glass.opacity, glassFade, 0.12, dt);
      glass.transmission = damp(glass.transmission, glassFade, 0.12, dt);
    }
    const inner = refs.innerMatRef.current;
    if (inner) inner.opacity = damp(inner.opacity, glassFade, 0.12, dt);

    // ── Ambient orbiters fade as the grid takes over ──────────────────────────
    const orbitFade = 1 - scroll.range(MORPH.orbitFadeStart, MORPH.orbitFadeLen);
    const orbit = refs.orbitMatRef.current;
    if (orbit) orbit.opacity = damp(orbit.opacity, 0.9 * orbitFade, 0.12, dt);

    // ── Morph: icosa surface → grid lattice ───────────────────────────────────
    const morph = refs.morphMatRef.current;
    if (morph) {
      const u = morph.uniforms.uMorph;
      u.value = damp(u.value, scroll.range(MORPH.shatterStart, MORPH.shatterLen), 0.1, dt);
    }

    // ── Flash spike masks the swap (triangular pulse, already smooth via scroll) ─
    const flash = refs.flashMatRef.current;
    if (flash) {
      const d = Math.abs(o - MORPH.flashAt);
      flash.uniforms.uAlpha.value = Math.max(0, 1 - d / (MORPH.flashLen * 0.5));
    }
  });
}
