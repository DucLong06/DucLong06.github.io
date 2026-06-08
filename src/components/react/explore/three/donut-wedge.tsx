/**
 * donut-wedge.tsx — One segment of the 6-wedge donut hub.
 *
 * A TorusGeometry arc (thetaLength = 2π/6) rotated to its angle slot. Emissive
 * neon material; hover/focus lerps emissiveIntensity + outward scale via useFrame.
 * Pointer handlers raise hover/select up to <DonutHub>. Reduced-motion → no lerp
 * (instant state), no per-frame work beyond a cheap snap.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh, MeshStandardMaterial } from 'three';
import { THETA_LENGTH, type WedgeId } from '../wedges-config';

interface Props {
  id: WedgeId;
  angleIndex: number;
  color: string;
  radius: number;
  tube: number;
  tubularSegments: number;
  hovered: boolean;
  focused: boolean;
  reducedMotion: boolean;
  onHover: (id: WedgeId | null) => void;
  onSelect: (id: WedgeId) => void;
}

export default function DonutWedge({
  id,
  angleIndex,
  color,
  radius,
  tube,
  tubularSegments,
  hovered,
  focused,
  reducedMotion,
  onHover,
  onSelect,
}: Props) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  const active = hovered || focused;

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    const targetEmissive = focused ? 1.6 : hovered ? 1.15 : 0.35;
    const targetScale = focused ? 1.12 : hovered ? 1.06 : 1;

    if (reducedMotion) {
      mat.emissiveIntensity = targetEmissive;
      mesh.scale.setScalar(targetScale);
      return;
    }
    // Frame-rate independent lerp.
    const k = 1 - Math.pow(0.001, delta);
    mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * k;
    const s = mesh.scale.x + (targetScale - mesh.scale.x) * k;
    mesh.scale.setScalar(s);

    // Keep frameloop="demand" alive until the lerp settles (e.g. focus glow when
    // the donut isn't idle-spinning).
    if (Math.abs(targetEmissive - mat.emissiveIntensity) > 0.01 || Math.abs(targetScale - s) > 0.001) {
      state.invalidate();
    }
  });

  return (
    <mesh
      ref={meshRef}
      rotation={[0, 0, angleIndex * THETA_LENGTH]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(id);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
        document.body.style.cursor = '';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* args: [radius, tube, radialSegments, tubularSegments, arc] */}
      <torusGeometry args={[radius, tube, 16, tubularSegments, THETA_LENGTH]} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.35}
        metalness={0.4}
        roughness={0.35}
        transparent
        opacity={active ? 1 : 0.92}
      />
    </mesh>
  );
}
