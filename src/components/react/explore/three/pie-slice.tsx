/**
 * pie-slice.tsx — One thick slice of the solid-pie hub.
 *
 * Shares a single sector BufferGeometry (rotated into its angle slot). useFrame
 * lerps the anticipation state: explode OUT along the slice's centroid direction +
 * a small lift + a slight scale-up, brighten when active, dim to ~30% when another
 * slice is active. One cheap meshStandardMaterial throughout — no per-frame render-
 * target pass — so the focused "dive" moment never contends with the camera arc.
 * The hero focus look is carried by the emissive bump + scale, not glass. Reduced-
 * motion snaps.
 */
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh, MeshStandardMaterial } from 'three';
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
  reducedMotion: boolean;
  onHover: (id: WedgeId | null) => void;
  onSelect: (id: WedgeId) => void;
}

const EXPLODE_DIST = PIE_MID * 0.1; // ~10% of mid-radius outward
const LIFT = 0.22;
const FOCUS_SCALE = 1.06; // focused slice swells slightly — the hero "dive" accent

export default function PieSlice({
  id,
  angleIndex,
  color,
  geometry,
  hovered,
  focused,
  dimmed,
  reducedMotion,
  onHover,
  onSelect,
}: Props) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  const active = hovered || focused;
  const dir = wedgeAngle(angleIndex); // centroid direction in group plane

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const outward = active ? EXPLODE_DIST : 0;
    const tx = Math.cos(dir) * outward;
    const ty = Math.sin(dir) * outward;
    const tz = active ? LIFT : 0;
    const ts = focused ? FOCUS_SCALE : 1; // only the dived slice swells

    // Softer dim floor (0.34, not 0.12) so backgrounded slices never read dead-black;
    // the scene Environment also fills every face so nothing goes pure black on spin.
    const targetEmissive = focused ? 1.4 : hovered ? 1.0 : dimmed ? 0.34 : 0.5;
    const targetOpacity = dimmed ? 0.6 : 1;

    if (reducedMotion) {
      mesh.position.set(tx, ty, tz);
      mesh.scale.setScalar(ts);
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
    mesh.scale.x += (ts - mesh.scale.x) * k;
    mesh.scale.setScalar(mesh.scale.x);

    // Gate every lerped channel — incl. y (carries the full travel for vertical
    // slices where tx≈0) and opacity — so demand-mode never stops mid-transition.
    let settling =
      Math.abs(tx - mesh.position.x) > 0.001 ||
      Math.abs(ty - mesh.position.y) > 0.001 ||
      Math.abs(tz - mesh.position.z) > 0.001 ||
      Math.abs(ts - mesh.scale.x) > 0.001;
    const mat = matRef.current;
    if (mat) {
      mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * k;
      mat.opacity += (targetOpacity - mat.opacity) * k;
      if (Math.abs(targetEmissive - mat.emissiveIntensity) > 0.01) settling = true;
      if (Math.abs(targetOpacity - mat.opacity) > 0.01) settling = true;
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
      {/* Standard (not physical+clearcoat, never transmission) → cheap to render every
          frame even during the camera dive; the scene Environment supplies reflections
          for the frosted/acrylic sheen. */}
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        metalness={0.45}
        roughness={0.32}
        envMapIntensity={1.1}
        transparent
        opacity={1}
      />
    </mesh>
  );
}
