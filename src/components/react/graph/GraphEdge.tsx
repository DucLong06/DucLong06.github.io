/**
 * GraphEdge.tsx — All graph links as a single <lineSegments> (one draw call).
 * Positions are static (precomputed at build), so geometry is built once.
 */
import { useMemo } from 'react';
import * as THREE from 'three';
import type { GraphData } from '../../../lib/graph/graph-data-types';
import { EDGE } from './graph-config';

interface Props {
  data: GraphData;
}

export default function GraphEdge({ data }: Props) {
  const geometry = useMemo(() => {
    const pos = new Map(data.nodes.map((n) => [n.id, [n.x, n.y, n.z] as const]));
    const verts: number[] = [];
    for (const link of data.links) {
      const s = pos.get(link.source);
      const t = pos.get(link.target);
      if (!s || !t) continue;
      verts.push(s[0], s[1], s[2], t[0], t[1], t[2]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    return geo;
  }, [data]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial
        color={EDGE.color}
        transparent
        opacity={EDGE.opacity}
        depthWrite={false}
      />
    </lineSegments>
  );
}
