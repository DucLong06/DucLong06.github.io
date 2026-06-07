/**
 * morph-shader.ts — GLSL for the icosa-surface ↔ grid morph field.
 *
 * Vertex: lerps each point between its surface position (built-in `position`,
 * sampled on the icosahedron) and `bPos` (its slot in the background grid
 * lattice), driven by the single `uMorph` uniform. Point size + colour ramp
 * with the morph; a tiny time-based shimmer plays only while near the surface.
 * Fragment: a soft round additive sprite (no texture). All interpolation is on
 * the GPU — the CPU only writes `uMorph`/`uTime` per frame.
 */
export const MORPH_VERT = /* glsl */ `
  attribute vec3 bPos;
  uniform float uMorph;
  uniform float uTime;
  uniform float uSizeA;
  uniform float uSizeB;
  varying float vMix;

  void main() {
    float m = smoothstep(0.0, 1.0, uMorph);
    vMix = m;

    vec3 pos = mix(position, bPos, m);
    // Subtle shimmer while the cloud still hugs the glass surface (fades as it morphs).
    pos += 0.025 * sin(uTime * 0.6 + position.x * 4.0 + position.y * 3.0) * (1.0 - m);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float size = mix(uSizeA, uSizeB, m);
    gl_PointSize = clamp(size * (300.0 / -mv.z), 1.0, 28.0);
    gl_Position = projectionMatrix * mv;
  }
`;

export const MORPH_FRAG = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vMix;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float a = smoothstep(0.5, 0.12, length(c)); // soft round falloff
    if (a <= 0.0) discard;
    vec3 col = mix(uColorA, uColorB, vMix);
    gl_FragColor = vec4(col, a);
  }
`;
