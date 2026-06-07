/**
 * journey-skeleton.tsx — Calm poster shown for the brief moment the WebGL canvas
 * initializes (Canvas Suspense fallback). Purely decorative (aria-hidden); the
 * real SSR 2D content sits behind it so there is never a blank screen.
 */
export default function JourneySkeleton() {
  return (
    <div className="journey-skeleton" aria-hidden="true">
      <span className="journey-skeleton__pulse" />
    </div>
  );
}
