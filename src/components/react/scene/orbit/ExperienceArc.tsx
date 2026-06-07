/**
 * ExperienceArc.tsx — The "career path": a glowing CatmullRom line threading the
 * experience waypoints (placed by start-year on a larger ring) plus a focusable
 * waypoint marker per role. Amber/gold to distinguish from neon project nodes.
 */
import { useEffect, useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
import { CatmullRomCurve3, Vector3 } from 'three';
import { ORBIT, PALETTE } from '../cyber-config';
import type { ExperiencePlacement } from './orbit-layout';

interface Props {
  placements: ExperiencePlacement[];
  focusedId: string | null;
  onSelect: (company: string) => void;
}

export function ExperienceArc({ placements, focusedId, onSelect }: Props) {
  const linePoints = useMemo<Vector3[]>(() => {
    const pts = placements.map((p) => new Vector3(...p.position));
    if (pts.length < 2) return pts;
    return new CatmullRomCurve3(pts).getPoints(60);
  }, [placements]);

  // Reset cursor if a hovered waypoint unmounts.
  useEffect(() => () => {
    document.body.style.cursor = '';
  }, []);

  return (
    <group>
      {linePoints.length >= 2 && (
        <Line points={linePoints} color={PALETTE.amber} lineWidth={1.4} transparent opacity={0.5} />
      )}

      {placements.map(({ experience, position }) => {
        const focused = focusedId === experience.company;
        return (
          <group key={experience.company} position={position}>
            <mesh
              scale={ORBIT.nodeSize * (focused ? 2.4 : 1.8)}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = '';
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(experience.company);
              }}
            >
              <octahedronGeometry args={[1, 0]} />
              <meshStandardMaterial
                color={PALETTE.gold}
                emissive={PALETTE.amber}
                emissiveIntensity={focused ? 2.4 : 1.3}
                toneMapped={false}
              />
            </mesh>

            <Html center distanceFactor={10} zIndexRange={[30, 0]} className="orbit-label-wrap">
              <button
                type="button"
                className={`orbit-label orbit-label--exp${focused ? ' is-active' : ''}`}
                style={{ ['--node' as string]: PALETTE.amber }}
                aria-label={`${experience.role} at ${experience.company}. Open details.`}
                onClick={() => onSelect(experience.company)}
              >
                <span className="orbit-label__year">{experience.company}</span>
                <span className="orbit-label__title">{experience.role}</span>
              </button>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
