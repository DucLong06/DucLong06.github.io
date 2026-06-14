/**
 * quantum-world.tsx — Composition of the Quantum Data World: static dressing plus
 * the six section structures, each self-positioned from the shared SECTIONS ring
 * layout (scene-config) so geometry, camera, and tour all agree.
 */
import { SceneDressing } from './scene-dressing';
import { QuantumCore } from './quantum-core';
import { GpuRack } from './gpu-rack';
import { BlockchainHelix } from './blockchain-helix';
import { LedProjectBoard } from './led-project-board';
import { GalleryPedestals } from './gallery-pedestals';
import { SatelliteStation } from './satellite-station';

export function QuantumWorld() {
  return (
    <group>
      <SceneDressing />
      <QuantumCore />
      <GpuRack />
      <BlockchainHelix />
      <LedProjectBoard />
      <GalleryPedestals />
      <SatelliteStation />
    </group>
  );
}
