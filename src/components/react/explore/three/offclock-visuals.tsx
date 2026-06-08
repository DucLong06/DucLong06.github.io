/**
 * offclock-visuals.tsx — Tasteful mini 3D accent for the Off-clock panel.
 * A football orbiting a ring + a shuttlecock-style particle trail. Self-contained
 * small <Canvas> (mounted only while the panel is open, tier 'full', motion on).
 * Counts capped + DPR capped; decorative → aria-hidden. Reduced-motion / lite tier
 * never mount this (the panel shows static emoji instead).
 */
import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { Group, Points } from 'three';

const TRAIL_COUNT = 40;

function BallOrbit() {
  const ref = useRef<Group>(null);
  useFrame((state) => {
    const g = ref.current;
    if (!g) return;
    const a = state.clock.elapsedTime * 0.9;
    g.position.set(Math.cos(a) * 1.4, Math.sin(a * 1.3) * 0.35, Math.sin(a) * 1.4);
    state.invalidate();
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color="#e6e9f5" emissive="#34e2ff" emissiveIntensity={0.25} roughness={0.5} />
      </mesh>
    </group>
  );
}

function ShuttlecockTrail() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(TRAIL_COUNT * 3);
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const t = i / TRAIL_COUNT;
      arr[i * 3] = Math.cos(t * Math.PI * 2) * 1.7;
      arr[i * 3 + 1] = (t - 0.5) * 2.2;
      arr[i * 3 + 2] = Math.sin(t * Math.PI * 2) * 1.7;
    }
    return arr;
  }, []);

  useFrame((state) => {
    const p = ref.current;
    if (!p) return;
    p.rotation.y = state.clock.elapsedTime * 0.5;
    state.invalidate();
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ff4d9d" size={0.09} sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

export default function OffclockVisuals() {
  return (
    <div className="offclock-visual" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: false, alpha: true }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[3, 3, 4]} intensity={1.1} color="#34e2ff" />
        <BallOrbit />
        <ShuttlecockTrail />
      </Canvas>
    </div>
  );
}
