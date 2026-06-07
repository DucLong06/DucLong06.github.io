/**
 * ProjectContainer.tsx — One "deployed container" chip (DEPLOY). Featured
 * projects get an accent ring + emphasis. Focusable button → opens the project's
 * detail panel.
 */
import type { DeployProject } from '../../../../lib/pipeline/pipeline-data-types';

interface Props {
  project: DeployProject;
  accent: string;
  open: boolean;
  onSelect: () => void;
}

export default function ProjectContainer({ project, accent, open, onSelect }: Props) {
  return (
    <button
      className="deploy-container"
      data-featured={project.featured}
      data-open={open}
      aria-pressed={open}
      style={{ ['--station-accent' as string]: accent }}
      onClick={onSelect}
    >
      <span className="deploy-container__cat">{project.category}</span>
      <span className="deploy-container__title">{project.title}</span>
      {project.featured && <span className="deploy-container__star" aria-hidden="true">★</span>}
    </button>
  );
}
