/**
 * gpu-rack.tsx — EXPERIENCE structure. A datacenter GPU cabinet: dark bevelled
 * shell with a glass front, 5 server sleds (GPU fins + spinning fan rings +
 * blinking status LEDs), side cable glow, a holographic "TRAINING 98%" readout
 * and a floating "GPU CLUSTER" title. The detailed front faces the fly-to camera.
 * Ported from the prototype.
 */
import {
  AdditiveBlending,
  BoxGeometry,
  CylinderGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  PointLight,
  TorusGeometry,
} from 'three';
import { COL, getSection } from '../scene-config';
import { makeHalo } from './neon-halo';
import { makeLabel } from './canvas-label';
import { useBuilt, type BuiltStructure } from './built-structure';

const CAB_W = 3.0;
const CAB_H = 4.2;
const CAB_D = 2.0;
const SLEDS = 5;
const FRONT_YAW = Math.PI; // turn the rich front toward the fly-to viewpoint (-Z)
const LED_COLORS = [COL.lime, COL.cyan];

function buildRack(): BuiltStructure {
  const g = new Group();
  g.position.set(...getSection('experience').prop);
  g.rotation.y = FRONT_YAW;

  const cabinet = new Mesh(new BoxGeometry(CAB_W, CAB_H, CAB_D), new MeshStandardMaterial({ color: 0x0a081c, emissive: COL.violet, emissiveIntensity: 0.05, metalness: 0.8, roughness: 0.42 }));
  cabinet.position.y = CAB_H / 2;
  g.add(cabinet);
  const bevel = new LineSegments(new EdgesGeometry(new BoxGeometry(CAB_W, CAB_H, CAB_D)), new LineBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.5 }));
  bevel.position.y = CAB_H / 2;
  g.add(bevel);
  const glass = new Mesh(new PlaneGeometry(CAB_W - 0.18, CAB_H - 0.18), new MeshBasicMaterial({ color: 0x123048, transparent: true, opacity: 0.14, blending: AdditiveBlending, depthWrite: false }));
  glass.position.set(0, CAB_H / 2, CAB_D / 2 + 0.04);
  g.add(glass);

  const fans: { blades: Group; speed: number }[] = [];
  const leds: { mat: MeshStandardMaterial; phase: number; blink: boolean }[] = [];
  const sledGap = CAB_H / (SLEDS + 0.7);

  for (let s = 0; s < SLEDS; s++) {
    const y = 0.55 + s * sledGap;
    const depthF = 0.5 + 0.5 * (s / (SLEDS - 1));

    const sled = new Mesh(new BoxGeometry(CAB_W - 0.34, sledGap * 0.74, CAB_D - 0.16), new MeshStandardMaterial({ color: 0x100c28, emissive: COL.violet, emissiveIntensity: 0.06 + depthF * 0.1, metalness: 0.6, roughness: 0.4 }));
    sled.position.set(0, y, 0.08);
    g.add(sled);
    const innerGlow = new Mesh(new PlaneGeometry(CAB_W - 0.5, sledGap * 0.5), new MeshBasicMaterial({ color: COL.cyan, transparent: true, opacity: 0.05 + depthF * 0.05, blending: AdditiveBlending, depthWrite: false }));
    innerGlow.position.set(0, y, CAB_D / 2 - 0.02);
    g.add(innerGlow);

    const finMat = new MeshStandardMaterial({ color: 0x081626, emissive: COL.cyan, emissiveIntensity: 0.12 + depthF * 0.14, metalness: 0.85, roughness: 0.25 });
    for (let f = 0; f < 9; f++) {
      const fin = new Mesh(new BoxGeometry(0.04, sledGap * 0.52, CAB_D - 0.55), finMat);
      fin.position.set(-1.02 + f * 0.115, y + sledGap * 0.06, -0.05);
      g.add(fin);
    }

    const fanN = s % 2 === 0 ? 3 : 2;
    for (let fi = 0; fi < fanN; fi++) {
      const fanGroup = new Group();
      const ring = new Mesh(new TorusGeometry(0.19, 0.028, 10, 28), new MeshStandardMaterial({ color: 0x0a1a2a, emissive: COL.cyan, emissiveIntensity: 0.6 + depthF * 0.4, metalness: 0.6, roughness: 0.3 }));
      fanGroup.add(ring);
      const fglow = makeHalo(COL.cyan, 0.7);
      fglow.material.opacity = 0.22 * depthF;
      fanGroup.add(fglow);
      const blades = new Group();
      const bladeMat = new MeshStandardMaterial({ color: 0x0a1a2a, emissive: COL.cyan, emissiveIntensity: 0.5, metalness: 0.6, roughness: 0.4 });
      for (let b = 0; b < 5; b++) {
        const blade = new Mesh(new BoxGeometry(0.3, 0.04, 0.008), bladeMat);
        blade.rotation.z = (b * Math.PI * 2) / 5;
        blades.add(blade);
      }
      fanGroup.add(blades);
      fanGroup.position.set(0.5 + fi * 0.46, y + sledGap * 0.04, CAB_D / 2 - 0.06);
      g.add(fanGroup);
      fans.push({ blades, speed: 2.4 + Math.random() * 1.6 });
    }

    const ledBar = new Mesh(new BoxGeometry(1.5, 0.07, 0.02), new MeshStandardMaterial({ color: 0x05040f, metalness: 0.5, roughness: 0.6 }));
    ledBar.position.set(-0.45, y - sledGap * 0.24, CAB_D / 2 + 0.02);
    g.add(ledBar);
    for (let l = 0; l < 9; l++) {
      const c = LED_COLORS[l % 2];
      const ledMat = new MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1.2, metalness: 0.2, roughness: 0.3 });
      const led = new Mesh(new BoxGeometry(0.05, 0.05, 0.05), ledMat);
      led.position.set(-1.12 + l * 0.085, y - sledGap * 0.24, CAB_D / 2 + 0.035);
      g.add(led);
      leds.push({ mat: ledMat, phase: Math.random() * Math.PI * 2, blink: l % 3 === 0 });
    }
  }

  [-1, 1].forEach((sx) => {
    const cable = new Mesh(new CylinderGeometry(0.025, 0.025, CAB_H - 0.4, 6), new MeshBasicMaterial({ color: COL.violet, transparent: true, opacity: 0.4, blending: AdditiveBlending, depthWrite: false }));
    cable.position.set(sx * (CAB_W / 2 + 0.03), CAB_H / 2, CAB_D / 2 - 0.1);
    g.add(cable);
  });

  const heat = makeHalo(COL.pink, 5);
  heat.position.set(0, CAB_H + 1.0, 0);
  heat.material.opacity = 0.14;
  g.add(heat);
  const halo = makeHalo(COL.cyan, 7);
  halo.position.set(0, CAB_H / 2, CAB_D / 2);
  halo.material.opacity = 0.3;
  g.add(halo);

  const expKey = new PointLight(COL.cyan, 1.1, 16);
  expKey.position.set(0, CAB_H * 0.6, CAB_D / 2 + 2.5);
  g.add(expKey);
  const expRim = new PointLight(COL.violet, 0.7, 16);
  expRim.position.set(-2.2, CAB_H * 0.7, -1);
  g.add(expRim);

  const readout = makeLabel('TRAINING 98%', { color: '#bdf3c8', glow: '#8df0a0', font: 26, mono: true, weight: 'bold', opacity: 0.9 });
  readout.scale.set(2.3, 0.58, 1);
  readout.position.set(0, CAB_H * 0.5, CAB_D / 2 + 0.4);
  g.add(readout);
  const title = makeLabel('GPU CLUSTER', { color: '#cdf6ff', glow: '#38e1ff', font: 30, weight: 'bold', opacity: 0.92 });
  title.scale.set(3.2, 0.8, 1);
  title.position.set(0, CAB_H + 0.6, 0);
  g.add(title);

  return {
    group: g,
    update: (t) => {
      g.rotation.y = FRONT_YAW + Math.sin(t * 0.35) * 0.1;
      g.position.y = Math.sin(t * 0.9) * 0.05;
      fans.forEach((f) => {
        f.blades.rotation.z += f.speed * 0.05;
      });
      leds.forEach((L) => {
        if (L.blink) {
          const a = 0.4 + 0.6 * Math.pow(Math.sin(t * 4 + L.phase) * 0.5 + 0.5, 2);
          L.mat.emissiveIntensity = 0.4 + a * 1.7;
        }
      });
      heat.material.opacity = 0.1 + Math.abs(Math.sin(t * 1.6)) * 0.07;
      readout.material.opacity = 0.78 + Math.abs(Math.sin(t * 1.4)) * 0.18;
    },
  };
}

export function GpuRack() {
  return <primitive object={useBuilt(buildRack)} />;
}
