/**
 * JourneyStage.tsx — The heavy 3D stage, lazy-loaded ONLY when the journey is
 * enabled (see PipelineJourney gate). Pulls in three / r3f / postprocessing, so
 * keeping it behind a dynamic import means mobile / no-WebGL / reduced-motion
 * visitors never download the WebGL bundle.
 *
 * Renders: sticky <Canvas> flythrough + bloom, DOM station overlays, jump-nav,
 * and a top bar (wordmark + lang toggle). Perf: DPR clamped; frameloop pauses
 * when the tab is hidden.
 */
import { Suspense, useEffect, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { useJourneyScroll, scrollToStation } from './journey-scroll';
import { useJourneyCurve } from './pipeline-curve';
import { CAMERA, BLOOM, SCROLL_VH } from './journey-config';
import JourneyScene from './JourneyScene';
import JourneyOverlays from './JourneyOverlays';
import JourneyNav from './JourneyNav';
import JourneySkeleton from './journey-skeleton';
import LangToggle from '../LangToggle';
import type { JourneyData } from '../../../lib/pipeline/pipeline-data-types';

interface Props {
  data: JourneyData;
  dpr: [number, number];
}

export default function JourneyStage({ data, dpr }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { progressRef, station } = useJourneyScroll(containerRef);
  const curve = useJourneyCurve();
  const [active, setActive] = useState(true);

  // Pause the render loop when the tab is hidden (battery/perf).
  useEffect(() => {
    const onVis = () => setActive(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  const jump = (i: number) => scrollToStation(containerRef, i);

  return (
    <div className="journey" ref={containerRef} style={{ height: `${SCROLL_VH}vh` }}>
      <div className="journey-sticky">
        <div className="journey-topbar">
          <a className="journey-logo" href={data.lang === 'vi' ? '/vi/' : '/'} aria-label="Hoàng Đức Long — home">
            HDL
          </a>
          <LangToggle />
        </div>

        <Suspense fallback={<JourneySkeleton />}>
          <Canvas
            className="journey-canvas"
            dpr={dpr}
            camera={{ position: [0, CAMERA.offsetY, 0], fov: CAMERA.fov, near: CAMERA.near, far: CAMERA.far }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            frameloop={active ? 'always' : 'never'}
            aria-hidden="true"
          >
            <JourneyScene curve={curve} progressRef={progressRef} station={station} />
            <EffectComposer>
              <Bloom
                intensity={BLOOM.intensity}
                luminanceThreshold={BLOOM.luminanceThreshold}
                luminanceSmoothing={BLOOM.luminanceSmoothing}
                radius={BLOOM.radius}
                mipmapBlur
              />
            </EffectComposer>
          </Canvas>
        </Suspense>

        <JourneyOverlays data={data} station={station} onJump={jump} />
        <JourneyNav lang={data.lang} station={station} onJump={jump} />
      </div>
    </div>
  );
}
