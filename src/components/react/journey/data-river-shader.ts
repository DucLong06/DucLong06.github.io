/**
 * data-river-shader.ts — GLSL for the GPU particle "data river" flowing along the
 * pipeline curve. Each particle drifts a short distance along its local tangent
 * then wraps (seamless flow), with a traveling glow pulse and a cyan→violet
 * gradient keyed to its position along the curve. Additive blend → feeds bloom.
 */

export const RIVER_VERT = /* glsl */ `
  attribute vec3 aTangent;
  attribute float aPhase;
  attribute float aMix;
  uniform float uTime;
  uniform float uSpeed;
  uniform float uSeg;
  uniform float uSize;
  varying float vMix;
  varying float vGlow;

  void main() {
    float travel = mod(uTime * uSpeed + aPhase, uSeg);
    vec3 p = position + aTangent * travel;
    vMix = aMix;
    vGlow = 0.5 + 0.5 * sin(uTime * 1.4 + aMix * 26.0);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    // Clamp so particles the camera flies past don't balloon (fillrate/bloom spikes).
    gl_PointSize = clamp(uSize * (320.0 / -mv.z), 1.0, 28.0);
    gl_Position = projectionMatrix * mv;
  }
`;

export const RIVER_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vMix;
  varying float vGlow;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.0, d);
    vec3 col = mix(uColorA, uColorB, vMix);
    col *= 0.55 + 0.85 * vGlow;
    gl_FragColor = vec4(col, alpha);
  }
`;
