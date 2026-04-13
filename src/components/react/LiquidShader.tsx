/**
 * LiquidShader.tsx — OGL WebGL aurora shader React island.
 *
 * Features:
 * - OGL Renderer + Program + Triangle (full-screen quad)
 * - Uniforms: uTime, uMouse (lerped, [-1..1]), uResolution
 * - DPR clamped to 1.5 for mobile perf
 * - IntersectionObserver: pause raf when canvas out of viewport
 * - document.visibilitychange: pause when tab hidden
 * - prefers-reduced-motion OR WebGL unavailable → <img> fallback
 * - Mouse disabled on touch devices ('ontouchstart' in window)
 * - Cleanup on unmount
 */
import { useEffect, useRef } from 'react';
import frag from '../../shaders/aurora.frag.glsl?raw';
import vert from '../../shaders/aurora.vert.glsl?raw';

// OGL types — imported dynamically to avoid SSR issues
type OGLRenderer = import('ogl').Renderer;
type OGLProgram = import('ogl').Program;
type OGLMesh = import('ogl').Mesh;

interface Props {
  className?: string;
}

// ─── Fallback image ───────────────────────────────────────────────────────────
function AuroraFallback({ className }: { className?: string }) {
  return (
    <img
      src="/aurora-fallback.png"
      alt=""
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
  );
}

// ─── Feature detection helpers ────────────────────────────────────────────────
function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function webGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LiquidShader({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    rafId: 0,
    running: false,
    visible: true,
    tabVisible: true,
    mouseTarget: { x: 0, y: 0 },
    mouseCurrent: { x: 0, y: 0 },
    isTouchDevice: false,
  });

  // SSR guard — render nothing until client
  // (Astro client:visible ensures this only mounts in browser)
  const isClient = typeof window !== 'undefined';

  useEffect(() => {
    if (!isClient) return;

    const st = stateRef.current;
    st.isTouchDevice = 'ontouchstart' in window;

    // Fallback checks — if triggered, component renders <AuroraFallback>
    // This effect won't run in that case (see render path below),
    // but kept here as safety net for dynamic preference changes.
    if (prefersReducedMotion() || !webGLAvailable()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let renderer: OGLRenderer;
    let program: OGLProgram;
    let mesh: OGLMesh;
    let startTime = performance.now();

    async function init() {
      const { Renderer, Program, Triangle, Mesh } = await import('ogl');

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      renderer = new Renderer({
        canvas: canvas!,
        dpr,
        alpha: true,
        premultipliedAlpha: false,
        antialias: false,
      });

      const gl = renderer.gl;

      // Resize to fill parent container
      function resize() {
        const parent = canvas!.parentElement;
        const w = parent ? parent.offsetWidth : window.innerWidth;
        const h = parent ? parent.offsetHeight : window.innerHeight;
        renderer.setSize(w, h);
        if (program) {
          program.uniforms.uResolution.value = [w * dpr, h * dpr];
        }
      }

      resize();
      window.addEventListener('resize', resize, { passive: true });

      program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms: {
          uTime:       { value: 0 },
          uMouse:      { value: [0, 0] },
          uResolution: { value: [canvas!.width, canvas!.height] },
        },
      });

      const geometry = new Triangle(gl);
      mesh = new Mesh(gl, { geometry, program });

      // Mouse listener — desktop only
      function onMouseMove(e: MouseEvent) {
        if (st.isTouchDevice) return;
        st.mouseTarget.x = (e.clientX / window.innerWidth)  * 2 - 1;
        st.mouseTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
      }
      window.addEventListener('mousemove', onMouseMove, { passive: true });

      // RAF loop
      function tick() {
        if (!st.running || !st.visible || !st.tabVisible) return;
        st.rafId = requestAnimationFrame(tick);

        // Lerp mouse
        const lerpFactor = 0.06;
        st.mouseCurrent.x += (st.mouseTarget.x - st.mouseCurrent.x) * lerpFactor;
        st.mouseCurrent.y += (st.mouseTarget.y - st.mouseCurrent.y) * lerpFactor;

        const elapsed = (performance.now() - startTime) / 1000;
        program.uniforms.uTime.value = elapsed;
        program.uniforms.uMouse.value = [st.mouseCurrent.x, st.mouseCurrent.y];

        renderer.render({ scene: mesh });
      }

      st.running = true;
      tick();

      // IntersectionObserver — pause when canvas scrolled out of view
      const io = new IntersectionObserver(
        ([entry]) => {
          st.visible = entry.isIntersecting;
          if (st.visible && st.running && st.tabVisible) {
            cancelAnimationFrame(st.rafId);
            tick();
          }
        },
        { threshold: 0.01 }
      );
      io.observe(canvas!);

      // Visibility change — pause when tab hidden
      function onVisibility() {
        st.tabVisible = document.visibilityState === 'visible';
        if (st.tabVisible && st.running && st.visible) {
          cancelAnimationFrame(st.rafId);
          tick();
        }
      }
      document.addEventListener('visibilitychange', onVisibility);

      // Reduced-motion media query listener (dynamic preference change)
      const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      function onMotionChange() {
        if (motionQuery.matches) {
          st.running = false;
          cancelAnimationFrame(st.rafId);
        }
      }
      motionQuery.addEventListener('change', onMotionChange);

      // Cleanup closure
      return () => {
        st.running = false;
        cancelAnimationFrame(st.rafId);
        io.disconnect();
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('visibilitychange', onVisibility);
        motionQuery.removeEventListener('change', onMotionChange);
        // OGL cleanup
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }

    let cleanupFn: (() => void) | undefined;
    init().then((fn) => { cleanupFn = fn; });

    return () => { cleanupFn?.(); };
  }, []);

  // Render fallback for reduced-motion or no WebGL
  if (isClient && (prefersReducedMotion() || !webGLAvailable())) {
    return <AuroraFallback className={className} />;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
