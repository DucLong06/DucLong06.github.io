/**
 * JourneyScene.tsx — Everything inside the <Canvas>: shared curve, faint pipe,
 * data river, station markers, lighting, and the scroll-driven camera. Kept lean
 * so the Canvas children stay readable; visuals are tuned in journey-config.
 */
import { type RefObject } from 'react';
import { type CatmullRomCurve3 } from 'three';
import ScrollCamera from './ScrollCamera';
import PipelineTube from './PipelineTube';
import DataRiver from './DataRiver';
import StationMarkers from './StationMarkers';
import { NEON } from '../../../lib/pipeline/pipeline-palette';

interface Props {
  curve: CatmullRomCurve3;
  progressRef: RefObject<number>;
  station: number;
}

export default function JourneyScene({ curve, progressRef, station }: Props) {
  return (
    <>
      <color attach="background" args={[NEON.bgNavy]} />
      <fog attach="fog" args={[NEON.bgNavy, 18, 90]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[0, 10, 6]} intensity={0.6} color={NEON.cyan} />
      <pointLight position={[0, -6, -60]} intensity={0.5} color={NEON.violet} />

      <PipelineTube curve={curve} />
      <DataRiver curve={curve} />
      <StationMarkers curve={curve} station={station} />

      <ScrollCamera curve={curve} progressRef={progressRef} />
    </>
  );
}
