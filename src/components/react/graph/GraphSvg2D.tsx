/**
 * GraphSvg2D.tsx — Lightweight 2D SVG graph for mobile / no-WebGL /
 * reduced-motion. Reuses the build-time node positions (x,y projected) so it
 * looks like the same graph at a fraction of the cost. Fully keyboard-operable:
 * each node is a focusable <circle role="button"> with the same click/Enter →
 * nav/select behavior.
 */
import { useMemo, useState } from 'react';
import type { GraphData, GraphNode } from '../../../lib/graph/graph-data-types';
import { EDGE } from './graph-config';

interface Props {
  data: GraphData;
  onNavigate?: (node: GraphNode) => void;
  onSelect?: (node: GraphNode | null) => void;
}

const VIEW_W = 1000;
const VIEW_H = 640;
const PAD = 70;

export default function GraphSvg2D({ data, onNavigate, onSelect }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Project (x,y) → SVG space, preserving aspect, centered.
  const { place, maxR } = useMemo(() => {
    const xs = data.nodes.map((n) => n.x);
    const ys = data.nodes.map((n) => n.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const spanX = maxX - minX || 1;
    const spanY = maxY - minY || 1;
    const scale = Math.min((VIEW_W - PAD * 2) / spanX, (VIEW_H - PAD * 2) / spanY);
    const offX = (VIEW_W - spanX * scale) / 2;
    const offY = (VIEW_H - spanY * scale) / 2;
    const place = (n: GraphNode) => ({
      cx: offX + (n.x - minX) * scale,
      // invert Y so "up" in 3D is up on screen
      cy: VIEW_H - (offY + (n.y - minY) * scale),
    });
    return { place, maxR: Math.max(...data.nodes.map((n) => n.size)) };
  }, [data]);

  const posMap = useMemo(
    () => new Map(data.nodes.map((n) => [n.id, place(n)])),
    [data, place],
  );

  const handle = (node: GraphNode) => {
    if (node.nav) {
      onNavigate?.(node);
      return;
    }
    const next = activeId === node.id ? null : node.id;
    setActiveId(next);
    onSelect?.(next ? node : null);
  };

  return (
    <svg
      className="graph-svg2d"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      role="group"
      aria-label={data.lang === 'vi' ? 'Đồ thị tri thức 2D' : '2D knowledge graph'}
    >
      <g className="graph-svg2d__edges" stroke={EDGE.color} strokeOpacity={EDGE.opacity}>
        {data.links.map((l, i) => {
          const s = posMap.get(l.source);
          const t = posMap.get(l.target);
          if (!s || !t) return null;
          return <line key={i} x1={s.cx} y1={s.cy} x2={t.cx} y2={t.cy} />;
        })}
      </g>

      <g className="graph-svg2d__nodes">
        {data.nodes.map((node) => {
          const p = posMap.get(node.id)!;
          const r = 6 + (node.size / maxR) * 16;
          const active = node.id === activeId;
          return (
            <g key={node.id} transform={`translate(${p.cx} ${p.cy})`}>
              {/* foreignObject button for native keyboard focus + semantics */}
              <circle
                className={`graph-svg2d__node${active ? ' is-active' : ''}`}
                r={r}
                fill={node.color}
                tabIndex={0}
                role="button"
                aria-label={node.label}
                onClick={() => handle(node)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handle(node);
                  }
                }}
              />
              {(node.type === 'root' ||
                node.type === 'company' ||
                node.type === 'section' ||
                active) && (
                <text className="graph-svg2d__label" y={-r - 6} textAnchor="middle">
                  {node.label}
                </text>
              )}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
