/**
 * CoreScene.tsx — The heavy R3F "Glass Core" hero (lazy-loaded only when 3D is
 * enabled). Renders the dark canvas (background + fog + neon lights), the glass
 * icosahedron Core with its glowing inner core, and damped pointer motion.
 *
 * Ambient orbit particles (Phase 03), the icosa↔grid morph field (Phase 04),
 * the cinematic scroll timeline (Phase 05) and the DOM workplace cards (Phase 06)
 * slot into the marked insertion points. Reduced-motion renders everything
 * static (no breathe / parallax / pin) as the universal safety net.
 */
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, ScrollControls, useScroll } from '@react-three/drei';
import {
  ACESFilmicToneMapping,
  type Group,
  type MeshBasicMaterial,
  type MeshPhysicalMaterial,
  type PointsMaterial,
  type ShaderMaterial,
} from 'three';
import type { SceneData } from '../../../lib/scene/scene-data-types';
import { HOME_POSE, PAGES, PALETTE } from './core-config';
import { useReducedMotion } from './use-reduced-motion';
import { QualityTierProvider } from './use-quality-tier';
import { GlassCore } from './glass/GlassCore';
import { InnerCore } from './glass/InnerCore';
import { PointerLerp } from './glass/PointerLerp';
import { OrbitParticles } from './particles/OrbitParticles';
import { MorphField } from './particles/MorphField';
import { FlashPlane } from './timeline/FlashPlane';
import { useCoreScroll, type CoreScrollRefs } from './timeline/useCoreScroll';
import { WorkplaceCards } from './overlay/WorkplaceCards';
import { CardsContent } from './overlay/CardsContent';
import { PostFX } from './PostFX';
import { CoreChrome } from './ui/CoreChrome';

interface Props {
  data: SceneData;
  onExitToClassic: () => void;
}

/** Runs the single damped scroll useFrame. Must live inside <ScrollControls>. */
function CoreTimeline(refs: CoreScrollRefs) {
  useCoreScroll(refs);
  return null;
}

/** Captures the ScrollControls scroll element so the DOM skip button can drive it. */
function CaptureScrollEl({ elRef }: { elRef: React.MutableRefObject<HTMLElement | null> }) {
  const scroll = useScroll();
  useEffect(() => {
    elRef.current = scroll.el;
  }, [scroll, elRef]);
  return null;
}

interface StageProps {
  coreGroupRef: React.RefObject<Group>;
  glassMatRef: React.RefObject<MeshPhysicalMaterial>;
  innerMatRef: React.RefObject<MeshBasicMaterial>;
  orbitMatRef: React.RefObject<PointsMaterial>;
  morphMatRef: React.RefObject<ShaderMaterial>;
  frozen: boolean;
}

/** The Core geometry shared by both the cinematic and the reduced-motion paths. */
function CoreStage({ coreGroupRef, glassMatRef, innerMatRef, orbitMatRef, morphMatRef, frozen }: StageProps) {
  return (
    <>
      <group ref={coreGroupRef}>
        <GlassCore ref={glassMatRef} />
        <InnerCore ref={innerMatRef} />
      </group>
      <OrbitParticles matRef={orbitMatRef} frozen={frozen} />
      <MorphField matRef={morphMatRef} frozen={frozen} />
    </>
  );
}

export default function CoreScene({ data, onExitToClassic }: Props) {
  const reduced = useReducedMotion();
  const coreGroupRef = useRef<Group>(null);
  const glassMatRef = useRef<MeshPhysicalMaterial>(null);
  const innerMatRef = useRef<MeshBasicMaterial>(null);
  const orbitMatRef = useRef<PointsMaterial>(null);
  const morphMatRef = useRef<ShaderMaterial>(null);
  const flashMatRef = useRef<ShaderMaterial>(null);
  const suspendCameraRef = useRef(false);
  const scrollElRef = useRef<HTMLElement | null>(null);

  // Skip-intro: jump the virtual scroll to the settled-grid / cards region.
  const skipIntro = () => {
    const el = scrollElRef.current;
    if (el) el.scrollTo({ top: (el.scrollHeight - el.clientHeight) * 0.95, behavior: 'smooth' });
  };

  return (
    <>
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, powerPreference: 'high-performance' }}
        camera={{ position: HOME_POSE.position, fov: HOME_POSE.fov, near: 0.1, far: 100 }}
        aria-label={`${data.profile.name} — interactive frosted-glass core that morphs into a data grid on scroll`}
        role="img"
      >
        <color attach="background" args={[PALETTE.bgDeep]} />
        <fog attach="fog" args={[PALETTE.bg2, 9, 24]} />

        {/* Low ambient + cool/warm rim lights establish the neon mood. */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 5, 6]} intensity={1.1} color={PALETTE.neon} />
        <directionalLight position={[-5, -2, -4]} intensity={0.7} color={PALETTE.amber} />

        {/* One shared quality tier drives transmission detail, bloom, particle counts. */}
        <QualityTierProvider enabled={!reduced}>
          {reduced ? (
            // Reduced-motion: static Core, NO ScrollControls at all → zero hijack,
            // no scroll overlay over the static cards. (Cards render as DOM below.)
            <CoreStage
              coreGroupRef={coreGroupRef}
              glassMatRef={glassMatRef}
              innerMatRef={innerMatRef}
              orbitMatRef={orbitMatRef}
              morphMatRef={morphMatRef}
              frozen
            />
          ) : (
            // ScrollControls owns the virtual scroll → the pin is intrinsic.
            <ScrollControls pages={PAGES} damping={0.25}>
              <CoreStage
                coreGroupRef={coreGroupRef}
                glassMatRef={glassMatRef}
                innerMatRef={innerMatRef}
                orbitMatRef={orbitMatRef}
                morphMatRef={morphMatRef}
                frozen={false}
              />

              <PointerLerp
                groupRef={coreGroupRef}
                innerMatRef={innerMatRef}
                suspendCameraRef={suspendCameraRef}
              />

              <FlashPlane matRef={flashMatRef} />

              <CoreTimeline
                glassMatRef={glassMatRef}
                innerMatRef={innerMatRef}
                orbitMatRef={orbitMatRef}
                morphMatRef={morphMatRef}
                flashMatRef={flashMatRef}
                suspendCameraRef={suspendCameraRef}
              />

              <CaptureScrollEl elRef={scrollElRef} />
              <WorkplaceCards data={data} />
            </ScrollControls>
          )}

          <PostFX enabled={!reduced} />
        </QualityTierProvider>

        <AdaptiveDpr />
      </Canvas>

      <CoreChrome name={data.profile.name} lang={data.lang} onExitToClassic={onExitToClassic} />

      {/* Skip the cinematic pin straight to the work cards (keyboard + click). */}
      {!reduced && (
        <button type="button" className="core-skip" onClick={skipIntro}>
          {data.strings.hero_cta_work ?? 'View work'}
          <span className="core-skip__chevron" aria-hidden="true">
            ↓
          </span>
        </button>
      )}

      {/* Reduced-motion: no pin — show the cards as a static, immediately-visible overlay. */}
      {reduced && (
        <div className="core-cards-static" role="region" aria-label={data.profile.name}>
          <CardsContent data={data} rootClass="core-cards--static" />
        </div>
      )}
    </>
  );
}
