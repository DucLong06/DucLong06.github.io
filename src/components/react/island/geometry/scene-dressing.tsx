/**
 * scene-dressing.tsx — Static environment for the Quantum world: a soft space
 * gradient backdrop dome, a reflective ground plane with a neon grid + glow ring
 * under the core, and an ambient additive starfield. No per-frame animation.
 * Ported from the prototype.
 */
import { useMemo } from 'react';
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  DoubleSide,
  GridHelper,
  Group,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Points,
  PointsMaterial,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
} from 'three';
import { COL } from '../scene-config';

function buildDressing(): Group {
  const g = new Group();

  // Space-gradient backdrop dome (vertical gradient via a tiny shader).
  const dome = new Mesh(
    new SphereGeometry(180, 32, 24),
    new ShaderMaterial({
      side: BackSide,
      depthWrite: false,
      uniforms: {
        top: { value: new Color(0x140a33) },
        mid: { value: new Color(0x0a0622) },
        bot: { value: new Color(0x05030f) },
      },
      vertexShader: 'varying vec3 vP; void main(){vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader:
        'varying vec3 vP; uniform vec3 top; uniform vec3 mid; uniform vec3 bot;' +
        'void main(){float h=normalize(vP).y*0.5+0.5;' +
        'vec3 c=mix(bot,mid,smoothstep(0.0,0.5,h)); c=mix(c,top,smoothstep(0.5,1.0,h));' +
        'gl_FragColor=vec4(c,1.0);}',
    }),
  );
  g.add(dome);

  // Reflective ground plane + neon grid + glow ring under the core.
  const plane = new Mesh(new CircleGeometry(60, 64), new MeshStandardMaterial({ color: 0x070414, metalness: 0.85, roughness: 0.35, envMapIntensity: 0.4 }));
  plane.rotation.x = -Math.PI / 2;
  plane.position.y = -0.02;
  g.add(plane);

  const grid = new GridHelper(120, 60, COL.cyan, COL.violet);
  (grid.material as LineBasicMaterial).transparent = true;
  (grid.material as LineBasicMaterial).opacity = 0.28;
  g.add(grid);

  const ring = new Mesh(new RingGeometry(7, 7.5, 80), new MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.4, side: DoubleSide }));
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.01;
  g.add(ring);

  // Ambient starfield (additive Points).
  const N = 600;
  const pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 70 + Math.random() * 90;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(Math.random() * 2 - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
    pos[i * 3 + 1] = Math.abs(r * Math.cos(ph)) * 0.7 + 5;
    pos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th);
  }
  const sgeo = new BufferGeometry();
  sgeo.setAttribute('position', new BufferAttribute(pos, 3));
  g.add(new Points(sgeo, new PointsMaterial({ color: 0x9fd8ff, size: 0.5, transparent: true, opacity: 0.7, blending: AdditiveBlending, depthWrite: false })));

  return g;
}

export function SceneDressing() {
  const group = useMemo(buildDressing, []);
  return <primitive object={group} />;
}
