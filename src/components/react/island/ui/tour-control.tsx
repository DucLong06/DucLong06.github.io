/**
 * tour-control.tsx — Persistent tour pill reflecting the guided-tour state:
 *   - touring → "Touring… › <stop>" with a ✕ Stop control
 *   - idle    → "Idle · re-arming…" (a loop will auto-start)
 *   - stopped → "Tour stopped" (re-arms after the idle wait)
 */
import type { TourPhase } from '../use-guided-tour';

interface Props {
  phase: TourPhase;
  nowLabel: string;
  onStop: () => void;
  t: (key: string) => string;
}

export function TourControl({ phase, nowLabel, onStop, t }: Props) {
  const touring = phase === 'touring';
  const label = touring ? t('tour_touring') : phase === 'stopped' ? t('tour_stopped') : t('tour_idle');

  return (
    <div className={`scene-tour-pill${touring ? '' : ' is-paused'}`} role="status" aria-live="polite">
      <span className="scene-tour-pill__dot" aria-hidden="true" />
      <span>{label}</span>
      {touring && nowLabel && <span className="scene-tour-pill__now">› {nowLabel}</span>}
      {touring && (
        <button type="button" className="scene-tour-pill__stop" onClick={onStop} aria-label={t('tour_stop')}>
          ✕ {t('tour_stop')}
        </button>
      )}
    </div>
  );
}
