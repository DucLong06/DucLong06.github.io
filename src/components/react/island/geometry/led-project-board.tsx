/**
 * led-project-board.tsx — PROJECTS structure. A dot-matrix LED field (20×12 = 240
 * emissive cubes) on a glowing board that ripples/twinkles with a traveling wave.
 * Uses InstancedMesh for performance: colors set once at init, matrices updated
 * per frame. Ported from the prototype.
 */
import {
  BoxGeometry,
  Color,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
} from 'three';
import { COL, getSection } from '../scene-config';
import { makeHalo } from './neon-halo';
import { useBuilt, type BuiltStructure } from './built-structure';

const COLS = 20;
const ROWS = 12;
const GAP = 0.22;
const DOT = 0.13;
const BASE_Y = 1.4;
const DOT_COLORS = [COL.cyan, COL.lime, COL.violet, COL.pink];

function buildBoard(): BuiltStructure {
  const g = new Group();
  g.position.set(...getSection('projects').prop);

  const board = new Mesh(new BoxGeometry(5.2, 0.18, 3.4), new MeshStandardMaterial({ color: 0x080614, emissive: COL.violet, emissiveIntensity: 0.12, metalness: 0.6, roughness: 0.4 }));
  board.position.y = 0.09;
  g.add(board);
  const boardEdge = new Mesh(new BoxGeometry(5.3, 0.04, 3.5), new MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.3 }));
  boardEdge.position.y = 0.19;
  g.add(boardEdge);

  const count = COLS * ROWS;
  const dots = new InstancedMesh(new BoxGeometry(DOT, DOT, DOT), new MeshStandardMaterial({ color: 0xffffff, emissive: COL.cyan, emissiveIntensity: 1.0, metalness: 0.3, roughness: 0.4 }), count);
  const dummy = new Object3D();
  const tmpCol = new Color();
  const dotData: { x: number; y: number; seed: number }[] = [];
  let idx = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = (c - (COLS - 1) / 2) * GAP;
      const y = BASE_Y + (r - (ROWS - 1) / 2) * GAP;
      dots.setColorAt(idx, tmpCol.set(DOT_COLORS[(r + c) % DOT_COLORS.length]));
      dotData.push({ x, y, seed: Math.random() * Math.PI * 2 });
      idx++;
    }
  }
  if (dots.instanceColor) dots.instanceColor.needsUpdate = true;
  g.add(dots);

  const glow = makeHalo(COL.violet, 6);
  glow.position.set(0, BASE_Y, -0.4);
  glow.material.opacity = 0.28;
  g.add(glow);
  const glow2 = makeHalo(COL.cyan, 4);
  glow2.position.set(0, BASE_Y, 0.3);
  glow2.material.opacity = 0.2;
  g.add(glow2);

  return {
    group: g,
    update: (t) => {
      g.position.y = Math.sin(t * 0.7 + 2) * 0.05;
      for (let i = 0; i < count; i++) {
        const d = dotData[i];
        const tw = 0.5 + 0.5 * Math.sin(t * 2.2 - d.x * 1.6 - d.y * 1.2 + d.seed);
        dummy.position.set(d.x, d.y, tw * 0.12);
        dummy.scale.setScalar(0.7 + tw * 0.6);
        dummy.updateMatrix();
        dots.setMatrixAt(i, dummy.matrix);
      }
      dots.instanceMatrix.needsUpdate = true;
    },
  };
}

export function LedProjectBoard() {
  return <primitive object={useBuilt(buildBoard)} />;
}
