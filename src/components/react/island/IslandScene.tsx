/**
 * IslandScene.tsx — The heavy R3F layer (lazy-loaded only when 3D is enabled).
 * Owns scene state (focused section + hero visibility), the <Canvas> world,
 * the click-to-focus camera, the floating pins, and the DOM overlay chrome.
 */
import { useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, ContactShadows } from '@react-three/drei';
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
import { TourControl } from './ui/tour-control';
import { useGuidedTour } from './use-guided-tour';

interface Props {
  data: SceneData;
  onExitToClassic: () => void;
}

export default function IslandScene({ data, onExitToClassic }: Props) {
  const [focusedId, setFocusedId] = useState<SectionId | null>(null);
  const [heroVisible, setHeroVisible] = useState(true);

  const t = useCallback((key: string) => data.strings[key] ?? key, [data.strings]);

  // Guided auto-tour: drives focusedId/heroVisible on a timer (controller only).
  const tour = useGuidedTour({
    onFocus: (id) => {
      setHeroVisible(false);
      setFocusedId(id);
    },
    onHome: () => {
      setFocusedId(null);
      setHeroVisible(true); // returning to the floating home view re-shows the overview
    },
  });

  // User-driven actions cancel any running tour before applying their effect.
  const select = useCallback(
    (id: SectionId) => {
      tour.notifyUserInteract();
      setHeroVisible(false);
      setFocusedId(id);
    },
    [tour],
  );
  const goHome = useCallback(() => {
    tour.notifyUserInteract();
    setFocusedId(null);
    setHeroVisible(true); // back-to-island restores the initial overview card
  }, [tour]);
  const exitClassic = useCallback(() => {
    tour.notifyUserInteract();
    onExitToClassic();
  }, [tour, onExitToClassic]);

  // Camera drag: cancel a running tour; if idling at home, reset the idle
  // countdown (drag = activity). The re-arm effect below won't fire on a drag
  // because focusedId/active don't change, so re-arm here where home is known.
  const onCameraDrag = useCallback(() => {
    tour.notifyUserInteract();
    if (focusedId === null && !tour.active) tour.armIdle();
  }, [tour, focusedId]);

  // Re-arm idle auto-start whenever settled at home & not touring (covers both
  // the initial hero idle and post-loop re-arm). Clears otherwise.
  useEffect(() => {
    if (focusedId === null && !tour.active) tour.armIdle();
    else tour.clearIdle();
  }, [focusedId, tour.active, tour.armIdle, tour.clearIdle]);

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

        {/* Soft contact shadow grounds props on the island top — procedural,
            baked once (frames={1}), zero network payload. */}
        <ContactShadows
          position={[0, 0.02, 0]}
          scale={26}
          resolution={512}
          blur={2.6}
          opacity={0.38}
          far={6}
          color={PALETTE.soilDark}
          frames={1}
        />

        <IslandWorld />
        <Pins activeId={focusedId} labelFor={t} onSelect={select} />
        <CameraController focusedId={focusedId} onUserDragStart={onCameraDrag} />
        <AdaptiveDpr />
      </Canvas>

      {/* ── DOM overlay chrome ─────────────────────────────────────────────── */}
      <SceneChrome
        name={data.profile.name}
        focusedId={focusedId}
        onHome={goHome}
        onExitToClassic={exitClassic}
      />

      {heroVisible && (
        <HeroOverlay
          data={data}
          t={t}
          onExplore={() => setHeroVisible(false)}
          onViewWork={() => select('projects')}
          onPlayTour={tour.start}
        />
      )}

      {!heroVisible && <PinDock activeId={focusedId} t={t} onSelect={select} />}

      {tour.active && <TourControl onStop={tour.stop} />}

      {focusedId && (
        <PopupCard
          id={focusedId}
          data={data}
          label={t(getSection(focusedId).labelKey)}
          onClose={goHome}
          autoFocus={!tour.active}
        />
      )}
    </>
  );
}
