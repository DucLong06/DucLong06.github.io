/**
 * stations/index.ts — Station definitions + placement loop (port of
 * world.module.js STATION_DEFS + buildWorld ~466–504). Places the quantum core
 * at the origin and the other six on the ring (R = RING_R), each with a floor
 * disc, label sprite, and a computed parked camera view.
 */
import * as THREE from 'three';
import { PAL, C } from '../palette';
import { lineMat, circlePts, labelSprite } from '../scene-helpers';
import { RING_R } from '../scene-setup';
import { buildIdentity } from './build-identity';
import { buildServers } from './build-servers';
import { buildSkillChain } from './build-skill-chain';
import { buildQuantumCore, type SceneCtx } from './build-quantum-core';
import { buildBlockchain } from './build-blockchain';
import { buildDockyard } from './build-dockyard';
import { buildBeacon } from './build-beacon';

export type { SceneCtx };

export interface StationView { pos: THREE.Vector3; tgt: THREE.Vector3 }
export interface StationObj {
  id: string;
  label: string;
  color: number;
  group: THREE.Group;
  pos: THREE.Vector3;
  view: StationView;
  lab: THREE.Sprite;
}

interface ViewSpec { out: number; up: number; side: number; ty: number }
interface StationDef {
  id: string; label: string; sub: string; color: number; view: ViewSpec; core?: boolean;
  build: (ctx: SceneCtx) => THREE.Group;
}

const STATION_DEFS: StationDef[] = [
  { id: 'identity', label: 'IDENTITY', sub: 'NODE 01', color: PAL.a1, view: { out: -15, up: 6.5, side: 10, ty: 4 }, build: () => buildIdentity(PAL.a1) },
  { id: 'telemetry', label: 'TELEMETRY', sub: 'NODE 02', color: PAL.a2, view: { out: -10, up: 4, side: 7, ty: 2.5 }, build: () => buildServers(PAL.a1, PAL.a2) },
  { id: 'expertise', label: 'ARSENAL', sub: 'NODE 03', color: PAL.a3, view: { out: -15, up: 6, side: 3, ty: 3.4 }, build: () => buildSkillChain(PAL.a1) },
  { id: 'quantum', label: 'QUANTUM', sub: 'NODE 04', color: PAL.a1, view: { out: -12, up: 5, side: 8, ty: 1.5 }, core: true, build: (ctx) => buildQuantumCore(ctx, PAL.a1, PAL.a2) },
  { id: 'ledger', label: 'LEDGER', sub: 'NODE 05', color: PAL.a3, view: { out: -10, up: 5, side: 6, ty: 4 }, build: () => buildBlockchain(PAL.a3) },
  { id: 'dockyard', label: 'DOCKYARD', sub: 'NODE 06', color: PAL.a1, view: { out: -9, up: 6, side: 4, ty: 1.5 }, build: () => buildDockyard(PAL.a1) },
  { id: 'signal', label: 'SIGNAL', sub: 'NODE 07', color: PAL.a2, view: { out: -10, up: 4.5, side: 7, ty: 4 }, build: () => buildBeacon(PAL.a1, PAL.a2) },
];

/** Build + place all stations; push per-frame updaters; return station handles. */
export function buildStations(
  scene: THREE.Scene,
  updaters: ((t: number) => void)[],
  ctx: SceneCtx,
): StationObj[] {
  const stationObjs: StationObj[] = [];
  const others = STATION_DEFS.filter((d) => !d.core);

  STATION_DEFS.forEach((def) => {
    let pos: THREE.Vector3;
    if (def.core) {
      pos = new THREE.Vector3(0, 0, 0);
    } else {
      const idx = others.indexOf(def);
      const a = (idx / others.length) * Math.PI * 2 - Math.PI / 2;
      pos = new THREE.Vector3(Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R);
    }
    const grp = def.build(ctx);
    grp.position.copy(pos);
    scene.add(grp);
    const upd = (grp.userData as { update?: (t: number) => void }).update;
    if (upd) updaters.push(upd);

    // station floor disc + line ring (except core, which has its own dressing)
    if (!def.core) {
      const disc = new THREE.Mesh(new THREE.CircleGeometry(5, 48), new THREE.MeshBasicMaterial({ color: C(def.color), transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending }));
      disc.rotation.x = -Math.PI / 2; disc.position.copy(pos); disc.position.y = 0.02; scene.add(disc);
      scene.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(circlePts(5, 0.03)), lineMat(def.color, 0.4)).translateX(pos.x).translateZ(pos.z));
    }

    const lab = labelSprite(def.label, def.color, def.sub);
    lab.scale.multiplyScalar(0.72);
    lab.userData.baseScale = lab.scale.clone();
    lab.position.copy(pos);
    lab.position.y = def.core ? 9 : 10.3;
    scene.add(lab);

    // compute parked camera view
    const dir = def.core ? new THREE.Vector3(0, 0, 1) : pos.clone().normalize();
    const tangent = new THREE.Vector3(-dir.z, 0, dir.x);
    const v = def.view;
    const camPos = pos.clone().add(dir.clone().multiplyScalar(v.out)).add(new THREE.Vector3(0, v.up, 0)).add(tangent.multiplyScalar(v.side));
    if (def.core) camPos.set(11, 7, 16);
    const camTgt = pos.clone().add(new THREE.Vector3(0, v.ty, 0));

    stationObjs.push({ id: def.id, label: def.label, color: def.color, group: grp, pos, view: { pos: camPos, tgt: camTgt }, lab });
  });

  return stationObjs;
}
