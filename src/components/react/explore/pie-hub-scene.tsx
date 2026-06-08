/**
 * pie-hub-scene.tsx — Top-level 3D explore experience (lazy-loaded entry).
 *
 * Wires the dive FSM (use-zoom-state) → CameraRig (arc dive) + PieHub (solid pie) +
 * SproutBars (stage payload) + DOM overlays (WedgeNav, DetailOverlay panels — the
 * accessible source of truth for every slice). Performance: frameloop is 'always'
 * only while idle-spinning in hub with motion on, 'demand' otherwise, 'never' when
 * the tab is hidden / canvas offscreen. PerformanceMonitor scales DPR.
 *
 * Props arrive from explore-root (capability tier + pre-resolved data).
 */
import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import PieHub from './three/pie-hub';
import HubCenter from './three/hub-center';
import CameraRig from './three/camera-rig';
import SproutBars from './three/sprout-bars';
import WedgeNav from './wedge-nav';
import HudOverlay from './hud-overlay';
import DetailOverlay from './detail-overlay';
import { useZoomState } from './use-zoom-state';
import { stageBars } from './stage-payload-registry';
import { makeT } from './explore-i18n';
import { usePrefersReducedMotion } from './use-prefers-reduced-motion';
import type { CapabilityTier } from './use-webgl-capability';
import type { ExploreData, Lang } from './explore-types';
import type { WedgeId } from './wedges-config';

interface Props {
  locale: Lang;
  tier: CapabilityTier;
  reducedMotion: boolean;
  classicUrl: string;
  cvHref: string;
  data: ExploreData;
}

export default function PieHubScene({ locale, tier, classicUrl, cvHref, data }: Props) {
  const t = makeT(locale);
  const reducedMotion = usePrefersReducedMotion();
  const lite = tier === 'lite';
  const full = tier === 'full';
  const { state: zoom, focus, arriveStage, toHub, arriveHub } = useZoomState();
  const [hoveredId, setHoveredId] = useState<WedgeId | null>(null);
  const [dpr, setDpr] = useState<number>(lite ? 1 : 1.5);
  const [paused, setPaused] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef(0);

  const idle = zoom.mode === 'hub' && !reducedMotion;
  const frameloop = paused ? 'never' : idle ? 'always' : 'demand';
  const onStage = zoom.mode === 'stage';

  // Pause render loop when tab hidden or canvas scrolled offscreen (perf).
  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState !== 'visible');
    document.addEventListener('visibilitychange', onVis);

    let io: IntersectionObserver | undefined;
    const node = rootRef.current;
    if (node && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([entry]) => setPaused(() => (document.hidden ? true : !entry.isIntersecting)), {
        threshold: 0.01,
      });
      io.observe(node);
    }
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      io?.disconnect();
    };
  }, []);

  // Return focus to the triggering slice button when the overlay closes.
  const handleClose = () => {
    const id = zoom.wedgeId;
    toHub();
    if (id) {
      requestAnimationFrame(() => {
        rootRef.current?.querySelector<HTMLElement>(`.wedge-label[data-wedge="${id}"]`)?.focus();
      });
    }
  };

  const bars = onStage ? stageBars(zoom.wedgeId, data) : null;
  const showBars = onStage && full && !reducedMotion && bars !== null && zoom.wedgeId !== null;

  return (
    <div ref={rootRef} className="explore-root">
      <Canvas
        frameloop={frameloop}
        dpr={[1, dpr]}
        camera={{ position: [0, -5.6, 5.4], fov: 45 }}
        gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
        aria-label={t('explore_canvas_aria')}
      >
        <PerformanceMonitor
          onDecline={() => setDpr((d) => Math.max(1, d - 0.5))}
          onIncline={() => setDpr((d) => Math.min(lite ? 1.5 : 2, d + 0.5))}
        />
        <ambientLight intensity={0.65} />
        <pointLight position={[5, 5, 6]} intensity={1.5} color="#34e2ff" />
        <pointLight position={[-5, -4, 4]} intensity={1.1} color="#ff4d9d" />
        <pointLight position={[0, 0, 7]} intensity={0.8} color="#ffffff" />

        <CameraRig
          zoom={zoom}
          reducedMotion={reducedMotion}
          spinRef={spinRef}
          onArriveStage={arriveStage}
          onArriveHub={arriveHub}
        />
        <PieHub
          hoveredId={hoveredId}
          focusedId={zoom.wedgeId}
          idle={idle}
          reducedMotion={reducedMotion}
          lite={lite}
          full={full}
          t={t}
          spinRef={spinRef}
          onHover={setHoveredId}
          onSelect={focus}
        />
        <HubCenter t={t} hint={t('explore_hub_hint')} />

        {showBars && zoom.wedgeId && (
          <SproutBars wedgeId={zoom.wedgeId} spin={spinRef.current} bars={bars} reducedMotion={reducedMotion} />
        )}
      </Canvas>

      {/* DOM overlays */}
      <HudOverlay t={t} locale={locale} classicUrl={classicUrl} cvHref={cvHref} />

      {onStage && <WedgeNav focusedId={zoom.wedgeId} t={t} onFocus={focus} onHub={handleClose} />}

      {onStage && zoom.wedgeId && (
        <DetailOverlay
          wedgeId={zoom.wedgeId}
          data={data}
          t={t}
          reducedMotion={reducedMotion}
          lite={lite}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
