/**
 * camera-rig.tsx — drei CameraControls driven by the dive FSM.
 *
 * The arc is two eased legs chained on setLookAt's promise (no GSAP):
 *   diving     → fly to diveWaypoint, then dispatch arriveStage.
 *   stage      → fly the 2nd leg to the face-on stage target.
 *   retracting → fly back via the waypoint to the oblique hub, then arriveHub.
 *   hub        → settle at the oblique overview, re-enable user orbit.
 *
 * IMPORTANT: camera-controls resolves the transition promise off its `rest` event,
 * which does NOT fire when the destination ≈ the current pose (a no-op move). So we
 * never trust the promise alone — each leg's arrival runs on whichever comes first:
 * the promise OR a fallback timer (settle()). A generation counter invalidates the
 * callbacks of any superseded/cancelled effect run (jump slice→slice, close mid-dive,
 * unmount). Reduced-motion snaps and fires arrivals synchronously. `spinRef` gives
 * the slice's true world angle at transition time.
 */
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { hubLookAt, stageLookAt, diveWaypoint } from '../camera-targets';
import type { ZoomState } from '../use-zoom-state';

interface Props {
  zoom: ZoomState;
  reducedMotion: boolean;
  spinRef: React.MutableRefObject<number>;
  onArriveStage: () => void;
  onArriveHub: () => void;
}

/** Max wait for a leg before forcing arrival (covers a missed/absent rest event). */
const SETTLE_FALLBACK_MS = 1500;

export default function CameraRig({ zoom, reducedMotion, spinRef, onArriveStage, onArriveHub }: Props) {
  const controlsRef = useRef<React.ElementRef<typeof CameraControls>>(null);
  const invalidate = useThree((s) => s.invalidate);
  const genRef = useRef(0);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const gen = ++genRef.current;
    const alive = () => gen === genRef.current;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const animate = !reducedMotion;
    const spin = spinRef.current;
    const { mode, wedgeId } = zoom;

    controls.enabled = mode === 'hub';

    // Run cb on whichever fires first: the move's promise or the fallback timer.
    const settle = (p: Promise<unknown>, cb: () => void) => {
      let fired = false;
      const go = () => {
        if (fired || !alive()) return;
        fired = true;
        cb();
      };
      void p.then(go, go);
      timers.push(setTimeout(go, SETTLE_FALLBACK_MS));
    };

    if (mode === 'diving' && wedgeId) {
      if (!animate) {
        void controls.setLookAt(...stageLookAt(wedgeId, spin), false);
        if (alive()) onArriveStage();
      } else {
        settle(controls.setLookAt(...diveWaypoint(wedgeId, spin), true), () => {
          if (alive()) onArriveStage();
        });
      }
    } else if (mode === 'stage' && wedgeId) {
      void controls.setLookAt(...stageLookAt(wedgeId, spin), animate);
    } else if (mode === 'retracting') {
      if (!animate || !wedgeId) {
        void controls.setLookAt(...hubLookAt(), animate);
        if (alive()) onArriveHub();
      } else {
        settle(controls.setLookAt(...diveWaypoint(wedgeId, spin), true), () => {
          if (!alive()) return;
          settle(controls.setLookAt(...hubLookAt(), true), () => {
            if (alive()) onArriveHub();
          });
        });
      }
    } else {
      void controls.setLookAt(...hubLookAt(), animate);
    }

    invalidate();
    return () => {
      genRef.current++; // invalidate any in-flight callbacks from this run
      timers.forEach(clearTimeout);
    };
  }, [zoom.mode, zoom.wedgeId, reducedMotion, spinRef, onArriveStage, onArriveHub, invalidate]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.6}
      minDistance={3}
      maxDistance={13}
      minPolarAngle={Math.PI * 0.12}
      maxPolarAngle={Math.PI * 0.86}
      dollyToCursor={false}
    />
  );
}
