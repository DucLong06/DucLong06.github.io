# ═══════════════════════════════════════════════════════════════
# 🔥 COMPLETE PORTFOLIO MASTERPLAN — HOÀNG ĐỨC LONG
# ═══════════════════════════════════════════════════════════════
# "Trust Me, I'm an Engineer"
# Version: 2.0 — Final & Complete
# ═══════════════════════════════════════════════════════════════

---

# TABLE OF CONTENTS

1. [Profile & Identity](#1-profile--identity)
2. [Design Philosophy — "The Hacker's Canvas"](#2-design-philosophy)
3. [Color System & Typography](#3-color-system--typography)
4. [Signature Design Element](#4-signature-design-element)
5. [Tech Stack — Full Breakdown](#5-tech-stack)
6. [3D Graphics — Complete Specification](#6-3d-graphics)
7. [Site Sections — Pixel-Perfect Design](#7-site-sections)
8. [Content Management System (Markdown-Driven)](#8-content-management-system)
9. [Bilingual System (EN/VI)](#9-bilingual-system)
10. [Performance & Responsive Strategy](#10-performance--responsive)
11. [Deployment Pipeline](#11-deployment-pipeline)
12. [GitHub Projects to Showcase](#12-github-projects)
13. [File Structure — Complete Tree](#13-file-structure)
14. [Build Phases & Timeline](#14-build-phases)

---

# 1. PROFILE & IDENTITY

```
╔══════════════════════════════════════════════════════════════╗
║  Name:        Hoàng Đức Long                                ║
║  School:      Electric Power University, Hanoi               ║
║  GitHub:      github.com/DucLong06  (72 repos, 16 followers)║
║  LinkedIn:    linkedin.com/in/hoangduclong                   ║
║  Tagline:     "Trust Me, I'm an Engineer"                    ║
║  Bio:         "Code For Fun"                                 ║
║  Roles:       Backend Engineer × Designer × AI Researcher    ║
║  Stack:       Python → Go Microservices & Kubernetes         ║
║  Passions:    AI/ML, Cybersecurity, Open-source, Design      ║
║  Achievement: 🏆 1st Place ALQAC 2023 (IEEE KSE Conference) ║
║  Badges:      Pull Shark ×2, Starstruck, Arctic Code Vault   ║
╚══════════════════════════════════════════════════════════════╝
```

### What makes Long unique?
Long is a **rare hybrid**: a backend systems engineer who is also a designer,
an AI researcher who publishes IEEE papers, and a cybersecurity enthusiast
who builds production MLOps pipelines. The portfolio must reflect ALL of
these facets — not just "another dev portfolio".

---

# 2. DESIGN PHILOSOPHY

## Concept: `TERMINAL_AESTHETICS × DESIGNER_SOUL`

The entire site feels like navigating a **beautifully designed hacking 
interface**. Think the aesthetic of *Mr. Robot's* UI meets *Dribbble's* 
polish. It's dark, it's neon, it's technical — but every pixel is 
intentionally placed by a designer's eye.

### Two forces in tension:
```
┌─────────────────────┐     ┌─────────────────────┐
│    LEFT BRAIN        │  ×  │    RIGHT BRAIN       │
│                      │     │                      │
│  Terminal commands    │     │  Beautiful typography│
│  Monospace code      │     │  Perfect spacing     │
│  System architecture │     │  Cinematic animation │
│  Raw data, raw power │     │  Color theory        │
│  Hacker aesthetic    │     │  Designer polish     │
└─────────────────────┘     └─────────────────────┘
```

### Aesthetic direction: CYBER-NOIR REFINED
- **NOT** generic dark theme with purple gradients
- **NOT** cluttered cyberpunk chaos
- **IS** dark, minimal, with surgical neon accents
- **IS** every element has breathing room
- **IS** terminal elements rendered with typographic care
- The vibe: walking into a high-end hacker's workstation at 2am —
  screens glowing, everything perfectly organized, zero clutter

### Section naming convention — Linux commands:
Every section is named after a real terminal command, reinforcing
the hacker identity throughout:

| Section | Command Name | Why |
|---------|-------------|-----|
| About | `> man long` | Unix manual page format |
| Skills | `> dpkg --list` | Package listing |
| Experience | `> git log --oneline` | Commit history |
| Projects | `> ls -la ~/projects` | Directory listing |
| Papers | `> cat ~/papers/*.pdf` | Read file contents |
| GitHub Stats | `> neofetch` | System info display |
| Contact | `> ssh long@portfolio` | Remote connection |

---

# 3. COLOR SYSTEM & TYPOGRAPHY

## Color Palette: `NEON_CYBER`

```css
:root {
  /* ═══ BACKGROUNDS ═══ */
  --bg-void:         #06060a;     /* Deepest black — page bg */
  --bg-primary:      #0a0a0f;     /* Main sections */
  --bg-secondary:    #111118;     /* Cards, panels */
  --bg-terminal:     #0d1117;     /* Code blocks, terminal sections */
  --bg-elevated:     #16161f;     /* Hover states, modals */

  /* ═══ ACCENT COLORS ═══ */
  --neon-green:      #00ff88;     /* Primary action — Matrix green */
  --neon-green-dim:  #00cc6a;     /* Green hover state */
  --neon-green-glow: rgba(0,255,136,0.15);  /* Subtle glow bg */
  
  --neon-cyan:       #00d4ff;     /* Links, secondary actions */
  --neon-cyan-dim:   #00a8cc;     /* Cyan hover */
  
  --neon-orange:     #ff6b35;     /* Highlights, badges, awards */
  --neon-purple:     #a855f7;     /* Papers, research accent */
  --neon-pink:       #ff2d7b;     /* Error states, alerts */

  /* ═══ TEXT ═══ */
  --text-primary:    #e8e8ed;     /* Main readable text */
  --text-secondary:  #8b8b9a;     /* Muted — like code comments */
  --text-tertiary:   #4a4a5a;     /* Very muted — timestamps */
  --text-terminal:   #00ff88;     /* Terminal output text */

  /* ═══ BORDERS ═══ */
  --border-subtle:   rgba(255,255,255,0.06);
  --border-visible:  rgba(255,255,255,0.12);
  --border-neon:     rgba(0,255,136,0.3);

  /* ═══ EFFECTS ═══ */
  --glow-green:      0 0 20px rgba(0,255,136,0.3);
  --glow-cyan:       0 0 20px rgba(0,212,255,0.3);
  --glow-orange:     0 0 15px rgba(255,107,53,0.3);
  --scanline:        repeating-linear-gradient(
                       0deg,
                       transparent,
                       transparent 2px,
                       rgba(0,255,136,0.03) 2px,
                       rgba(0,255,136,0.03) 4px
                     );
}
```

## Typography System

```css
/* ═══ DISPLAY — Headers, hero text ═══ */
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');

/* ═══ BODY — Readable paragraphs ═══ */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');

/* ═══ CODE/LABELS — Tags, metadata ═══ */
@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');

:root {
  --font-display:  'JetBrains Mono', monospace;    /* Terminal feel, premium */
  --font-body:     'Plus Jakarta Sans', sans-serif; /* Clean, designer-quality */
  --font-code:     'Space Mono', monospace;          /* Tags, labels, small UI */
}

/* Size scale */
--text-xs:    0.75rem;   /* 12px — metadata, timestamps */
--text-sm:    0.875rem;  /* 14px — labels, captions */
--text-base:  1rem;      /* 16px — body text */
--text-lg:    1.125rem;  /* 18px — lead paragraphs */
--text-xl:    1.25rem;   /* 20px — section subtitles */
--text-2xl:   1.5rem;    /* 24px — section titles */
--text-3xl:   1.875rem;  /* 30px — page titles */
--text-4xl:   2.25rem;   /* 36px — hero subtitle */
--text-hero:  3.5rem;    /* 56px — hero name (desktop) */
--text-hero-mobile: 2rem; /* 32px — hero name (mobile) */
```

### Why these fonts?
- **JetBrains Mono**: Not your average monospace. Designed for code readability
  with distinct letterforms, ligatures optional. Premium hacker feel without
  looking like a generic terminal.
- **Plus Jakarta Sans**: A geometric sans-serif with humanist touches. Excellent
  readability at body sizes, distinctive enough to not look like every other
  portfolio. Long is a designer — the body font must reflect taste.
- **Space Mono**: For small UI elements. Its wide spacing and rigid grid
  reinforce the technical aesthetic in badge labels and metadata.

---

# 4. SIGNATURE DESIGN ELEMENT

## "The Glitch Line" — Long's Visual DNA

A horizontal animated line that appears throughout the entire site as
section dividers, card borders, and decorative elements.

### What it does:
```
Normal state:   ────────────────────────────────────────
                A thin 1px line in --neon-green

Glitch state:   ──────────╌╌╌╌────═══════────╌──────────
(every 8-12s)   RGB splits briefly (red/blue offset 2px)
                Duration: 150-300ms
                Random timing (not on a fixed interval)
                
Hover state:    ════════════════════════════════════════
                Line brightens, glow intensifies
```

### CSS implementation:
```css
.glitch-line {
  height: 1px;
  background: var(--neon-green);
  position: relative;
  opacity: 0.4;
  transition: opacity 0.3s;
}

.glitch-line::before,
.glitch-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  opacity: 0;
}

.glitch-line::before { background: #ff0040; }  /* Red channel */
.glitch-line::after  { background: #0040ff; }  /* Blue channel */

/* Glitch triggers via JS at random intervals */
.glitch-line.glitching::before {
  opacity: 0.6;
  transform: translateX(-2px) translateY(-1px);
  animation: glitch-r 150ms steps(2) forwards;
}

.glitch-line.glitching::after {
  opacity: 0.6;
  transform: translateX(2px) translateY(1px);
  animation: glitch-b 200ms steps(3) forwards;
}
```

### Why this matters:
- It's **ownable** — no other portfolio has this exact element
- It's **subtle** — doesn't distract, but creates character
- It's **consistent** — appears on every section, creating visual rhythm
- It becomes Long's **brand mark** — recognizable across all touchpoints
- It reinforces the **hacker aesthetic** without being cheesy

---

# 5. TECH STACK — FULL BREAKDOWN

## Core Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    FRONTEND LAYER                         │
│                                                          │
│  React 18 ─── Vite 5 ─── Tailwind CSS 3                │
│       │                        │                         │
│       ├── React Three Fiber ── Three.js r128+            │
│       │   └── @react-three/drei (helpers)                │
│       │   └── @react-three/postprocessing               │
│       │                                                  │
│       ├── Framer Motion (scroll/page animations)         │
│       ├── GSAP (complex timeline animations)             │
│       ├── tsparticles (particle backgrounds)             │
│       ├── react-i18next (bilingual EN/VI)                │
│       ├── gray-matter (markdown frontmatter parser)      │
│       ├── react-markdown (render .md to HTML)            │
│       └── EmailJS (contact form, no backend)             │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                    BUILD LAYER                            │
│                                                          │
│  Vite ── custom content-loader plugin                    │
│       └── Reads /content/*.md at build time              │
│       └── Generates importable JSON modules              │
│       └── Outputs static /dist folder                    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                    DEPLOYMENT                             │
│                                                          │
│  GitHub Actions ── auto-trigger on push to main          │
│       └── npm ci → npm run build                         │
│       └── Deploy /dist to gh-pages branch                │
│       └── Live at duclong06.github.io                    │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                    RUNTIME APIs (client-side)             │
│                                                          │
│  GitHub REST API ── fetch repo stars/forks/languages     │
│  EmailJS ── send contact form emails                     │
│  (No backend server. 100% static.)                       │
└──────────────────────────────────────────────────────────┘
```

## Package list with versions

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.28.0",
    "@react-three/fiber": "^8.17.0",
    "@react-three/drei": "^9.115.0",
    "@react-three/postprocessing": "^2.16.0",
    "three": "^0.170.0",
    "framer-motion": "^11.11.0",
    "gsap": "^3.12.0",
    "@tsparticles/react": "^3.0.0",
    "tsparticles": "^3.7.0",
    "react-i18next": "^15.1.0",
    "i18next": "^24.0.0",
    "gray-matter": "^4.0.3",
    "react-markdown": "^9.0.0",
    "react-vertical-timeline-component": "^3.6.0",
    "react-tilt": "^1.0.2",
    "@emailjs/browser": "^4.4.0",
    "react-intersection-observer": "^9.13.0"
  },
  "devDependencies": {
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "@vitejs/plugin-react": "^4.3.0",
    "gh-pages": "^6.2.0"
  }
}
```

## Why each choice?

| Technology | Why chosen | Alternatives rejected |
|-----------|-----------|----------------------|
| **React 18** | Component-based, huge ecosystem, best R3F support | Vue (less 3D ecosystem), Svelte (smaller community) |
| **Vite 5** | Instant HMR, fast builds, plugin system | CRA (slow, deprecated), Webpack (complex config) |
| **Three.js + R3F** | Industry standard web 3D, declarative React API | Babylon.js (heavier), raw Three.js (verbose) |
| **Framer Motion** | Best React animation lib, scroll-triggered | React Spring (less intuitive), CSS-only (limited) |
| **GSAP** | Complex timelines, ScrollTrigger plugin | Anime.js (less features), Lottie (different use case) |
| **Tailwind CSS** | Utility-first, fast prototyping, dark mode | Styled-components (runtime cost), Sass (more verbose) |
| **tsparticles** | Particle effects, lightweight, configurable | particles.js (unmaintained), custom WebGL (overkill) |
| **gray-matter** | Parse YAML frontmatter from markdown | manual YAML parsing (fragile) |
| **EmailJS** | Send emails without backend, free tier | Formspree (limited), custom API (needs server) |
| **GitHub Pages** | Free, auto-deploy, perfect for static | Vercel (overkill), Netlify (unnecessary features) |

---

# 6. 3D GRAPHICS — COMPLETE SPECIFICATION

## 6.1 Overview Map

```
┌──────────────────────────────────────────────────────────┐
│  SECTION          │ 3D ELEMENT              │ WEIGHT     │
├───────────────────┼─────────────────────────┼────────────┤
│  Background       │ Persistent star field    │ Very Low   │
│  (entire page)    │ (tsparticles)            │            │
├───────────────────┼─────────────────────────┼────────────┤
│  Hero             │ Particle network +       │ Medium     │
│                   │ Floating icosahedron     │            │
├───────────────────┼─────────────────────────┼────────────┤
│  About            │ Interactive 3D globe     │ Low        │
│                   │ with Hanoi marker        │            │
├───────────────────┼─────────────────────────┼────────────┤
│  Skills           │ Orbital particles        │ Low-Med    │
│                   │ around central core      │            │
├───────────────────┼─────────────────────────┼────────────┤
│  Projects         │ Card tilt effect         │ Very Low   │
│                   │ (CSS transform, no R3F)  │            │
├───────────────────┼─────────────────────────┼────────────┤
│  Contact          │ Wireframe Earth          │ Low        │
│                   │ rotating slowly          │            │
└───────────────────┴─────────────────────────┴────────────┘
```

## 6.2 Background — Persistent Star Field

**Visible across ALL sections**, behind all content.

```javascript
// tsparticles config
{
  particles: {
    number: { value: 80, density: { enable: true, area: 800 } },
    color: { value: ["#00ff88", "#00d4ff", "#ffffff"] },
    opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 0.5 } },
    size: { value: { min: 0.5, max: 2 } },
    move: { enable: true, speed: 0.3, direction: "none", random: true },
    links: { enable: false }  // No connecting lines — just floating dots
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "grab" },  // Particles connect to cursor
      resize: true
    },
    modes: {
      grab: { distance: 140, links: { opacity: 0.3, color: "#00ff88" } }
    }
  }
}
```

**Effect**: Subtle floating stars. When you hover, nearby particles connect
to cursor with faint green lines — like a neural network coming alive
around your mouse. Always present but never distracting.

## 6.3 Hero — Particle Network + Floating Geometry

**The first thing visitors see. Must be breathtaking.**

### 6.3.1 Particle Network (Three.js via R3F)

```
Concept:
  - 200-300 nodes floating in 3D space
  - Nodes within 2.5 units of each other → connected by thin green lines
  - Entire network rotates very slowly (0.001 rad/frame)
  - Mouse movement causes parallax (network shifts slightly)
  - Nodes pulse with varying opacity
  
Visual:
         •───────•
        /│        \
       • │    •────•
       │ •   /      \
       │/ \ /   •    •
       •───•───/
      /         \
     •     •─────•
```

```jsx
// HeroParticles.jsx — React Three Fiber component
function ParticleNetwork() {
  const count = 250
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 15  // x spread
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10  // y spread
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8   // z depth
    }
    return pos
  }, [])

  useFrame(({ clock, mouse }) => {
    // Slow rotation
    meshRef.current.rotation.y = clock.elapsedTime * 0.02
    meshRef.current.rotation.x = clock.elapsedTime * 0.01
    // Mouse parallax
    meshRef.current.position.x = mouse.x * 0.5
    meshRef.current.position.y = mouse.y * 0.3
  })

  return (
    <group ref={meshRef}>
      <Points positions={positions}>
        <PointMaterial
          color="#00ff88"
          size={0.05}
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </Points>
      {/* Connection lines computed in shader or JS */}
    </group>
  )
}
```

### 6.3.2 Floating Icosahedron

A slowly rotating wireframe icosahedron floating beside the hero text.

```
Visual:
              ╱╲
             ╱  ╲
            ╱    ╲
           ╱  ╱╲  ╲       ← Wireframe, neon green edges
          ╱  ╱  ╲  ╲         Rotates on Y and Z axes
         ╱  ╱    ╲  ╲        Slight float animation (up/down)
         ╲  ╲    ╱  ╱        Glow effect on edges
          ╲  ╲  ╱  ╱
           ╲  ╲╱  ╱
            ╲    ╱
             ╲  ╱
              ╲╱
```

```jsx
function FloatingIcosahedron() {
  const meshRef = useRef()
  
  useFrame(({ clock }) => {
    meshRef.current.rotation.y = clock.elapsedTime * 0.15
    meshRef.current.rotation.z = clock.elapsedTime * 0.08
    meshRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.3
  })

  return (
    <mesh ref={meshRef} position={[3, 0, 0]}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshBasicMaterial
        color="#00ff88"
        wireframe
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}
```

**Post-processing**: Bloom effect on the wireframe to create neon glow.

```jsx
import { Bloom, EffectComposer } from '@react-three/postprocessing'

<EffectComposer>
  <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} intensity={0.5} />
</EffectComposer>
```

## 6.4 About — Interactive 3D Globe

A slowly rotating Earth globe with a glowing marker on Hanoi, Vietnam.

```
Visual:
           ┌──────────┐
          ╱            ╲
         │    ╱──╲      │
         │   ╱    ╲     │
         │  │ * ← Hanoi │    ← Pulsing green dot
         │   ╲    ╱     │    ← Globe rotates slowly
         │    ╲──╱      │    ← Users can drag to rotate
          ╲            ╱
           └──────────┘
```

```jsx
import { Sphere, Html } from '@react-three/drei'

function Globe() {
  const globeRef = useRef()
  const [isDragging, setIsDragging] = useState(false)
  
  // Hanoi coordinates: 21.0285°N, 105.8542°E
  // Convert lat/lng to 3D position on sphere
  const hanoiPosition = useMemo(() => {
    const lat = 21.0285 * (Math.PI / 180)
    const lng = 105.8542 * (Math.PI / 180)
    const radius = 2.02 // slightly above sphere surface
    return [
      radius * Math.cos(lat) * Math.sin(lng),
      radius * Math.sin(lat),
      radius * Math.cos(lat) * Math.cos(lng)
    ]
  }, [])

  useFrame(({ clock }) => {
    if (!isDragging) {
      globeRef.current.rotation.y = clock.elapsedTime * 0.05
    }
  })

  return (
    <group ref={globeRef}>
      {/* Earth sphere — wireframe style */}
      <Sphere args={[2, 32, 32]}>
        <meshBasicMaterial
          color="#1a1a2e"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>
      
      {/* Continent outlines — custom geometry or texture */}
      <Sphere args={[2.01, 32, 32]}>
        <meshBasicMaterial
          map={earthOutlineTexture}
          transparent
          opacity={0.5}
        />
      </Sphere>

      {/* Hanoi marker — pulsing green dot */}
      <mesh position={hanoiPosition}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#00ff88" />
      </mesh>
      
      {/* Hanoi label */}
      <Html position={hanoiPosition} distanceFactor={6}>
        <div className="text-neon-green text-xs font-mono 
                        bg-black/50 px-2 py-1 rounded border 
                        border-neon-green/30 whitespace-nowrap">
          📍 Hanoi, Vietnam
        </div>
      </Html>
    </group>
  )
}
```

## 6.5 Skills — Orbital Particle System

Skills float as glowing spheres orbiting a central core.

```
Visual:
             Python •
                    \
          Go •───────⊕───────• Docker
                    /  \
            K8s •      • PyTorch
                      /
               GSAP •
               
  ⊕ = Central glowing core (white)
  • = Skill nodes (colored by category)
  Lines connect to core
  Everything slowly orbits
  Hover on node → name + level appears
```

```jsx
function SkillOrbit({ skills }) {
  return (
    <group>
      {/* Central core */}
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      
      {/* Orbiting skill nodes */}
      {skills.map((skill, i) => {
        const angle = (i / skills.length) * Math.PI * 2
        const radius = 2 + Math.random() * 1.5
        const speed = 0.1 + Math.random() * 0.05
        
        return (
          <OrbitingNode
            key={skill.name}
            skill={skill}
            angle={angle}
            radius={radius}
            speed={speed}
            color={categoryColors[skill.category]}
          />
        )
      })}
    </group>
  )
}
```

## 6.6 Projects — CSS Tilt Effect (No R3F)

Lightweight 3D effect on project cards — no Three.js needed.

```javascript
// react-tilt or vanilla CSS
<Tilt
  tiltMaxAngleX={10}
  tiltMaxAngleY={10}
  glareEnable={true}
  glareMaxOpacity={0.1}
  glareColor="#00ff88"
  glareBorderRadius="12px"
  perspective={1000}
>
  <ProjectCard project={project} />
</Tilt>
```

## 6.7 Contact — Wireframe Earth

Smaller, simpler globe rotating behind the contact form.

```jsx
<Sphere args={[1.5, 24, 24]} rotation={[0.3, 0, 0]}>
  <meshBasicMaterial color="#00ff88" wireframe transparent opacity={0.15} />
</Sphere>
```

## 6.8 Performance Budget for 3D

```
┌─────────────────────────────────────────────────────┐
│  TARGET:  60fps desktop, 30fps mobile                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Desktop (GPU available):                            │
│    - All 3D elements active                          │
│    - Full particle count (250 hero, 80 background)   │
│    - Post-processing bloom enabled                   │
│    - Tilt effects on cards                           │
│                                                      │
│  Tablet:                                             │
│    - Reduce hero particles to 120                    │
│    - Disable post-processing bloom                   │
│    - Keep globe and orbits                           │
│                                                      │
│  Mobile:                                             │
│    - Hero particles: 60 (or static image fallback)   │
│    - No orbiting skills (show hex grid instead)      │
│    - Globe: static image with CSS rotation           │
│    - No tilt effects                                 │
│    - No bloom                                        │
│                                                      │
│  prefers-reduced-motion:                             │
│    - All animations paused                           │
│    - Static versions of all 3D elements              │
│    - Particles: frozen positions, no movement        │
│                                                      │
├─────────────────────────────────────────────────────┤
│  LOADING STRATEGY:                                   │
│    - React.Suspense + lazy() for all Canvas          │
│    - Preload from drei for 3D assets                 │
│    - IntersectionObserver: only render Canvas         │
│      when section is near viewport                   │
│    - Placeholder skeleton while 3D loads             │
└─────────────────────────────────────────────────────┘
```

---

# 7. SITE SECTIONS — PIXEL-PERFECT DESIGN

## 7.0 NAVBAR — Always visible

```
┌──────────────────────────────────────────────────────────┐
│  [⬡ HDL]   About  Skills  Experience  Projects  Papers  │
│                                              [EN|VI] [☰] │
└──────────────────────────────────────────────────────────┘

Desktop: Horizontal links, transparent bg → solid on scroll
Mobile:  Hamburger → full-screen overlay menu
Logo:    Custom monogram "HDL" in hexagon shape
Active:  Neon green underline on current section
Scroll:  Backdrop blur + border-bottom when scrolled
```

**Fixed top, z-50, transition all 0.3s.**

## 7.1 PRELOADER (2-3 seconds)

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│                                                          │
│                        [HDL]                             │
│                    (logo animates in)                     │
│                                                          │
│              > initializing portfolio...                  │
│              > loading modules ████████░░ 78%            │
│              > establishing connection...                │
│                                                          │
│                                                          │
│              ═══════════════════════                      │
│              (glitch line progress bar)                   │
│                                                          │
└──────────────────────────────────────────────────────────┘

- Black screen (#06060a)
- Logo fades in with glitch effect
- Terminal text types out character by character
- Progress bar fills with neon green
- When loaded: screen slides up revealing hero
- Total duration: 2-3 seconds
```

## 7.2 HERO SECTION — "The Terminal Gateway"

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  ┌─ 3D Particle Network Background ─────────────────┐   │
│  │                                                    │   │
│  │   > whoami                                         │   │
│  │                                                    │   │
│  │   HOÀNG ĐỨC LONG          ╱╲                      │   │
│  │                           ╱  ╲                     │   │
│  │   Backend Engineer       ╱    ╲   ← 3D wireframe  │   │
│  │   × Designer            ╱  /\  ╲     icosahedron  │   │
│  │   × AI Researcher       \  \/  /     rotating     │   │
│  │                          ╲    ╱                    │   │
│  │   > cat skills.txt        ╲  ╱                    │   │
│  │   Python | Go | K8s |      ╲╱                     │   │
│  │   ML/AI | Cybersecurity                           │   │
│  │                                                    │   │
│  │   > _  ← blinking cursor                         │   │
│  │                                                    │   │
│  │   [View Projects]  [Download CV]  [Contact]       │   │
│  │                                                    │   │
│  │          ╲╱  scroll to explore                     │   │
│  └────────────────────────────────────────────────────┘   │
│                                                          │
│  ═══════╌╌╌═══════════════════╌╌═══════════  (glitch)    │
└──────────────────────────────────────────────────────────┘

Full viewport height (100vh)
Typing animation reveals text line by line
CTA buttons styled as terminal commands: > [View Projects]
Scroll indicator: animated chevron bouncing
```

### Typing animation sequence:
```
Frame 0:    > whoami
Frame 0.5s: > whoami
             H
Frame 0.8s: > whoami
             HOÀNG ĐỨC LONG
Frame 1.5s: > whoami
             HOÀNG ĐỨC LONG
             Backend Engineer × Designer × AI Researcher
Frame 2.5s: > cat skills.txt
Frame 3.0s: > cat skills.txt
             Python | Go | Kubernetes | ML/AI | Cybersecurity
Frame 3.5s: > _  (cursor blinks indefinitely)
```

## 7.3 ABOUT — `> man long`

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  > man long                                              │
│                                                          │
│  ┌───────────────────┐  ┌──────────────────────────────┐ │
│  │                   │  │                              │ │
│  │   [Photo with     │  │  NAME                        │ │
│  │    scanline        │  │    Hoàng Đức Long —          │ │
│  │    overlay         │  │    Backend Engineer,         │ │
│  │    + glitch        │  │    Designer, AI Researcher   │ │
│  │    effect on       │  │                              │ │
│  │    hover]          │  │  SYNOPSIS                    │ │
│  │                   │  │    A passionate engineer from │ │
│  │   ┌─────────────┐ │  │    Electric Power University, │ │
│  │   │  3D Globe   │ │  │    Hanoi. Specializing in     │ │
│  │   │  with Hanoi │ │  │    Python backend systems     │ │
│  │   │  marker     │ │  │    transitioning to Go        │ │
│  │   │  (rotatable)│ │  │    microservices & Kubernetes. │ │
│  │   └─────────────┘ │  │                              │ │
│  │                   │  │  ACHIEVEMENTS                 │ │
│  └───────────────────┘  │    🏆 1st Place ALQAC 2023    │ │
│                          │    📄 Published IEEE Paper    │ │
│                          │    🔧 72 repos on GitHub      │ │
│                          │    🧊 Arctic Code Vault       │ │
│                          │                              │ │
│                          │  SEE ALSO                    │ │
│                          │    skills(7), projects(1),    │ │
│                          │    papers(5), contact(8)      │ │
│                          └──────────────────────────────┘ │
│                                                          │
│  ═════════════════════════════════════════  (glitch line) │
└──────────────────────────────────────────────────────────┘

Left column: Photo (top) + Globe (bottom)
Right column: man page formatted text
Photo: CSS filter grayscale(20%) + green tint overlay
       On hover: full color + scanline effect
Globe: Interactive, drag to rotate
       Hanoi marker pulses with glow
```

## 7.4 SKILLS — `> dpkg --list`

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  > dpkg --list                                           │
│                                                          │
│  ┌────────────────────────────┬───────────────────────┐  │
│  │                            │                       │  │
│  │   ┌──────┐  ┌──────┐      │    3D Orbital          │  │
│  │   │Python│  │  Go  │      │    Particle System     │  │
│  │   │ 90%  │  │ 60%  │      │                       │  │
│  │   └──────┘  └──────┘      │      • Python          │  │
│  │   ┌──────┐  ┌──────┐      │     /                  │  │
│  │   │Docker│  │ K8s  │      │    ⊕───• Go            │  │
│  │   │ 80%  │  │ 65%  │      │     \                  │  │
│  │   └──────┘  └──────┘      │      • Docker          │  │
│  │   ┌──────┐  ┌──────┐      │                       │  │
│  │   │PyTorc│  │Prompt│      │  (hover = show name)   │  │
│  │   │  75% │  │Eng85%│      │                       │  │
│  │   └──────┘  └──────┘      │                       │  │
│  │                            │                       │  │
│  │  Hexagonal Grid            │                       │  │
│  │  (hover → glow + details) │                       │  │
│  └────────────────────────────┴───────────────────────┘  │
│                                                          │
│  Categories: [All] [Languages] [AI/ML] [DevOps] [Design] │
│                                                          │
│  ════════════════════════════════════════  (glitch line)  │
└──────────────────────────────────────────────────────────┘

Desktop: Split — hex grid left, 3D orbit right
Mobile:  Stack — hex grid only (3D orbit hidden)
Each hex: Skill name + proficiency bar
Hover: Hex glows neon green, shows years + level
Filter tabs: Toggle by category
```

## 7.5 EXPERIENCE — `> git log --oneline`

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  > git log --oneline                                     │
│                                                          │
│  commit a3f8d2e  (HEAD -> present)                       │
│  │ Author: Long <long@engineer.com>                      │
│  │ Date:   2024 - Present                                │
│  │                                                       │
│  │  ┌──────────────────────────────────────────────┐     │
│  │  │ 🏢 [Company Name]                           │     │
│  │  │ Role: Backend Developer                      │     │
│  │  │                                              │     │
│  │  │ • Developed Go microservices                  │     │
│  │  │ • Managed Kubernetes clusters                 │     │
│  │  │ • Built CI/CD pipelines                       │     │
│  │  └──────────────────────────────────────────────┘     │
│  │                                                       │
│  ● ← green dot (scroll-triggered appear)                 │
│  │                                                       │
│  commit 7b2c1a9                                          │
│  │ Date:   2023                                          │
│  │                                                       │
│  │  ┌──────────────────────────────────────────────┐     │
│  │  │ 🏆 ALQAC 2023 — 1st Place                   │     │
│  │  │ IEEE KSE Conference                          │     │
│  │  │                                              │     │
│  │  │ • Legal QA system using LLMs                  │     │
│  │  │ • Published IEEE paper                        │     │
│  │  └──────────────────────────────────────────────┘     │
│  │                                                       │
│  ● (scroll-triggered appear)                             │
│  │                                                       │
│  commit 4e9f0b1                                          │
│  │ Date:   2021 - 2023                                   │
│  │                                                       │
│  │  ┌──────────────────────────────────────────────┐     │
│  │  │ 🎓 Electric Power University                 │     │
│  │  │ ...                                           │     │
│  │  └──────────────────────────────────────────────┘     │
│  │                                                       │
│  ════════════════════════════════════  (glitch line)      │
└──────────────────────────────────────────────────────────┘

Vertical timeline styled as git log
Green branch line grows downward as you scroll
Each "commit" appears with stagger animation
Cards have border-left: 2px solid --neon-green
Commit hashes are generated (random hex, cosmetic)
```

## 7.6 PROJECTS — `> ls -la ~/projects` ⭐ CROWN JEWEL

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  > ls -la ~/projects                                     │
│                                                          │
│  [All] [AI/ML] [Backend] [DevOps] [Security] [Design]   │
│                                                          │
│  ┌─────────────────────────┐  ┌──────────────────────┐   │
│  │ ★ FEATURED              │  │                      │   │
│  │                          │  │  Legal-Prompts       │   │
│  │  face-detection-ml      │  │  🏆 1st Place ALQAC  │   │
│  │  -system                │  │                      │   │
│  │                          │  │  [NLP] [LLM] [Legal] │   │
│  │  [Preview/Screenshot]   │  │                      │   │
│  │                          │  │  ⭐ 11  │  📄 Paper │   │
│  │  ⭐ 38  🍴 8            │  │                      │   │
│  │  [Python][K8s][YOLOv11] │  │  [GitHub] [Paper]    │   │
│  │                          │  │                      │   │
│  │  [Demo] [GitHub]         │  └──────────────────────┘   │
│  └─────────────────────────┘                              │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Sudoku   │  │ OpenCV   │  │ iTerm2   │               │
│  │ Auto     │  │ Univ.    │  │ Setup    │               │
│  │          │  │          │  │          │               │
│  │ [Python] │  │ [OpenCV] │  │ [Shell]  │               │
│  │ ⭐ 1     │  │ ⭐ 2     │  │ ⭐ 1     │               │
│  └──────────┘  └──────────┘  └──────────┘               │
│                                                          │
│  ════════════════════════════════════  (glitch line)      │
└──────────────────────────────────────────────────────────┘

Layout: Bento grid — featured projects are LARGER cards
Cards: 3D tilt on hover + neon border glow
Tags: Styled as terminal badges
Stars/forks: Live from GitHub API
Filter: Category tabs with smooth transition
```

### Click → Project Detail Modal:

```
┌──────────────────────────────────────────────────────────┐
│  ┌────────────────────────────────────────────────────┐  │
│  │  [✕]                                              │  │
│  │                                                    │  │
│  │  face-detection-ml-system                          │  │
│  │  ══════════════════════════                        │  │
│  │                                                    │  │
│  │  Production-grade MLOps pipeline deploying          │  │
│  │  YOLOv11 face detection on GKE.                    │  │
│  │                                                    │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │  [Live Demo Preview — iframe or screenshot]  │  │  │
│  │  │                                              │  │  │
│  │  │                                              │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  Tech: [Python] [YOLOv11] [K8s] [GKE] [Docker]   │  │
│  │  Stars: ⭐ 38   Forks: 🍴 8                       │  │
│  │                                                    │  │
│  │  [🔗 Live Demo]  [📂 GitHub]  [📄 Paper]          │  │
│  │                                                    │  │
│  │  ## Overview                                       │  │
│  │  (rendered from project's markdown body)            │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘

Modal: Full-screen overlay with backdrop blur
Content: Loaded from the project's .md file
Demo: iframe embed if URL provided, screenshot fallback
Close: ✕ button or Escape key or click outside
```

## 7.7 PAPERS — `> cat ~/papers/*.pdf`

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  > cat ~/papers/*.pdf                                    │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │                                                    │  │
│  │  📄 AIEPU at ALQAC 2023: Deep Learning Methods     │  │
│  │     for Legal Information Retrieval and             │  │
│  │     Question Answering                              │  │
│  │                                                    │  │
│  │  Authors: Hoang, Long (highlighted) · Bui, Tung ·  │  │
│  │           Nguyen, Chau · Nguyen, Le                 │  │
│  │                                                    │  │
│  │  Venue: IEEE KSE 2023  │  Year: 2023               │  │
│  │  🏆 1st Place — ALQAC 2023 Task 2                  │  │
│  │                                                    │  │
│  │  Tags: [NLP] [Legal AI] [LLM] [Prompt Engineering] │  │
│  │                                                    │  │
│  │  [PDF ↓]  [DOI →]  [Code →]  [BibTeX ⎘]           │  │
│  │                                                    │  │
│  │  ▶ Abstract (expandable)                           │  │
│  │    Given the widespread integration of AI across... │  │
│  │                                                    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  (more papers can be added via markdown files)           │
│                                                          │
│  ════════════════════════════════════  (glitch line)      │
└──────────────────────────────────────────────────────────┘

Card style: Academic journal feel, dark bg with subtle purple accent
Long's name: highlighted in --neon-green in the author list
BibTeX button: copies citation to clipboard with toast notification
Abstract: Collapsed by default, expand on click
```

## 7.8 GITHUB STATS — `> neofetch`

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  > neofetch                                              │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │                                              │        │
│  │       ██████████████       long@github        │        │
│  │       ██          ██       ──────────────     │        │
│  │       ██  ██████  ██       repos: 72          │        │
│  │       ██  ██████  ██       stars: 53+         │        │
│  │       ██  ██████  ██       followers: 16      │        │
│  │       ██          ██       following: 30      │        │
│  │       ██████████████       contributions: ███ │        │
│  │                            top lang: Python   │        │
│  │       (GitHub avatar       member: 2019       │        │
│  │        ASCII art style)    achievements:      │        │
│  │                             🦈 Pull Shark x2  │        │
│  │                             ⭐ Starstruck     │        │
│  │                             🧊 Arctic Vault   │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │  Contribution Heatmap (live from GitHub API)  │        │
│  │  ░░▓▓░░▓▓▓▓░░░░▓▓▓▓████░░▓▓░░░░░░▓▓▓▓████  │        │
│  │  (colored green blocks — like github profile) │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────────────┐  ┌─────────────────────┐      │
│  │ Top Languages        │  │ Recent Activity     │      │
│  │ Python  ████████ 45% │  │ • Pushed to repo X  │      │
│  │ Smarty  ████░░░░ 25% │  │ • Opened issue on Y │      │
│  │ JS      ███░░░░░ 15% │  │ • Starred repo Z    │      │
│  │ Shell   ██░░░░░░ 10% │  │ • ...               │      │
│  └──────────────────────┘  └─────────────────────┘      │
│                                                          │
│  ════════════════════════════════════  (glitch line)      │
└──────────────────────────────────────────────────────────┘

All data: Live from GitHub REST API (no auth needed for public profiles)
Avatar: Converted to ASCII art style (pixel effect via CSS)
Heatmap: Custom rendered contribution calendar
Languages: Horizontal bar chart
```

## 7.9 CONTACT — `> ssh long@portfolio`

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  > ssh long@portfolio                                    │
│                                                          │
│  ┌────────────────────────┐  ┌────────────────────────┐  │
│  │                        │  │                        │  │
│  │  Connection established │  │    3D Wireframe       │  │
│  │                        │  │    Earth Globe         │  │
│  │  > send_message        │  │    (slowly rotating)   │  │
│  │                        │  │                        │  │
│  │  Name:                 │  │                        │  │
│  │  ┌──────────────────┐  │  │                        │  │
│  │  │                  │  │  │                        │  │
│  │  └──────────────────┘  │  │                        │  │
│  │                        │  │                        │  │
│  │  Email:                │  │                        │  │
│  │  ┌──────────────────┐  │  │                        │  │
│  │  │                  │  │  │                        │  │
│  │  └──────────────────┘  │  │                        │  │
│  │                        │  │                        │  │
│  │  Message:              │  └────────────────────────┘  │
│  │  ┌──────────────────┐  │                              │
│  │  │                  │  │  ┌────────────────────────┐  │
│  │  │                  │  │  │ > open github.com/     │  │
│  │  │                  │  │  │        DucLong06       │  │
│  │  └──────────────────┘  │  │ > open linkedin.com/  │  │
│  │                        │  │        in/hoangduclong │  │
│  │  > [SEND]              │  │ > mailto: email@...   │  │
│  │                        │  │                        │  │
│  └────────────────────────┘  └────────────────────────┘  │
│                                                          │
│  ════════════════════════════════════  (glitch line)      │
└──────────────────────────────────────────────────────────┘

Form: Terminal-styled inputs (monospace, green caret, dark bg)
Send: Button styled as command prompt
Social: Links formatted as terminal commands
Backend: EmailJS — no server needed
Success: "> Message sent successfully. ✓"
Error:   "> Connection failed. Retry? [Y/n]"
```

## 7.10 FOOTER

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Built with ☕ and Three.js by Hoàng Đức Long            │
│  © 2025  •  View source on GitHub                        │
│                                                          │
└──────────────────────────────────────────────────────────┘

Minimal. One or two lines. Link to portfolio's own repo.
```

---

# 8. CONTENT MANAGEMENT SYSTEM

## The Golden Rule: **Edit markdown, never touch code.**

```
CONTENT CHANGES:                    CODE CHANGES:
─────────────────                   ─────────────
✅ Add project      → .md file     ✅ Change theme     → CSS
✅ Remove project   → delete .md   ✅ Add new section  → React
✅ Change bio       → profile.json ✅ Change layout    → React  
✅ Add skill        → skills.json  ✅ Fix bugs         → code
✅ New paper        → .md file
✅ Change job       → .md file
✅ Add certification→ .md file
✅ Update translate → i18n/*.json
```

## Folder structure:

```
content/
├── profile.json              ← Name, bio, avatar, socials
├── skills.json               ← All skills by category
├── projects/
│   ├── _template.md          ← Copy this for new projects
│   ├── face-detection.md     ← One file per project
│   ├── legal-prompts.md
│   ├── sudoku-auto.md
│   ├── opencv-university.md
│   ├── iterm2-setup.md
│   └── (add more here...)
├── experience/
│   ├── _template.md
│   └── (one file per job)
├── papers/
│   ├── _template.md
│   ├── alqac-2023.md
│   └── (add more here...)
├── certifications/
│   └── (one file per cert)
└── i18n/
    ├── en.json               ← English UI text
    └── vi.json               ← Vietnamese UI text
```

## Project markdown format:

```markdown
---
title: "Project Name"
slug: "project-slug"
description:
  en: "English description"
  vi: "Mô tả tiếng Việt"
category: "ai"              # ai | backend | devops | security 
                             # | design | algorithms | devtools
tags: ["Python", "K8s"]
featured: true               # true = large card on homepage
order: 1                     # lower = higher in list
github: "https://github.com/DucLong06/repo-name"
demo: "https://demo-url.com" # live demo link
paper: ""                    # DOI or paper URL
image: "/images/projects/name.png"
status: "completed"          # completed | in-progress | archived
date: "2024-01-15"
award: ""                    # "🏆 1st Place..."
---

## Overview
Your detailed description here. Full markdown supported.

## Features
- Feature 1
- Feature 2
```

## How to add/change content — cheat sheet:

```bash
# ➕ Add project
cp content/projects/_template.md content/projects/new-project.md
vim content/projects/new-project.md    # fill in details
cp screenshot.png public/images/projects/new-project.png
git add . && git commit -m "add project" && git push
# → Live in ~2 minutes

# 🔄 Change company
vim content/experience/2025-new-company.md
git push

# 🛠 Add skill
vim content/skills.json    # add to array
git push

# 📄 New paper
cp content/papers/_template.md content/papers/new-paper.md
vim content/papers/new-paper.md
git push
```

---

# 9. BILINGUAL SYSTEM

```
Implementation: react-i18next

Toggle: [EN | VI] button in navbar — styled as terminal switch
        ┌─────┐
        │EN|VI│  ← click toggles, green highlight on active
        └─────┘

Storage: User preference saved in localStorage

Files:
  content/i18n/en.json  ← All English UI text
  content/i18n/vi.json  ← All Vietnamese UI text

Content: Each content file has bilingual fields:
  description:
    en: "English text"
    vi: "Vietnamese text"

Default: English (international reach)
Fallback: English if Vietnamese translation missing
Transition: Smooth text swap, no page reload
```

---

# 10. PERFORMANCE & RESPONSIVE

## Performance targets:
```
Lighthouse scores (target):
  Performance:    90+
  Accessibility:  95+
  Best Practices: 95+
  SEO:            90+

Loading:
  First Contentful Paint:  < 1.5s
  Largest Contentful Paint: < 2.5s
  Time to Interactive:     < 3.5s
  Total Bundle Size:       < 500KB (excl. 3D assets)
  3D Assets:               < 2MB (lazy loaded)
```

## Responsive breakpoints:
```
Mobile:    < 640px   → Single column, no 3D, simplified
Tablet:    640-1024px → Two columns, reduced 3D
Desktop:   1024-1440px → Full layout, all features
Ultrawide: > 1440px  → Max-width container, centered
```

## Mobile-specific changes:
```
- Hero: Particles reduced to 60, no icosahedron
- About: Stack layout (photo on top, text below), no globe
- Skills: Hex grid only, no 3D orbit
- Projects: Single column cards, no tilt effect
- Contact: Stack layout, no globe
- Navbar: Hamburger menu → fullscreen overlay
- Font sizes: Scale down 10-15%
```

---

# 11. DEPLOYMENT PIPELINE

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  Developer pushes to main branch                         │
│           │                                              │
│           ▼                                              │
│  GitHub Actions workflow triggered                        │
│  (.github/workflows/deploy.yml)                          │
│           │                                              │
│           ▼                                              │
│  Step 1: checkout code                                   │
│  Step 2: setup Node.js 20                                │
│  Step 3: npm ci (install dependencies)                   │
│  Step 4: npm run build (Vite builds /dist)               │
│  Step 5: Deploy /dist to gh-pages branch                 │
│           │                                              │
│           ▼                                              │
│  GitHub Pages serves from gh-pages branch                │
│           │                                              │
│           ▼                                              │
│  ✅ Live at: https://duclong06.github.io                 │
│                                                          │
│  Total time: ~2 minutes from push to live                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### GitHub Actions workflow:
```yaml
name: Deploy Portfolio
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

# 12. GITHUB PROJECTS TO SHOWCASE

## Pinned Repositories (confirmed from GitHub profile):

| # | Repo | Stars | Forks | Category | Featured? |
|---|------|-------|-------|----------|-----------|
| 1 | **face-detection-ml-system** | 38 ⭐ | 8 | MLOps/CV | ✅ Yes |
| 2 | **Legal-Prompts** | 11 ⭐ | 0 | AI/NLP | ✅ Yes (award) |
| 3 | **Python-OpenCV-University** | 2 ⭐ | 0 | CV/Education | No |
| 4 | **Sudoku_Auto** | 1 ⭐ | 0 | Algorithms | No |
| 5 | **iTerm2** | 1 ⭐ | 1 | DevTools | No |
| 6 | **DucLong06.github.io** | 0 | 0 | Web | No (old site) |

## GitHub Achievements:
- 🦈 **Pull Shark ×2** — Merged pull requests
- ⭐ **Starstruck** — Repository reached stars milestone
- 🧊 **Arctic Code Vault Contributor** — Code preserved in Arctic vault

## Profile stats:
- 72 total repositories
- 16 followers / 30 following
- Electric Power University, Hanoi
- Bio: "Trust Me, I'm an Engineer"

> **Note**: Long has 72 repos total. Long should review and decide which
> additional repos to showcase beyond the pinned 6.

---

# 13. FILE STRUCTURE — COMPLETE TREE

```
duclong06.github.io/
│
├── .github/
│   └── workflows/
│       └── deploy.yml                 ← Auto-deploy on push
│
├── content/                           ← ✏️ EDIT THESE ONLY
│   ├── profile.json
│   ├── skills.json
│   ├── projects/
│   │   ├── _template.md
│   │   ├── face-detection.md
│   │   ├── legal-prompts.md
│   │   ├── sudoku-auto.md
│   │   ├── opencv-university.md
│   │   └── iterm2-setup.md
│   ├── experience/
│   │   └── _template.md
│   ├── papers/
│   │   ├── _template.md
│   │   └── alqac-2023.md
│   ├── certifications/
│   │   └── _template.md
│   └── i18n/
│       ├── en.json
│       └── vi.json
│
├── public/
│   ├── images/
│   │   ├── avatar.jpg
│   │   ├── projects/
│   │   │   ├── face-detection.png
│   │   │   ├── legal-prompts.png
│   │   │   └── ...
│   │   ├── companies/
│   │   └── certs/
│   ├── files/
│   │   └── HoangDucLong_CV.pdf
│   ├── models/                        ← 3D model files (if any)
│   └── favicon.ico
│
├── src/
│   ├── App.jsx                        ← Main app shell
│   ├── main.jsx                       ← Entry point
│   ├── index.css                      ← Global styles + CSS vars
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Preloader.jsx
│   │   │
│   │   ├── sections/
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Skills.jsx
│   │   │   ├── Experience.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── Papers.jsx
│   │   │   ├── GitHubStats.jsx
│   │   │   └── Contact.jsx
│   │   │
│   │   ├── canvas/                    ← All 3D components
│   │   │   ├── ParticleNetwork.jsx    ← Hero particles
│   │   │   ├── FloatingGeo.jsx        ← Hero icosahedron
│   │   │   ├── Globe.jsx             ← About section globe
│   │   │   ├── SkillOrbit.jsx        ← Skills 3D orbit
│   │   │   ├── WireframeEarth.jsx    ← Contact globe
│   │   │   └── StarsBackground.jsx   ← Persistent particles
│   │   │
│   │   └── ui/
│   │       ├── GlitchLine.jsx        ← Signature element
│   │       ├── TerminalText.jsx       ← Typing animation
│   │       ├── ProjectCard.jsx
│   │       ├── ProjectModal.jsx
│   │       ├── PaperCard.jsx
│   │       ├── TimelineItem.jsx
│   │       ├── SkillHex.jsx
│   │       ├── LanguageToggle.jsx
│   │       └── SectionHeader.jsx
│   │
│   ├── hooks/
│   │   ├── useGitHubStats.js          ← Fetch GitHub API
│   │   ├── useScrollReveal.js         ← Scroll animations
│   │   ├── useMediaQuery.js           ← Responsive logic
│   │   └── useContent.js             ← Load markdown content
│   │
│   ├── utils/
│   │   ├── contentLoader.js           ← Parse .md frontmatter
│   │   ├── motion.js                  ← Framer Motion variants
│   │   └── constants.js               ← Category colors, etc.
│   │
│   └── styles/
│       └── tailwind.css               ← Tailwind directives
│
├── tailwind.config.js                 ← Custom theme config
├── vite.config.js                     ← Vite + content plugin
├── postcss.config.js
├── package.json
├── index.html
└── README.md
```

---

# 14. BUILD PHASES & TIMELINE

```
Phase 1: Foundation (Week 1)
  ├── Project setup (Vite + React + Tailwind)
  ├── Design system (CSS vars, fonts, colors)
  ├── Content loader (markdown → JSON)
  ├── i18n setup (react-i18next)
  ├── Navbar + responsive menu
  ├── Footer
  ├── GlitchLine component
  └── Preloader animation

Phase 2: Hero + 3D Core (Week 2)
  ├── Three.js / R3F setup
  ├── ParticleNetwork (hero background)
  ├── FloatingIcosahedron (hero geometry)
  ├── StarsBackground (persistent particles)
  ├── Hero section (typing animation, CTAs)
  ├── Post-processing (bloom)
  └── Performance optimization pass

Phase 3: Content Sections (Week 3)
  ├── About section (man page + Globe)
  ├── Skills section (hex grid + orbit)
  ├── Experience timeline (git log style)
  ├── Scroll animations (Framer Motion)
  └── Mobile responsive pass

Phase 4: Showcase (Week 4)
  ├── Projects section (bento grid)
  ├── Project detail modal
  ├── Papers section
  ├── GitHub Stats (neofetch style)
  ├── GitHub API integration
  └── Demo preview system

Phase 5: Polish & Deploy (Week 5)
  ├── Contact form (EmailJS)
  ├── SEO meta tags + Open Graph
  ├── Lighthouse optimization
  ├── Cross-browser testing
  ├── GitHub Actions CI/CD
  ├── Final responsive QA
  └── 🚀 LAUNCH
```

---

# ═══════════════════════════════════════════════════════════
# NEXT STEPS — ACTION REQUIRED FROM LONG
# ═══════════════════════════════════════════════════════════

> **To start building, mình cần Long cung cấp:**
>
> 1. 📄 **Upload CV trực tiếp** (PDF/paste) — Google Docs bị chặn
> 2. 👔 **Work experience** — công ty, vị trí, thời gian, mô tả
> 3. 📂 **Thêm repos** — 72 repos, chọn thêm cái nào ngoài 6 pinned?
> 4. 📄 **Tất cả papers** — ngoài ALQAC 2023 còn paper nào?
> 5. 🏅 **Certifications** — có cert nào không?
> 6. 📷 **Avatar/Photo** — upload ảnh cho About section
> 7. 📧 **Email** — email cho contact form
> 8. 🌐 **Domain** — dùng duclong06.github.io hay custom domain?
> 9. 🎨 **Design refs** — website nào Long thích style?
> 10. ⭐ **Priority repos** — 3-5 projects nào showcase nổi bật nhất?

---

*Đây là bản masterplan hoàn chỉnh 100%. Khi Long cung cấp thông tin, mình code ngay.* 🚀
