/**
 * blockchain-helix.tsx — SKILLS structure. Six faceted glass blocks (skill groups)
 * riding an ascending helix, each with a bright octahedron "hash core", gold edge
 * rim, group label + hash glyph. Luminous gold links carry 54 flowing glint
 * particles, and a glow-pulse wave propagates down the chain. Ported from prototype.
 */
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OctahedronGeometry,
  Points,
  PointsMaterial,
  PointLight,
  QuadraticBezierCurve3,
  TubeGeometry,
  Vector3,
} from 'three';
import { COL, getSection } from '../scene-config';
import { makeHalo, haloTex } from './neon-halo';
import { makeLabel } from './canvas-label';
import { useBuilt, type BuiltStructure } from './built-structure';

const GOLD = 0xffd166;
const GROUPS = ['LANG', 'AI/ML', 'BACK', 'FRONT', 'DEVOPS', 'SEC'];
const HASHES = ['0x9f3a', 'blk#1a2', '7e4c..d9', '0xab12', 'sha:8f1', '0xc0de'];
const BLOCK_COLS = [COL.cyan, COL.violet, COL.amber, COL.pink, COL.cyan, COL.violet];

function buildHelix(): BuiltStructure {
  const g = new Group();
  g.position.set(...getSection('skills').prop);

  const N = GROUPS.length;
  const span = 6.6;
  const turns = 0.62;
  const rise = 2.3;
  const lift = 1.5;

  const skKey = new PointLight(GOLD, 0.9, 14);
  g.add(skKey);
  const skFill = new PointLight(COL.cyan, 0.7, 16);
  g.add(skFill);

  const blocks: { grp: Group; mat: MeshStandardMaterial; core: Mesh; coreHalo: { material: { opacity: number } }; base: Vector3; i: number }[] = [];
  const blockPts: Vector3[] = [];

  for (let i = 0; i < N; i++) {
    const f = i / (N - 1);
    const ang = (f - 0.5) * Math.PI * 2 * turns;
    const x = (f - 0.5) * span;
    const y = lift + f * rise + Math.sin(f * Math.PI) * 0.25;
    const z = Math.sin(ang) * 0.7;
    const p = new Vector3(x, y, z);
    blockPts.push(p);

    const col = BLOCK_COLS[i];
    const bgrp = new Group();
    bgrp.position.copy(p);
    bgrp.rotation.set(0.18, ang * 0.6 + 0.4, 0.06);

    const sz = 0.86;
    const mat = new MeshStandardMaterial({ color: 0x0a0820, emissive: col, emissiveIntensity: 0.32, metalness: 0.85, roughness: 0.18 });
    bgrp.add(new Mesh(new BoxGeometry(sz, sz, sz), mat));

    const core = new Mesh(new OctahedronGeometry(0.3, 1), new MeshStandardMaterial({ color: 0xffffff, emissive: col, emissiveIntensity: 1.9, metalness: 0.2, roughness: 0.25 }));
    bgrp.add(core);
    const ch = makeHalo(col, 1.5);
    ch.material.opacity = 0.55;
    bgrp.add(ch);

    const edge = new LineSegments(new EdgesGeometry(new BoxGeometry(sz * 1.02, sz * 1.02, sz * 1.02)), new LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.9 }));
    bgrp.add(edge);
    const h = makeHalo(col, 2.0);
    h.material.opacity = 0.26;
    bgrp.add(h);

    const glowHex = '#' + col.toString(16).padStart(6, '0');
    const lbl = makeLabel(GROUPS[i], { color: '#eaf6ff', glow: '#38e1ff', font: 30, mono: true, weight: 'bold', opacity: 0.96 });
    lbl.scale.set(1.7, 0.42, 1);
    lbl.position.set(0, 0.95, 0);
    bgrp.add(lbl);
    const hsh = makeLabel(HASHES[i], { color: '#ffe9b0', glow: glowHex, font: 22, mono: true, weight: 'bold', opacity: 0.8 });
    hsh.scale.set(1.55, 0.39, 1);
    hsh.position.set(0, -0.85, 0.2);
    bgrp.add(hsh);

    g.add(bgrp);
    blocks.push({ grp: bgrp, mat, core, coreHalo: ch, base: p.clone(), i });
  }

  // luminous gold links + flowing glints
  const links: { mat: MeshBasicMaterial; curve: QuadraticBezierCurve3 }[] = [];
  for (let i = 0; i < N - 1; i++) {
    const a = blockPts[i];
    const b = blockPts[i + 1];
    const mid = a.clone().lerp(b, 0.5);
    mid.y += 0.18;
    const curve = new QuadraticBezierCurve3(a, mid, b);
    const lm = new MeshBasicMaterial({ color: GOLD, transparent: true, opacity: 0.4, blending: AdditiveBlending, depthWrite: false });
    g.add(new Mesh(new TubeGeometry(curve, 16, 0.035, 8, false), lm));
    links.push({ mat: lm, curve });
  }

  const FN = 54;
  const fpos = new Float32Array(FN * 3);
  const fgeo = new BufferGeometry();
  fgeo.setAttribute('position', new BufferAttribute(fpos, 3));
  const flow = new Points(fgeo, new PointsMaterial({ map: haloTex, color: 0xfff0c0, size: 0.26, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false, sizeAttenuation: true }));
  g.add(flow);

  const _v = new Vector3();
  const setFlow = (t: number) => {
    const attr = fgeo.attributes.position;
    for (let i = 0; i < FN; i++) {
      const s = ((i / FN) + t * 0.12) % 1;
      const seg = Math.min(N - 2, Math.floor(s * (N - 1)));
      const local = s * (N - 1) - seg;
      links[seg].curve.getPoint(local, _v);
      attr.setXYZ(i, _v.x, _v.y, _v.z);
    }
    attr.needsUpdate = true;
  };

  return {
    group: g,
    update: (t) => {
      setFlow(t);
      g.position.y = Math.sin(t * 0.8 + 1) * 0.06;
      skKey.position.set(Math.cos(t * 0.5) * 4, 3.2, Math.sin(t * 0.5) * 2 + 1.5);
      skFill.position.set(Math.cos(t * 0.4 + 2) * -4, 2.4, Math.sin(t * 0.4 + 2) * 2 - 1);
      blocks.forEach((bl) => {
        bl.grp.position.y = bl.base.y + Math.sin(t * 1.4 + bl.i * 0.9) * 0.09;
        bl.grp.rotation.y += 0.004;
        bl.core.rotation.y = -t * 0.9;
        bl.core.rotation.x = t * 0.55;
        const wave = Math.max(0, Math.sin(t * 2.2 - bl.i * 0.9));
        bl.mat.emissiveIntensity = 0.3 + wave * 1.2;
        (bl.core.material as MeshStandardMaterial).emissiveIntensity = 1.5 + wave * 1.3;
        bl.coreHalo.material.opacity = 0.4 + wave * 0.45;
      });
      links.forEach((lk, i) => {
        lk.mat.opacity = 0.3 + Math.max(0, Math.sin(t * 2.2 - i * 0.9 - 0.4)) * 0.4;
      });
    },
  };
}

export function BlockchainHelix() {
  return <primitive object={useBuilt(buildHelix)} />;
}
