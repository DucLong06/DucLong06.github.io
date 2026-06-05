/**
 * IslandWorld.tsx — In-canvas composition of the island + all section props.
 * Props are placed from the shared SECTIONS layout so geometry, pins, and the
 * camera all agree on positions.
 */
import { FloatingIsland } from './geometry/FloatingIsland';
import { House } from './geometry/House';
import { SignCluster } from './geometry/SignCluster';
import { SkillTower } from './geometry/SkillTower';
import { ProjectCrates } from './geometry/ProjectCrates';
import { Library } from './geometry/Library';
import { Mailbox } from './geometry/Mailbox';
import { Mascot } from './geometry/Mascot';
import { Decor } from './geometry/Decor';
import { getSection } from './scene-config';

export function IslandWorld() {
  return (
    <group>
      <FloatingIsland />
      <House position={getSection('about').prop} />
      <SignCluster position={getSection('experience').prop} />
      <SkillTower position={getSection('skills').prop} />
      <ProjectCrates position={getSection('projects').prop} />
      <Library position={getSection('papers').prop} />
      <Mailbox position={getSection('contact').prop} />
      <Mascot position={[-1.6, 0, 3.4]} />
      <Decor />
    </group>
  );
}
