/**
 * IslandBuffer.tsx — `:island` buffer. Lazily mounts the existing 3D
 * IslandScene (untouched) full-screen over the shell; `:q` / Esc / the exit
 * button return to the dashboard. Heavy Three.js code loads only on demand.
 */
import { Suspense, lazy } from 'react';
import { useNvim } from './nvim-context';

const IslandScene = lazy(() => import('../island/IslandScene'));

export function IslandBuffer() {
  const { data, go } = useNvim();
  const exit = () => go('dashboard');

  return (
    <div className="island-root">
      <button type="button" className="island-exit" onClick={exit} aria-label="Exit 3D island">
        :q exit island ✕
      </button>
      <Suspense
        fallback={
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'var(--nv-fg-dark)' }}>
            loading 3D island…
          </div>
        }
      >
        <IslandScene data={data.scene} onExitToClassic={exit} />
      </Suspense>
    </div>
  );
}
