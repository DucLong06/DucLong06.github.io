/**
 * pie-slice.tsx — One thick slice of the solid-pie hub.
 *
 * Shares a single sector BufferGeometry (rotated into its angle slot). useFrame
 * lerps the anticipation state: explode OUT along the slice's centroid direction +
 * a small lift, brighten when active, dim to ~30% when another slice is active.
 * Material is frosted-matte by default; the focused slice on the FULL tier (motion
 * on) upgrades to acrylic MeshTransmissionMaterial — the hero "dive" moment, one
 * mesh only so the transmission render pass stays affordable. Reduced-motion snaps.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import type { Mesh, MeshPhysicalMaterial } from 'three';
import {
  THETA_LENGTH,
  wedgeAngle,
  PIE_MID,
  type WedgeId,
} from '../wedges-config';

interface Props {
  id: WedgeId;
  angleIndex: number;
  color: string;
  geometry: import('three').BufferGeometry;
  hovered: boolean;
  focused: boolean;
  dimmed: boolean;
  acrylic: boolean; // focused && full tier && motion → transmission
  reducedMotion: boolean;
  onHover: (id: WedgeId | null) => void;
  onSelect: (id: WedgeId) => void;
}

const EXPLODE_DIST = PIE_MID * 0.1; // ~10% of mid-radius outward
const LIFT = 0.22;

export default function PieSlice({
  id,
  angleIndex,
  color,
  geometry,
  hovered,
  focused,
  dimmed,
  acrylic,
  reducedMotion,
  onHover,
  onSelect,
}: Props) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshPhysicalMaterial>(null);

  const active = hovered || focused;
  const dir = wedgeAngle(angleIndex); // centroid direction in group plane

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const outward = active ? EXPLODE_DIST : 0;
    const tx = Math.cos(dir) * outward;
    const ty = Math.sin(dir) * outward;
    const tz = active ? LIFT : 0;

    const targetEmissive = focused ? 1.5 : hovered ? 1.05 : dimmed ? 0.12 : 0.4;
    const targetOpacity = dimmed ? 0.35 : 1;

    if (reducedMotion) {
      mesh.position.set(tx, ty, tz);
      if (matRef.current) {
        matRef.current.emissiveIntensity = targetEmissive;
        matRef.current.opacity = targetOpacity;
      }
      return;
    }

    // Frame-rate independent lerp.
    const k = 1 - Math.pow(0.0015, delta);
    mesh.position.x += (tx - mesh.position.x) * k;
    mesh.position.y += (ty - mesh.position.y) * k;
    mesh.position.z += (tz - mesh.position.z) * k;

    let settling = Math.abs(tx - mesh.position.x) > 0.001 || Math.abs(tz - mesh.position.z) > 0.001;
    const mat = matRef.current;
    if (mat) {
      mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * k;
      mat.opacity += (targetOpacity - mat.opacity) * k;
      if (Math.abs(targetEmissive - mat.emissiveIntensity) > 0.01) settling = true;
    }
    // Keep frameloop="demand" alive until the lerp settles.
    if (settling) state.invalidate();
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      rotation={[0, 0, angleIndex * THETA_LENGTH]}
      castShadow
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
      {acrylic ? (
        <MeshTransmissionMaterial
          samples={4}
          resolution={256}
          transmission={1}
          thickness={0.6}
          roughness={0.25}
          ior={1.4}
          chromaticAberration={0.04}
          color={color}
        />
      ) : (
        <meshPhysicalMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.2}
          roughness={0.55}
          clearcoat={0.6}
          clearcoatRoughness={0.4}
          transparent
          opacity={1}
        />
      )}
    </mesh>
  );
}
