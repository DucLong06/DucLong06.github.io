/**
 * SceneLoader.tsx — Lightweight overlay shown while the Three.js bundle and
 * scene assets stream in. Pure DOM/CSS, no 3D deps (it renders before the
 * heavy chunk arrives). Respects reduced-motion via CSS.
 */
export function SceneLoader() {
  return (
    <div className="scene-loader" role="status" aria-live="polite">
      <div className="scene-loader__orb" aria-hidden="true" />
      <p className="scene-loader__label">Initializing data block…</p>
    </div>
  );
}
