/**
 * FloatingIsland.tsx — The compact low-poly clay landmass.
 * Hex grass top (top surface at y≈0), tapering soil underside, a few floating
 * rocks, and a small waterfall off one edge. Pure procedural geometry.
 */
import { Clay } from './clay-material';
import { PALETTE } from '../scene-config';

const HEX = 6; // radial segments → chunky hexagonal silhouette

export function FloatingIsland() {
  return (
    <group>
      {/* Grass top */}
      <mesh receiveShadow position={[0, -0.5, 0]} rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[6.4, 6.0, 1, HEX]} />
        <Clay color={PALETTE.grassTop} roughness={0.95} />
      </mesh>

      {/* Grass mid lip for depth */}
      <mesh position={[0, -1.0, 0]} rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[6.0, 5.4, 0.5, HEX]} />
        <Clay color={PALETTE.grassMid} roughness={0.95} />
      </mesh>

      {/* Soil — tapering cone underside */}
      <mesh castShadow position={[0, -3.4, 0]} rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[5.4, 1.0, 4.4, HEX]} />
        <Clay color={PALETTE.soil} />
      </mesh>
      <mesh position={[0, -2.4, 0]} rotation={[0, Math.PI / 6, 0]}>
        <cylinderGeometry args={[5.6, 5.0, 0.6, HEX]} />
        <Clay color={PALETTE.soilDark} />
      </mesh>

      {/* Floating rocks under the island */}
      {[
        [3.2, -5.6, -1.5, 0.7],
        [-2.6, -6.8, 1.2, 0.5],
        [0.4, -7.6, -0.6, 0.4],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[x, y, z]}>
          <dodecahedronGeometry args={[s, 0]} />
          <Clay color={PALETTE.soilDark} />
        </mesh>
      ))}

      {/* Waterfall — thin translucent stream off the front-right edge */}
      <mesh position={[2.6, -2.8, 3.4]} rotation={[0.1, -0.5, 0]}>
        <boxGeometry args={[0.9, 4.2, 0.18]} />
        <meshStandardMaterial color={PALETTE.water} transparent opacity={0.78} roughness={0.3} />
      </mesh>
      {/* Pond at the top where the waterfall starts */}
      <mesh position={[3.0, -0.45, 3.2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.0, 12]} />
        <meshStandardMaterial color={PALETTE.water} transparent opacity={0.85} roughness={0.2} />
      </mesh>
    </group>
  );
}
