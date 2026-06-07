/**
 * ProjectNode.tsx — One glowing project on the orbit timeline.
 *
 * An emissive octahedron (color by category) with an always-present, focusable
 * DOM label (year always shown; title expands on hover/focus). The label is a
 * real <button> so the node is keyboard-accessible (Tab to focus, Enter opens
 * the deep-dive card). Hover/focus scales + brightens the node (damped).
 */
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import type { Mesh, Vector3Tuple } from 'three';
import { ORBIT, CATEGORY_COLOR, PALETTE } from '../cyber-config';
import { damp } from '../damp-utils';
import type { SceneProject } from '../../../../lib/scene/scene-data-types';

interface Props {
  project: SceneProject;
  position: Vector3Tuple;
  focused: boolean;
  onSelect: (slug: string) => void;
}

export function ProjectNode({ project, position, focused, onSelect }: Props) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const active = hovered || focused;
  const color = CATEGORY_COLOR[project.category] ?? PALETTE.neon;
  const baseScale = project.primary ? ORBIT.featuredScale : 1;

  useFrame((_, dt) => {
    const m = meshRef.current;
    if (!m) return;
    const target = ORBIT.nodeSize * baseScale * (active ? 1.6 : 1);
    m.scale.setScalar(damp(m.scale.x, target, 0.12, dt));
  });

  const setCursor = (on: boolean) => {
    document.body.style.cursor = on ? 'pointer' : '';
  };

  // Never leave the cursor stuck as a pointer if the node unmounts while hovered
  // (deep-dive opens over it, exit-to-classic, reduced-motion toggles the tree).
  useEffect(() => () => setCursor(false), []);

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        scale={ORBIT.nodeSize * baseScale}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          setCursor(true);
        }}
        onPointerOut={() => {
          setHovered(false);
          setCursor(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(project.slug);
        }}
      >
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 2.4 : 1.2}
          toneMapped={false}
        />
      </mesh>

      <Html center distanceFactor={9} zIndexRange={[30, 0]} className="orbit-label-wrap">
        <button
          type="button"
          className={`orbit-label${active ? ' is-active' : ''}${project.primary ? ' is-primary' : ''}`}
          style={{ ['--node' as string]: color }}
          aria-label={`${project.title}, ${project.year}. Open project details.`}
          onClick={() => onSelect(project.slug)}
          onFocus={() => setHovered(true)}
          onBlur={() => setHovered(false)}
        >
          <span className="orbit-label__year">{project.year}</span>
          <span className="orbit-label__title">{project.title}</span>
        </button>
      </Html>
    </group>
  );
}
