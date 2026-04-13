/**
 * MagneticTilt.tsx — React island for CSS 3D tilt on hover.
 * Uses RAF-throttled mousemove; perspective(800px) rotateX/Y capped ±8°.
 * Disabled on touch devices and prefers-reduced-motion.
 */
import { useRef, useCallback, useEffect, useState, type ReactNode } from 'react';

interface MagneticTiltProps {
  children: ReactNode;
  className?: string;
  maxDeg?: number;
}

export default function MagneticTilt({
  children,
  className = '',
  maxDeg = 8,
}: MagneticTiltProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [disabled, setDisabled] = useState(false);

  // Detect touch + reduced-motion on mount (client only)
  useEffect(() => {
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (touch || reduced) setDisabled(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled || !wrapRef.current) return;

      if (rafRef.current !== null) return; // throttle: one RAF per frame

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!wrapRef.current) return;

        const rect = wrapRef.current.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        // Normalised -1..1
        const nx = (e.clientX - cx) / (rect.width / 2);
        const ny = (e.clientY - cy) / (rect.height / 2);

        // Clamp to ±1 then scale to maxDeg
        const rotY = Math.max(-1, Math.min(1, nx)) * maxDeg;
        const rotX = -Math.max(-1, Math.min(1, ny)) * maxDeg;

        wrapRef.current.style.transform =
          `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });
    },
    [disabled, maxDeg]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (wrapRef.current) {
      wrapRef.current.style.transform =
        'perspective(800px) rotateX(0deg) rotateY(0deg)';
    }
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        willChange: disabled ? 'auto' : 'transform',
        transition: 'transform 0.15s ease-out',
        transformStyle: 'preserve-3d',
        display: 'contents',
      }}
    >
      {children}
    </div>
  );
}
