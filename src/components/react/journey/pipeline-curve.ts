/**
 * pipeline-curve.ts — Builds the THREE.CatmullRomCurve3 the camera flies and the
 * data river flows along. Memoized so ScrollCamera, DataRiver, StationMarkers and
 * the tube all share ONE curve instance.
 */
import { useMemo } from 'react';
import { CatmullRomCurve3, Vector3 } from 'three';
import { CURVE_POINTS } from './journey-config';

export function buildPipelineCurve(): CatmullRomCurve3 {
  const points = CURVE_POINTS.map(([x, y, z]) => new Vector3(x, y, z));
  return new CatmullRomCurve3(points, false, 'catmullrom', 0.5);
}

export function useJourneyCurve(): CatmullRomCurve3 {
  return useMemo(() => buildPipelineCurve(), []);
}
