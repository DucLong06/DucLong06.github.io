// aurora.frag.glsl — Simplex noise fbm liquid aurora
// Colors match "Soft Aurora" design tokens: indigo, violet, cyan, pink
precision highp float;

uniform float uTime;
uniform vec2  uMouse;       // normalized [-1..1]
uniform vec2  uResolution;

varying vec2 vUv;

// ─── Aurora palette (matches CSS tokens) ────────────────────────────────────
const vec3 COLOR_A = vec3(0.388, 0.400, 0.945); // #6366f1 indigo
const vec3 COLOR_B = vec3(0.545, 0.361, 0.965); // #8b5cf6 violet
const vec3 COLOR_C = vec3(0.024, 0.714, 0.831); // #06b6d4 cyan
const vec3 COLOR_D = vec3(0.957, 0.447, 0.714); // #f472b6 pink

// ─── Ashima / Ian McEwan simplex noise (2D) ─────────────────────────────────
// Source: https://github.com/ashima/webgl-noise (MIT licence)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
     0.211324865405187,   // (3.0 - sqrt(3.0)) / 6.0
     0.366025403784439,   // 0.5 * (sqrt(3.0) - 1.0)
    -0.577350269189626,   // -1.0 + 2.0 * C.x
     0.024390243902439    // 1.0 / 41.0
  );

  // First corner
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);

  // Other corners
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

  // Permutations
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                 + i.x + vec3(0.0, i1.x, 1.0));

  vec3 m = max(
    0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)),
    0.0
  );
  m = m * m;
  m = m * m;

  // Gradients: 41 points uniformly over a line, mapped onto a diamond
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

  // Normalise gradients implicitly by scaling m
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);

  // Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x   + h.x  * x0.y;
  g.yz = a0.yz * x12.xz  + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// ─── Fractional Brownian Motion ──────────────────────────────────────────────
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * snoise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

// ─── Main ────────────────────────────────────────────────────────────────────
void main() {
  vec2 uv = vUv;
  uv.x *= uResolution.x / uResolution.y;

  // Mouse distortion — soft radial falloff
  vec2 m    = uMouse * 0.5;
  float dist = length(uv - (m + 0.5));
  float pull = exp(-dist * 3.0) * 0.15;

  // Flowing noise field
  float t = uTime * 0.08;
  vec2  q = uv + vec2(fbm(uv + t), fbm(uv - t));
  float n = fbm(q + pull);

  // Remap n from [-1,1] to [0,1] for smooth mixing
  float nNorm = n * 0.5 + 0.5;

  // Blend 4 aurora colours by noise bands
  vec3 col = mix(COLOR_A, COLOR_B, smoothstep(0.2, 0.6, nNorm));
  col = mix(col, COLOR_C, smoothstep(0.4, 0.8, nNorm));
  col = mix(col, COLOR_D, smoothstep(0.6, 1.0, nNorm));

  // Soft radial vignette
  float vig = 1.0 - length(vUv - 0.5) * 0.8;
  col *= clamp(vig, 0.0, 1.0);

  gl_FragColor = vec4(col, 0.85);
}
