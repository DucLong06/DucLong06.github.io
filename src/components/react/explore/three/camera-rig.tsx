/**
 * camera-rig.tsx — drei CameraControls driven by the zoom FSM.
 *
 * On mode/wedge change, computes the destination via camera-targets (pure) and
 * calls setLookAt with enableTransition = !reducedMotion (snap when reduced-motion).
 * Camera is NEVER mutated directly (CameraControls owns it). User orbit is allowed
 * in hub mode and locked while focused so the framed view holds behind the overlay.
 * drei's CameraControls auto-invalidates under frameloop="demand"; we also kick an
 * invalidate() after each programmatic move.
 */
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraControls } from '@react-three/drei';
import { hubLookAt, wedgeLookAt } from '../camera-targets';
import type { ZoomState } from '../use-zoom-state';

interface Props {
  zoom: ZoomState;
  reducedMotion: boolean;
}

export default function CameraRig({ zoom, reducedMotion }: Props) {
  const controlsRef = useRef<React.ElementRef<typeof CameraControls>>(null);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const animate = !reducedMotion;
    const lookAt =
      zoom.mode === 'focused' && zoom.wedgeId ? wedgeLookAt(zoom.wedgeId) : hubLookAt();
    void controls.setLookAt(...lookAt, animate);

    // Lock manual orbit while focused; allow it on the hub overview.
    controls.enabled = zoom.mode === 'hub';
    invalidate();
  }, [zoom.mode, zoom.wedgeId, reducedMotion, invalidate]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      smoothTime={0.7}
      minDistance={3}
      maxDistance={12}
      minPolarAngle={Math.PI * 0.22}
      maxPolarAngle={Math.PI * 0.78}
      dollyToCursor={false}
    />
  );
}
