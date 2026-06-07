/**
 * GraphScene.tsx — Composes lights, edges and all nodes inside the Canvas.
 * Computes hover-neighbor highlighting (dims everything not adjacent to the
 * hovered node) and forwards selection upward.
 */
import { useMemo } from 'react';
import type { GraphData, GraphNode as GraphNodeData } from '../../../lib/graph/graph-data-types';
import GraphNodeView from './GraphNode';
import GraphEdge from './GraphEdge';

interface Props {
  data: GraphData;
  hoveredId: string | null;
  selectedId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (node: GraphNodeData) => void;
}

export default function GraphScene({ data, hoveredId, selectedId, onHover, onSelect }: Props) {
  // Undirected adjacency for neighbor highlighting.
  const adjacency = useMemo(() => {
    const map = new Map<string, Set<string>>();
    const add = (a: string, b: string) => {
      if (!map.has(a)) map.set(a, new Set());
      map.get(a)!.add(b);
    };
    for (const l of data.links) {
      add(l.source, l.target);
      add(l.target, l.source);
    }
    return map;
  }, [data]);

  const highlightSet = useMemo(() => {
    if (!hoveredId) return null;
    const set = new Set<string>([hoveredId]);
    adjacency.get(hoveredId)?.forEach((id) => set.add(id));
    return set;
  }, [hoveredId, adjacency]);

  return (
    <>
      <ambientLight intensity={0.9} />
      <pointLight position={[0, 0, 0]} intensity={1.4} distance={120} decay={1.2} />
      <pointLight position={[30, 30, 30]} intensity={0.4} />

      <GraphEdge data={data} />

      {data.nodes.map((node) => (
        <GraphNodeView
          key={node.id}
          node={node}
          hovered={node.id === hoveredId}
          selected={node.id === selectedId}
          dimmed={Boolean(highlightSet) && !highlightSet!.has(node.id)}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
