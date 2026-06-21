/**
 * scene-setup.ts — Engine foundation (port of prototype world.module.js
 * ~455–534 + dressing ~506–531). Builds renderer / scene / camera / controls /
 * lights and the static world dressing (ground grid, orbit ring + pulse dots,
 * starfield). Exact constants are preserved verbatim — they define the look.
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PAL, C } from './palette';
import { getGlow, lineMat, circlePts } from './scene-helpers';

/** Station ring radius (quantum core sits at origin). */
export const RING_R = 26;

export interface SceneCore {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
}

function sizeOf(): { w: number; h: number } {
  return { w: window.innerWidth, h: window.innerHeight };
}

/** Renderer + scene + camera + controls + lights (no content yet). */
export function createSceneCore(canvas: HTMLCanvasElement): SceneCore {
  const { w, h } = sizeOf();

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.92;

  const scene = new THREE.Scene();
  scene.background = C(PAL.bg);
  scene.fog = new THREE.FogExp2(PAL.bg, 0.0085);

  const camera = new THREE.PerspectiveCamera(52, w / h, 0.1, 600);
  camera.position.set(0, 42, 70);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 6;
  controls.maxDistance = 90;
  controls.maxPolarAngle = Math.PI * 0.495;
  controls.enablePan = false;
  controls.enabled = false;
  controls.target.set(0, 2, 0);

  scene.add(new THREE.AmbientLight(0x4a6a9a, 0.6));
  const key = new THREE.PointLight(0x6fa8ff, 0.8, 200);
  key.position.set(20, 40, 20);
  scene.add(key);

  return { renderer, scene, camera, controls };
}

/** Static dressing: ground grid, orbit ring + travelling dots, starfield. */
export function buildDressing(scene: THREE.Scene): { updaters: ((t: number) => void)[] } {
  const updaters: ((t: number) => void)[] = [];

  // ground grid
  const groundGrid = new THREE.GridHelper(220, 90, C(PAL.a2).multiplyScalar(0.6), C(0x16314a));
  (groundGrid.material as THREE.Material).transparent = true;
  (groundGrid.material as THREE.Material).opacity = 0.22;
  groundGrid.position.y = -0.02;
  scene.add(groundGrid);

  // orbit ring (path between stations)
  const orbitRing = new THREE.Line(new THREE.BufferGeometry().setFromPoints(circlePts(RING_R, 0.06)), lineMat(PAL.a1, 0.5));
  scene.add(orbitRing);

  // travelling pulse dots on the ring
  const dotN = 60, dotPos = new Float32Array(dotN * 3);
  for (let i = 0; i < dotN; i++) {
    const a = (i / dotN) * Math.PI * 2;
    dotPos[i * 3] = Math.cos(a) * RING_R; dotPos[i * 3 + 1] = 0.06; dotPos[i * 3 + 2] = Math.sin(a) * RING_R;
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
  const dots = new THREE.Points(dotGeo, new THREE.PointsMaterial({ color: C(PAL.a1), size: 0.4, map: getGlow(), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(dots);
  updaters.push((t) => { dots.rotation.y = t * 0.06; });

  // starfield
  const sN = 1400, sp = new Float32Array(sN * 3);
  for (let i = 0; i < sN; i++) {
    const r = 60 + Math.random() * 120, a = Math.random() * Math.PI * 2, hh = (Math.random() - 0.3) * 90;
    sp[i * 3] = Math.cos(a) * r; sp[i * 3 + 1] = hh; sp[i * 3 + 2] = Math.sin(a) * r;
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
  const starfield = new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0x9fc4ff, size: 0.6, map: getGlow(), transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(starfield);
  updaters.push((t) => { starfield.rotation.y = t * 0.01; });

  return { updaters };
}
