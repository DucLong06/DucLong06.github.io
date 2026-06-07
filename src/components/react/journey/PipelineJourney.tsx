/**
 * PipelineJourney.tsx — Thin capability gate + entry island for the Data
 * Pipeline Journey (client:only).
 *
 *   enabled  → hides the SSR 2D site (body.journey-active) and lazy-loads the
 *              heavy JourneyStage (three / r3f / postprocessing) on demand.
 *   fallback → renders nothing; the SSR 2D PortfolioHome stays visible (mobile /
 *              no-WebGL / reduced-motion). pending → same, until decided.
 *
 * Keeping the WebGL stage behind React.lazy means non-enabled visitors never
 * download the ~250 kB-gzip three.js bundle — the gate itself is tiny. The full
 * 2D site is always in the DOM (SEO/no-JS/a11y); this is pure enhancement.
 */
import { lazy, Suspense, useEffect } from 'react';
import { useJourneyCapability } from './use-journey-capability';
import JourneySkeleton from './journey-skeleton';
import type { JourneyData } from '../../../lib/pipeline/pipeline-data-types';

const JourneyStage = lazy(() => import('./JourneyStage'));

interface Props {
  data: JourneyData;
}

export default function PipelineJourney({ data }: Props) {
  const { capability, dpr } = useJourneyCapability();
  const enabled = capability === 'enabled';

  // Toggle the SSR 2D site off only while the journey owns the page.
  useEffect(() => {
    document.body.classList.toggle('journey-active', enabled);
    return () => document.body.classList.remove('journey-active');
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Suspense fallback={<JourneySkeleton />}>
      <JourneyStage data={data} dpr={dpr} />
    </Suspense>
  );
}
