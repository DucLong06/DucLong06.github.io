/**
 * graph-skeleton.tsx — Dark poster shown while the graph island hydrates.
 * Reserves the hero height to avoid layout shift (CLS) and gives a calm,
 * on-brand loading state. Purely decorative (aria-hidden).
 */
export default function GraphSkeleton() {
  return (
    <div className="graph-skeleton" aria-hidden="true">
      <span className="graph-skeleton__orb" />
    </div>
  );
}
