/**
 * IslandScene.tsx — The heavy R3F layer (lazy-loaded only when 3D is enabled).
 * Owns scene state (the focused stop), the neon <Canvas> Quantum world, the
 * custom fly camera, the guided auto-tour, and the DOM overlay chrome + HUD
 * reading panels. Exactly one panel shows at a time (home → About, never blank).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import { ACESFilmicToneMapping } from 'three';
import type { SceneData, SectionId } from '../../../lib/scene/scene-data-types';
import { HOME_POSE, COL, getSection } from './scene-config';
import { QuantumWorld } from './geometry/quantum-world';
import { QuantumCamera } from './quantum-camera';
import { SceneChrome } from './ui/SceneChrome';
import { PinDock } from './ui/PinDock';
import { HudPanels } from './ui/hud-panels';
import { TourControl } from './ui/tour-control';
import { useGuidedTour } from './use-guided-tour';

interface Props {
  data: SceneData;
  onExitToClassic: () => void;
}

export default function IslandScene({ data, onExitToClassic }: Props) {
  const [focusedId, setFocusedId] = useState<SectionId | null>(null);
  // Home maps to the About panel so a reading panel is always present.
  const activeStop: SectionId = focusedId ?? 'about';

  const t = useCallback((key: string) => data.strings[key] ?? key, [data.strings]);

  // Guided auto-tour: drives focusedId on a timer (controller only).
  const tour = useGuidedTour({
    onFocus: (id) => setFocusedId(id),
    onHome: () => setFocusedId(null),
  });

  // User-driven actions cancel any running tour before applying their effect.
  const select = useCallback(
    (id: SectionId) => {
      tour.notifyUserInteract();
      setFocusedId(id);
    },
    [tour],
  );
  const goHome = useCallback(() => {
    tour.notifyUserInteract();
    setFocusedId(null);
  }, [tour]);
  const exitClassic = useCallback(() => {
    tour.notifyUserInteract();
    onExitToClassic();
  }, [tour, onExitToClassic]);

  // Camera drag/scroll: cancel a running tour; if idling at home, reset the idle
  // countdown (drag = activity).
  const onCameraDrag = useCallback(() => {
    tour.notifyUserInteract();
    if (focusedId === null && !tour.active) tour.armIdle();
  }, [tour, focusedId]);

  // Re-arm idle auto-start whenever settled at home & not touring (covers initial
  // boot and post-loop / post-interrupt re-arm). Clears otherwise.
  useEffect(() => {
    if (focusedId === null && !tour.active) tour.armIdle();
    else tour.clearIdle();
  }, [focusedId, tour.active, tour.armIdle, tour.clearIdle]);

  // Escape returns to the home/About view (the tour hook handles key-to-cancel).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && focusedId !== null) goHome();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [focusedId, goHome]);

  // Returning to the tab while idle at home re-arms the loop (the blur handler in
  // the hook clears the idle timer; no state change would otherwise restart it).
  useEffect(() => {
    const onVisible = () => {
      if (!document.hidden && focusedId === null && !tour.active) tour.armIdle();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, [focusedId, tour.active, tour.armIdle]);

  const nowLabel = useMemo(() => getSection(activeStop).worldLabel, [activeStop]);

  return (
    <>
      <Canvas
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
          powerPreference: 'high-performance',
        }}
        camera={{ position: HOME_POSE.position, fov: 52, near: 0.1, far: 400 }}
        aria-label={`${data.profile.name} — Quantum Data World, interactive 3D portfolio`}
        role="img"
      >
        {/* Neon-glass space: deep violet-black backdrop + exponential fog for depth. */}
        <color attach="background" args={[COL.bg0]} />
        <fogExp2 attach="fog" args={[COL.fog, 0.018]} />

        {/* Cool ambient + three colored points (cyan key, violet rim, pink fill). */}
        <ambientLight color={0x4a3a8a} intensity={0.9} />
        <pointLight color={COL.cyan} intensity={2.2} distance={120} position={[0, 22, 8]} />
        <pointLight color={COL.violet} intensity={1.8} distance={140} position={[-30, 16, -18]} />
        <pointLight color={COL.pink} intensity={1.0} distance={120} position={[26, 10, 18]} />

        <QuantumWorld />
        <QuantumCamera focusedId={focusedId} onUserInteract={onCameraDrag} />
        <AdaptiveDpr />
      </Canvas>

      {/* ── DOM overlay chrome ─────────────────────────────────────────────── */}
      <SceneChrome
        name={data.profile.name}
        focusedId={focusedId}
        onHome={goHome}
        onExitToClassic={exitClassic}
        t={t}
      />

      <PinDock activeId={activeStop} t={t} onSelect={select} />

      <HudPanels activeStop={activeStop} data={data} t={t} />

      <TourControl phase={tour.phase} nowLabel={nowLabel} onStop={tour.stop} t={t} />
    </>
  );
}
