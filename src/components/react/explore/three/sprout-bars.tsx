/**
 * sprout-bars.tsx — Stage-4 payload: 3D bars that sprout from the slice face.
 *
 * Bars stand on the focused slice's top face (+Z) and grow toward the face-on stage
 * camera with a staggered ease-out-back "spring" (tallest first → rhythm). A thin
 * drei <Html> card floats over each bar with its label + measure (real DOM text —
 * crisp, localizable, the floating "glass card" without baking text into 3D).
 *
 * FULL tier + motion only (gated by the scene). Reduced-motion → full height, no
 * spring. Positions use the slice's true world angle (wedgeAngle + frozen spin), so
 * bars land on the slice regardless of where the idle spin stopped.
 */
import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { BoxGeometry, type BufferGeometry, type Mesh } from 'three';
import { getWedge, wedgeAngle, PIE_MID, PIE_FACE_Z, type WedgeId } from '../wedges-config';
import type { PieBar } from '../stage-payload-registry';

interface Props {
  wedgeId: WedgeId;
  spin: number;
  bars: PieBar[];
  reducedMotion: boolean;
}

const MAX_H = 1.5;
const BAR_W = 0.16;
const SPREAD = 1.5; // tangential span across the slice
const GROW_DUR = 0.5;

function easeOutBack(x: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

interface BarProps {
  x: number;
  y: number;
  height: number;
  color: string;
  delay: number;
  geometry: BufferGeometry;
  reducedMotion: boolean;
}

function Bar({ x, y, height, color, delay, geometry, reducedMotion }: BarProps) {
  const ref = useRef<Mesh>(null);
  const tRef = useRef(0);

  useFrame((state, delta) => {
    const m = ref.current;
    if (!m) return;
    if (reducedMotion) {
      m.scale.z = Math.max(0.001, height);
      return;
    }
    tRef.current += delta;
    const local = Math.max(0, tRef.current - delay);
    const p = Math.min(1, local / GROW_DUR);
    const eased = p >= 1 ? 1 : easeOutBack(p);
    m.scale.z = Math.max(0.001, height * eased);
    if (p < 1) state.invalidate();
  });

  // Geometry is a unit box pre-anchored at its base (z: 0→1) → scale.z grows up.
  return (
    <mesh ref={ref} geometry={geometry} position={[x, y, PIE_FACE_Z]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} metalness={0.3} roughness={0.4} />
    </mesh>
  );
}

export default function SproutBars({ wedgeId, spin, bars, reducedMotion }: Props) {
  const a = wedgeAngle(getWedge(wedgeId).angleIndex) + spin;
  const cx = Math.cos(a) * PIE_MID;
  const cy = Math.sin(a) * PIE_MID;
  // Unit tangent (perpendicular to the radial) — bars laid out across the slice.
  const tx = -Math.sin(a);
  const ty = Math.cos(a);

  // Stagger: tallest bar sprouts first.
  const order = bars.map((_, i) => i).sort((i, j) => bars[j].value - bars[i].value);
  const rank = new Map<number, number>();
  order.forEach((idx, r) => rank.set(idx, r));

  // One shared unit-box geometry, anchored at its base so scale.z grows upward.
  const barGeo = useMemo(() => {
    const g = new BoxGeometry(BAR_W, BAR_W, 1);
    g.translate(0, 0, 0.5);
    return g;
  }, []);
  // Manually-created geometry — free it on unmount (R3F won't, it's not from JSX).
  useEffect(() => () => barGeo.dispose(), [barGeo]);

  const n = bars.length;
  return (
    <group>
      {bars.map((b, i) => {
        const off = n > 1 ? (i / (n - 1) - 0.5) * SPREAD : 0;
        const x = cx + tx * off;
        const y = cy + ty * off;
        const height = b.value * MAX_H;
        const delay = (rank.get(i) ?? 0) * 0.07;
        return (
          <group key={b.label}>
            <Bar x={x} y={y} height={height} color={b.color} delay={delay} geometry={barGeo} reducedMotion={reducedMotion} />
            <Html
              // Clear the easeOutBack overshoot (~1.1× height) so the bar tip never
              // punches through the floating card on the way up.
              position={[x, y, PIE_FACE_Z + height * 1.12 + 0.16]}
              center
              distanceFactor={7}
              zIndexRange={[15, 0]}
              className="stage-card-wrap"
            >
              <div className="stage-card" style={{ ['--bar-color' as string]: b.color }}>
                <span className="stage-card__label">{b.label}</span>
                <span className="stage-card__val">{b.display}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
