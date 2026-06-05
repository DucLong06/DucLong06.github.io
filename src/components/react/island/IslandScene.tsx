/**
 * IslandScene.tsx — The heavy R3F layer (lazy-loaded only when 3D is enabled).
 * Owns scene state (focused section + hero visibility), the <Canvas> world,
 * the click-to-focus camera, the floating pins, and the DOM overlay chrome.
 */
import { useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import type { SceneData, SectionId } from '../../../lib/scene/scene-data-types';
import { HOME_POSE, PALETTE, getSection } from './scene-config';
import { IslandWorld } from './IslandWorld';
import { Pins } from './Pins';
import { CameraController } from './CameraController';
import { HeroOverlay } from './ui/HeroOverlay';
import { PinDock } from './ui/PinDock';
import { SceneChrome } from './ui/SceneChrome';
import { PopupCard } from './ui/PopupCard';

interface Props {
  data: SceneData;
  onExitToClassic: () => void;
}

export default function IslandScene({ data, onExitToClassic }: Props) {
  const [focusedId, setFocusedId] = useState<SectionId | null>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  const t = useCallback((key: string) => data.strings[key] ?? key, [data.strings]);

  const select = useCallback((id: SectionId) => {
    setHeroVisible(false);
    setFocusedId(id);
  }, []);
  const goHome = useCallback(() => setFocusedId(null), []);

  return (
    <>
      <Canvas
        shadows
        dpr={[1, 1.8]}
        gl={{ antialias: true, toneMapping: ACESFilmicToneMapping, powerPreference: 'high-performance' }}
        camera={{ position: HOME_POSE.position, fov: 38, near: 0.1, far: 100 }}
        aria-label={`${data.profile.name} — interactive 3D portfolio island`}
        role="img"
      >
        <color attach="background" args={[PALETTE.cream]} />
        <fog attach="fog" args={[PALETTE.cream, 22, 46]} />

        <hemisphereLight args={['#ffffff', '#cdb8ff', 0.85]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={1.6}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={1}
          shadow-camera-far={40}
          shadow-camera-left={-14}
          shadow-camera-right={14}
          shadow-camera-top={14}
          shadow-camera-bottom={-14}
        />

        <IslandWorld />
        <Pins activeId={focusedId} labelFor={t} onSelect={select} />
        <CameraController focusedId={focusedId} />
        <AdaptiveDpr />
      </Canvas>

      {/* ── DOM overlay chrome ─────────────────────────────────────────────── */}
      <SceneChrome
        name={data.profile.name}
        focusedId={focusedId}
        onHome={goHome}
        onExitToClassic={onExitToClassic}
      />

      {heroVisible && (
        <HeroOverlay
          data={data}
          t={t}
          onExplore={() => setHeroVisible(false)}
          onViewWork={() => select('projects')}
        />
      )}

      {!heroVisible && <PinDock activeId={focusedId} t={t} onSelect={select} />}

      {focusedId && (
        <PopupCard
          id={focusedId}
          data={data}
          label={t(getSection(focusedId).labelKey)}
          onClose={goHome}
        />
      )}
    </>
  );
}
