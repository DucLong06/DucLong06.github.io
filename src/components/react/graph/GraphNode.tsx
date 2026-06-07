/**
 * GraphNode.tsx — One node: emissive sphere + optional DOM label.
 * Hover/select states animate scale + emissive via per-frame lerp. Labels use
 * drei <Html> so text is real DOM (legible, i18n, SEO-friendly under the canvas).
 */
import { useEffect, useRef } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type * as THREE from 'three';
import type { GraphNode as GraphNodeData } from '../../../lib/graph/graph-data-types';
import { NODE, LABEL_ALWAYS } from './graph-config';

interface Props {
  node: GraphNodeData;
  hovered: boolean;
  selected: boolean;
  dimmed: boolean;
  onHover: (id: string | null) => void;
  onSelect: (node: GraphNodeData) => void;
}

export default function GraphNode({ node, hovered, selected, dimmed, onHover, onSelect }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const radius = node.size * NODE.radiusScale;

  // Safety net: if this node unmounts while hovered, don't leave the cursor stuck.
  useEffect(() => () => {
    document.body.style.cursor = '';
  }, []);

  useFrame(() => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;
    const targetScale =
      selected ? NODE.selectScale : hovered ? NODE.hoverScale : dimmed ? NODE.dimScale : 1;
    const targetEmissive =
      selected
        ? NODE.selectEmissive
        : hovered
          ? NODE.hoverEmissive
          : dimmed
            ? NODE.dimEmissive
            : NODE.baseEmissive;
    const s = mesh.scale.x + (targetScale - mesh.scale.x) * NODE.lerp;
    mesh.scale.setScalar(s);
    mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * NODE.lerp;
    mat.opacity += ((dimmed ? 0.45 : 1) - mat.opacity) * NODE.lerp;
  });

  const showLabel = LABEL_ALWAYS.includes(node.type) || hovered || selected;
  const isRoot = node.type === 'root';

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(node.id);
    document.body.style.cursor = 'pointer';
  };
  const out = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(null);
    document.body.style.cursor = '';
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(node);
  };

  return (
    <group position={[node.x, node.y, node.z]}>
      <mesh ref={meshRef} onPointerOver={over} onPointerOut={out} onClick={click}>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          ref={matRef}
          color={node.color}
          emissive={node.color}
          emissiveIntensity={NODE.baseEmissive}
          roughness={0.35}
          metalness={0.1}
          transparent
          opacity={1}
        />
      </mesh>

      {showLabel && (
        <Html
          center
          distanceFactor={20}
          position={[0, radius + 0.9, 0]}
          zIndexRange={[20, 0]}
          wrapperClass="graph-label-wrap"
        >
          <div
            className={`graph-label graph-label--${node.type}${dimmed ? ' is-dim' : ''}`}
            aria-hidden="true"
          >
            <span className="graph-label__name">{node.label}</span>
            {isRoot && node.sublabel && (
              <span className="graph-label__sub">{node.sublabel}</span>
            )}
          </div>
        </Html>
      )}
    </group>
  );
}
