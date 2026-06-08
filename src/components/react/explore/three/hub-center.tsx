/**
 * hub-center.tsx — Center node of the donut: a soft glowing core + DOM avatar/logo.
 * The avatar + sublabel live in a drei <Html> (real DOM → crawlable/SR-friendly).
 */
import { Html } from '@react-three/drei';
import type { TFn } from '../explore-i18n';

interface Props {
  t: TFn;
  hint: string;
}

export default function HubCenter({ t, hint }: Props) {
  return (
    <group>
      {/* Glowing core sphere — smaller so the DOM label sits beside/below it, not on it */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#0bb8d6"
          emissive="#34e2ff"
          emissiveIntensity={0.6}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* DOM avatar + sublabel */}
      <Html center distanceFactor={8} zIndexRange={[10, 0]} className="hub-center-wrap">
        <div className="hub-center">
          <img className="hub-center__avatar" src="/avatar.webp" alt="Hoàng Đức Long" width="84" height="84" />
          <span className="hub-center__sublabel">{t('graph_root_sublabel')}</span>
          <span className="hub-center__hint">{hint}</span>
        </div>
      </Html>
    </group>
  );
}
