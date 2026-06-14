/**
 * use-guided-tour.ts — Controller hook driving the EXISTING focus state through
 * all sections on a timer. It NEVER owns `focusedId`; it only calls back into
 * IslandScene (onFocus / onHome). Option B layering — minimal diff, no refactor.
 *
 * Lifecycle: idle (home) → after TOUR_IDLE_MS auto-start, or manual start() →
 * visit each TOUR_ORDER stop for TOUR_DWELL_MS → home → loop (re-arm idle).
 * Any user interaction (drag/click/key/popup-close) cancels via
 * notifyUserInteract(). A manual stop() additionally suppresses auto-restart for
 * the session. Tab blur pauses; returning resumes the current stop's dwell.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SectionId } from '../../../lib/scene/scene-data-types';
import { TOUR_ORDER, TOUR_DWELL_MS, TOUR_BOOT_MS, TOUR_REARM_MS } from './scene-config';

export interface TourCallbacks {
  /** Focus a section (drives camera + reveals its HUD panel). */
  onFocus: (id: SectionId) => void;
  /** Return to home (focusedId=null → About panel shown, never blank). */
  onHome: () => void;
}

/** Pill state: actively touring, idle/re-arming a loop, or manually stopped. */
export type TourPhase = 'touring' | 'idle' | 'stopped';

export interface TourApi {
  active: boolean;
  phase: TourPhase;
  start: () => void;
  stop: () => void;
  armIdle: () => void;
  clearIdle: () => void;
  notifyUserInteract: () => void;
}

export function useGuidedTour(cb: TourCallbacks): TourApi {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<TourPhase>('idle');

  // Keep latest callbacks in a ref so timer closures stay stable across renders.
  const cbRef = useRef(cb);
  cbRef.current = cb;

  const idleTimer = useRef<number | null>(null);
  const dwellTimer = useRef<number | null>(null);
  const indexRef = useRef(0);
  const activeRef = useRef(false);
  const pausedAtRef = useRef<number | null>(null);
  const hasBootedRef = useRef(false); // first auto-start uses TOUR_BOOT_MS; later re-arms use TOUR_REARM_MS

  const clearTimer = (t: React.MutableRefObject<number | null>) => {
    if (t.current !== null) {
      window.clearTimeout(t.current);
      t.current = null;
    }
  };

  // step()/finish() reference each other; hold them in refs to avoid TDZ + churn.
  const stepRef = useRef<() => void>(() => {});
  const armIdleRef = useRef<() => void>(() => {});

  const finish = useCallback(() => {
    cbRef.current.onHome();
    activeRef.current = false;
    setActive(false);
    setPhase('idle');
    armIdleRef.current(); // loop after a short idle
  }, []);

  const step = useCallback(() => {
    if (indexRef.current >= TOUR_ORDER.length) {
      finish();
      return;
    }
    const id = TOUR_ORDER[indexRef.current];
    cbRef.current.onFocus(id);
    clearTimer(dwellTimer);
    dwellTimer.current = window.setTimeout(() => {
      indexRef.current += 1;
      stepRef.current();
    }, TOUR_DWELL_MS);
  }, [finish]);
  stepRef.current = step;

  const start = useCallback(() => {
    clearTimer(idleTimer);
    hasBootedRef.current = true; // any start past this point makes future waits re-arms
    activeRef.current = true;
    setActive(true);
    setPhase('touring');
    indexRef.current = 0;
    pausedAtRef.current = null;
    step();
  }, [step]);

  const armIdle = useCallback(() => {
    clearTimer(idleTimer);
    // First wait after mount is the short "boot" delay; later waits re-arm slower.
    const delay = hasBootedRef.current ? TOUR_REARM_MS : TOUR_BOOT_MS;
    idleTimer.current = window.setTimeout(start, delay);
  }, [start]);
  armIdleRef.current = armIdle;

  const clearIdle = useCallback(() => clearTimer(idleTimer), []);

  // End the tour and return home. Always re-arms (the idle countdown restarts via
  // IslandScene's home effect). `manual` only changes the pill label.
  const end = useCallback((manual: boolean) => {
    clearTimer(dwellTimer);
    pausedAtRef.current = null;
    activeRef.current = false;
    setActive(false);
    setPhase(manual ? 'stopped' : 'idle');
    cbRef.current.onHome();
  }, []);

  const stop = useCallback(() => end(true), [end]); // pill ✕ → "Tour stopped", still re-arms

  const notifyUserInteract = useCallback(() => {
    if (activeRef.current) {
      end(false); // interrupting a running tour → "re-arming…"
    } else {
      setPhase('idle');
      armIdle(); // restart the idle countdown so the loop re-arms after the wait
    }
  }, [end, armIdle]);

  // Tab-blur pause/resume + global key cancel while touring. Single mount effect.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (activeRef.current) {
          clearTimer(dwellTimer);
          pausedAtRef.current = indexRef.current;
        }
        clearTimer(idleTimer);
      } else if (pausedAtRef.current !== null) {
        indexRef.current = pausedAtRef.current;
        pausedAtRef.current = null;
        stepRef.current(); // resume → restart current stop's dwell (KISS)
      }
    };
    const MODIFIERS = new Set(['Shift', 'Control', 'Alt', 'Meta']);
    const onKey = (e: KeyboardEvent) => {
      // First real key cancels the tour; ignore lone modifier presses.
      if (activeRef.current && !MODIFIERS.has(e.key)) notifyUserInteract();
    };
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('keydown', onKey);
      clearTimer(idleTimer);
      clearTimer(dwellTimer);
    };
  }, [notifyUserInteract]);

  return { active, phase, start, stop, armIdle, clearIdle, notifyUserInteract };
}
