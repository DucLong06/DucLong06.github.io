/**
 * tour-control.tsx — Persistent "Touring… ✕ Stop" pill shown while the guided
 * auto-tour is running. Lets the user stop the tour (which also suppresses
 * auto-restart for the rest of the session).
 */
interface Props {
  onStop: () => void;
}

export function TourControl({ onStop }: Props) {
  return (
    <div className="scene-tour-pill" role="status" aria-live="polite">
      <span className="scene-tour-pill__dot" aria-hidden="true" />
      <span>Touring…</span>
      <button
        type="button"
        className="scene-tour-pill__stop"
        onClick={onStop}
        aria-label="Stop tour"
      >
        ✕ Stop
      </button>
    </div>
  );
}
