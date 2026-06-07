/**
 * StationMarkers.tsx — One glowing node per station, positioned at its curve
 * point plus a lateral offset so it swings through frame as the camera passes.
 * The active station's marker brightens + scales up (lerped in useFrame). These
 * are ambient accents — the real station content lives in the DOM overlays.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, type CatmullRomCurve3, type Mesh, type MeshStandardMaterial } from 'three';
import { STATIONS, STATION_COUNT, STATION_MARKER_OFFSET } from './journey-config';

interface MarkerProps {
  position: [number, number, number];
  color: string;
  active: boolean;
}

function StationMarker({ position, color, active }: MarkerProps) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  useFrame((state) => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;
    const targetScale = active ? 1.5 : 0.9;
    const s = mesh.scale.x + (targetScale - mesh.scale.x) * 0.12;
    mesh.scale.setScalar(s);
    mesh.rotation.y += active ? 0.012 : 0.004;
    const pulse = active ? 1.8 + Math.sin(state.clock.elapsedTime * 2) * 0.5 : 0.7;
    mat.emissiveIntensity += (pulse - mat.emissiveIntensity) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        ref={matRef}
        color={color}
        emissive={color}
        emissiveIntensity={0.7}
        roughness={0.25}
        metalness={0.3}
        flatShading
      />
    </mesh>
  );
}

interface Props {
  curve: CatmullRomCurve3;
  station: number;
}

export default function StationMarkers({ curve, station }: Props) {
  const positions = useMemo(() => {
    const v = new Vector3();
    return STATIONS.map((_, i) => {
      curve.getPointAt(i / (STATION_COUNT - 1), v);
      const [ox, oy, oz] = STATION_MARKER_OFFSET[i];
      return [v.x + ox, v.y + oy, v.z + oz] as [number, number, number];
    });
  }, [curve]);

  return (
    <group>
      {STATIONS.map((s, i) => (
        <StationMarker key={s.id} position={positions[i]} color={s.accent} active={station === i} />
      ))}
    </group>
  );
}
