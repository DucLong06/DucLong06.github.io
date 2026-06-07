/**
 * GraphCanvas.tsx — Hero stage hosting the 3D knowledge graph.
 *
 * Capability gate (use-graph-capability):
 *   pending  → skeleton poster (no CLS while the island hydrates)
 *   fallback → 2D SVG graph (mobile / no-WebGL / reduced-motion)
 *   enabled  → r3f <Canvas> with bloom, orbit, hover/select + camera focus
 *
 * Perf: DPR clamped (≤1.5); frameloop pauses when the stage is offscreen or the
 * tab is hidden (mirrors the old LiquidShader behavior).
 *
 * Selection semantics:
 *   section node  → onNavigate (scroll/route), graph stays put
 *   other node    → focus camera + onSelect (panel wired in Phase 05)
 */
import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { AnimatePresence } from 'framer-motion';
import type { GraphData, GraphNode } from '../../../lib/graph/graph-data-types';
import { useGraphCapability } from './use-graph-capability';
import GraphScene from './GraphScene';
import CameraController from './CameraController';
import GraphSvg2D from './GraphSvg2D';
import GraphSkeleton from './graph-skeleton';
import DetailPanel from './panels/DetailPanel';
import { handleGraphNav } from './graph-nav-handler';
import { CAMERA, DRIFT, BLOOM } from './graph-config';

interface Props {
  data: GraphData;
  hint?: string;
  onNavigate?: (node: GraphNode) => void;
  onSelect?: (node: GraphNode | null) => void;
}

export default function GraphCanvas({ data, hint, onNavigate, onSelect }: Props) {
  const { capability, dpr } = useGraphCapability();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<GraphNode | null>(null);
  const [active, setActive] = useState(true);

  // Pause the render loop when offscreen or tab hidden (battery/perf).
  useEffect(() => {
    if (capability !== 'enabled') return;
    const el = containerRef.current;
    if (!el) return;
    let onscreen = true;
    let tabVisible = true;
    const sync = () => setActive(onscreen && tabVisible);
    const io = new IntersectionObserver(
      ([entry]) => {
        onscreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.01 },
    );
    io.observe(el);
    const onVis = () => {
      tabVisible = document.visibilityState === 'visible';
      sync();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [capability]);

  const navigate = onNavigate ?? handleGraphNav;

  const handleSelect = (node: GraphNode) => {
    if (node.nav) {
      navigate(node);
      return;
    }
    setSelected(node);
    onSelect?.(node);
  };

  const deselect = () => {
    setSelected(null);
    onSelect?.(null);
  };

  const focus: [number, number, number] | null = selected
    ? [selected.x, selected.y, selected.z]
    : null;

  return (
    <div ref={containerRef} className="graph-stage" data-capability={capability}>
      {capability === 'pending' && <GraphSkeleton />}

      {capability === 'fallback' && (
        <GraphSvg2D data={data} onNavigate={navigate} onSelect={(n) => (n ? handleSelect(n) : deselect())} />
      )}

      {capability === 'enabled' && (
        <Canvas
          dpr={dpr}
          frameloop={active ? 'always' : 'never'}
          camera={{ position: CAMERA.position, fov: CAMERA.fov, near: CAMERA.near, far: CAMERA.far }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onPointerMissed={deselect}
          aria-hidden="true"
        >
          <GraphScene
            data={data}
            hoveredId={hoveredId}
            selectedId={selected?.id ?? null}
            onHover={setHovered}
            onSelect={handleSelect}
          />
          <CameraController focus={focus} />
          <OrbitControls
            makeDefault
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            autoRotate
            autoRotateSpeed={DRIFT.autoRotateSpeed}
            minDistance={CAMERA.minDistance}
            maxDistance={CAMERA.maxDistance}
          />
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
      )}

      {hint && capability === 'enabled' && (
        <p className="graph-hint" aria-hidden="true">
          {hint}
        </p>
      )}

      <AnimatePresence>
        {selected && capability !== 'pending' && (
          <DetailPanel
            key={selected.id}
            node={selected}
            data={data}
            onClose={deselect}
            onSelectNode={handleSelect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
