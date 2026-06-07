/**
 * CoreExperience.tsx — Top-level orchestrator for the 3D "Glass Core" hero.
 * Successor to SceneExperience; identical island contract.
 *
 * Mounted as a `client:only="react"` Astro island. Intentionally LIGHT: it
 * decides capability, lazy-loads the heavy R3F scene only when enabled, and
 * toggles `html.scene-3d-active` so the SSR'd 2D site is hidden while 3D runs.
 *
 * When capability is 'fallback' or 'pending', it renders nothing and the
 * server-rendered 2D site remains the experience (SEO + a11y + no-JS safe).
 */
import { Suspense, lazy, useEffect } from 'react';
import type { SceneData } from '../../../lib/scene/scene-data-types';
import { useSceneCapability } from './use-scene-capability';
import { SceneLoader } from './ui/SceneLoader';

const CoreScene = lazy(() => import('./CoreScene'));

interface Props {
  data: SceneData;
}

export default function CoreExperience({ data }: Props) {
  const { capability, setMode } = useSceneCapability();
  const active = capability === 'enabled';

  // Hide / reveal the 2D site by toggling a root class the global CSS reacts to.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('scene-3d-active', active);
    return () => root.classList.remove('scene-3d-active');
  }, [active]);

  if (!active) return null;

  return (
    <div className="island-root" aria-label={data.profile.name}>
      <Suspense fallback={<SceneLoader />}>
        <CoreScene data={data} onExitToClassic={() => setMode('2d')} />
      </Suspense>
    </div>
  );
}
