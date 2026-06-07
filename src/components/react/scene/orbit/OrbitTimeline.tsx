/**
 * OrbitTimeline.tsx — Composes the always-visible timeline around the data block:
 * project nodes placed by year + the experience career arc. Slowly counter-rotates
 * so the ring drifts gently (frozen under reduced motion). Selection is lifted to
 * CyberScene, which opens the DeepDiveCard.
 */
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { SceneData } from '../../../../lib/scene/scene-data-types';
import type { SceneFocus } from '../cyber-config';
import { layoutProjects, layoutExperience } from './orbit-layout';
import { ProjectNode } from './ProjectNode';
import { ExperienceArc } from './ExperienceArc';

interface Props {
  data: SceneData;
  focus: SceneFocus;
  frozen?: boolean;
  onSelectProject: (slug: string) => void;
  onSelectExperience: (company: string) => void;
}

export function OrbitTimeline({ data, focus, frozen, onSelectProject, onSelectExperience }: Props) {
  const groupRef = useRef<Group>(null);
  const projects = useMemo(() => layoutProjects(data.projects.all), [data.projects.all]);
  const experience = useMemo(
    () => layoutExperience(data.experience, data.projects.all),
    [data.experience, data.projects.all],
  );

  useFrame((_, dt) => {
    if (frozen || !groupRef.current) return;
    groupRef.current.rotation.z += dt * 0.015; // slow drift
  });

  const projFocus = focus?.kind === 'project' ? focus.id : null;
  const expFocus = focus?.kind === 'experience' ? focus.id : null;

  return (
    <group ref={groupRef}>
      {projects.map(({ project, position }) => (
        <ProjectNode
          key={project.slug}
          project={project}
          position={position}
          focused={projFocus === project.slug}
          onSelect={onSelectProject}
        />
      ))}
      <ExperienceArc placements={experience} focusedId={expFocus} onSelect={onSelectExperience} />
    </group>
  );
}
