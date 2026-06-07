/**
 * clay-material.tsx — Reusable low-poly "clay" material + tiny mesh helpers.
 * flatShading + high roughness gives the faceted matte clay look across all props.
 */
import type { ThreeElements } from '@react-three/fiber';

interface ClayProps {
  color: string;
  roughness?: number;
  emissive?: string;
  emissiveIntensity?: number;
}

/** Drop-in material: <mesh><boxGeometry/><Clay color="#fff" /></mesh> */
export function Clay({ color, roughness = 0.9, emissive, emissiveIntensity = 0 }: ClayProps) {
  return (
    <meshStandardMaterial
      color={color}
      flatShading
      roughness={roughness}
      metalness={0}
      emissive={emissive ?? '#000000'}
      emissiveIntensity={emissive ? emissiveIntensity : 0}
    />
  );
}

/** Single-call clay box. */
export function ClayBox({
  args,
  color,
  ...props
}: { args: [number, number, number]; color: string } & ThreeElements['mesh']) {
  return (
    <mesh castShadow receiveShadow {...props}>
      <boxGeometry args={args} />
      <Clay color={color} />
    </mesh>
  );
}
