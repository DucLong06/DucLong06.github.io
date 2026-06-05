/**
 * Mailbox.tsx — Contact section prop. Classic clay mailbox: rounded box on a
 * post with a little raised flag.
 */
import type { Vec3 } from '../scene-config';
import { PALETTE } from '../scene-config';
import { Clay, ClayBox } from './clay-material';

export function Mailbox({ position }: { position: Vec3 }) {
  return (
    <group position={position}>
      {/* post */}
      <ClayBox args={[0.18, 1.2, 0.18]} position={[0, 0.6, 0]} color={PALETTE.woodDark} />
      {/* box body */}
      <mesh castShadow position={[0, 1.35, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.9, 12, 1, false, 0, Math.PI]} />
        <Clay color={PALETTE.violet} />
      </mesh>
      <ClayBox args={[0.8, 0.42, 0.9]} position={[0, 1.14, 0]} color={PALETTE.violet} />
      {/* front opening */}
      <ClayBox args={[0.06, 0.34, 0.7]} position={[0.4, 1.3, 0]} color={PALETTE.violetDark} />
      {/* flag */}
      <ClayBox args={[0.05, 0.4, 0.05]} position={[-0.34, 1.55, 0.3]} color={PALETTE.white} />
      <ClayBox args={[0.04, 0.26, 0.26]} position={[-0.34, 1.62, 0.42]} color={PALETTE.pink} />
    </group>
  );
}
