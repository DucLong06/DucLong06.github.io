/**
 * CyberScene.tsx — The heavy R3F layer for the "Floating Data Block" hero
 * (lazy-loaded only when 3D is enabled). Renders the dark canvas (background +
 * fog + lights), the central data block (Phase 02/03), the always-visible orbit
 * timeline of projects + experience (Phase 04), the HUD stats (Phase 05), and
 * the holographic deep-dive card. Bloom postprocessing is added in Phase 06.
 */
import { useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import type { SceneData } from '../../../lib/scene/scene-data-types';
import { HOME_POSE, PALETTE, type SceneFocus } from './cyber-config';
import { useReducedMotion } from './use-reduced-motion';
import { QualityTierProvider } from './use-quality-tier';
import { SceneChrome } from '../island/ui/SceneChrome';
import { DataBlock } from './data-block/DataBlock';
import { PostFX } from './PostFX';
import { OrbitTimeline } from './orbit/OrbitTimeline';
import { DeepDiveCard } from './ui/DeepDiveCard';
import { HudStats } from './ui/HudStats';

interface Props {
  data: SceneData;
  onExitToClassic: () => void;
}

export default function CyberScene({ data, onExitToClassic }: Props) {
  const [focus, setFocus] = useState<SceneFocus>(null);
  const reduced = useReducedMotion();

  const selectProject = useCallback((id: string) => setFocus({ kind: 'project', id }), []);
  const selectExperience = useCallback((id: string) => setFocus({ kind: 'experience', id }), []);
  const close = useCallback(() => setFocus(null), []);

  return (
    <>
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, powerPreference: 'high-performance' }}
        camera={{ position: HOME_POSE.position, fov: HOME_POSE.fov, near: 0.1, far: 100 }}
        aria-label={`${data.profile.name} — interactive holographic data block with project timeline`}
        role="img"
      >
        <color attach="background" args={[PALETTE.bgDeep]} />
        <fog attach="fog" args={[PALETTE.bg2, 9, 22]} />

        {/* Low ambient + cool/warm rim lights establish the neon mood. */}
        <ambientLight intensity={0.25} />
        <directionalLight position={[4, 5, 6]} intensity={1.1} color={PALETTE.neon} />
        <directionalLight position={[-5, -2, -4]} intensity={0.7} color={PALETTE.amber} />

        {/* One shared quality tier drives both transmission detail and bloom. */}
        <QualityTierProvider enabled={!reduced}>
          <DataBlock />

          <OrbitTimeline
            data={data}
            focus={focus}
            frozen={reduced}
            onSelectProject={selectProject}
            onSelectExperience={selectExperience}
          />

          <PostFX enabled={!reduced} />
        </QualityTierProvider>

        <AdaptiveDpr />
      </Canvas>

      <HudStats data={data} />

      <SceneChrome
        name={data.profile.name}
        focusedId={null}
        onHome={close}
        onExitToClassic={onExitToClassic}
      />

      {focus && <DeepDiveCard focus={focus} data={data} onClose={close} />}
    </>
  );
}
