# Metamorphosis — handoff for Claude Code

Scroll/autoplay portfolio for **Hoàng Đức Long** (duclong06.github.io, Astro v5).
One canvas picture that morphs through six states:

| # | state      | what it shows                                                        |
|---|------------|----------------------------------------------------------------------|
| 0 | name       | "Hoàng Đức Long" centred, tech chips drifting behind                 |
| 1 | network    | skills → tools → systems → results; bright edges = real dependencies |
| 2 | matrix     | companies × domains, cells = system names, result column = outcomes  |
| 3 | expertise  | 10 domain tiles with original vector icons                           |
| 4 | evidence   | awards (trophy / medal / certificate) + 6 GitHub-style repo cards    |
| 5 | output     | name again (yellow) + contact bar (DOM)                              |

`index.html` is self-contained: open it in a browser, no build step.
Only external resources: two Google Fonts (STIX Two Text, JetBrains Mono).

## How it works (read before editing)

* `#stage` canvas is fixed full-screen. `#track` is six empty `.step` blocks (150vh each)
  so the page scrolls; scroll progress `p ∈ [0,1]` drives everything.
* `s = p*(SCENES-1)`; `i = floor(s)` is the current picture, `tt` the fraction to the next.
  While `tt < .3` the picture is drawn **crisp** (vector). Between `.3` and `.88` the
  3,000 **particles** morph from `shapes[i]` to `shapes[i+1]`. After `.88` the next picture
  is drawn crisp. (`hold`, `nextHold`, `k` in `frame()`.)
* Each picture has three parts that must agree on geometry:
  1. `layoutXxx()` — computes positions into `meta.xxx` (frame units, origin at screen centre)
  2. `shapeXxx()` — samples particle targets from that layout (`fromList`)
  3. `drawXxx(alpha, time)` — crisp drawing from `meta.xxx`
* Autoplay: `stepAuto(dt)` advances `autoP`, holds `HOLD`s, crosses in `MORPH`s, loops.
  Wheel / touch / arrow keys pause it; `#ctl` has prev / play / next / dots.
* All text uses `fitMono` / `fitSerif` so it shrinks to fit its box.
* Icons are original canvas paths in `icon(kind, …)` — no brand logos
  (Kubernetes / Python / GitLab marks are trademarks; add official SVGs as `<img>` if wanted).

## Where the data lives — edit these, not the drawing code

Search for `===== DATA` in `index.html`:

* `NET.layers` (4 arrays of labels) and `NET.edges` as `[layer, fromIndex, toIndex]`
* `MAT.rows / years / cols / icons / cells / out`
* `DOM` (10 tiles: `k` icon kind, `t` title, `s` tools)
* `AWARDS`, `PROJ` (repo cards: `l` language, `c` language colour, `st` stars)
* `CHIPS` (drifting tech chips), `caps` (per-scene caption), `names` (HUD)

## Suggested Astro port

```
src/
  components/Metamorphosis.astro   # <canvas>, #hud, #ctl, #contact, #track markup + <style>
  scripts/metamorphosis.ts         # the IIFE from <script>, exported as init(canvas, data)
  data/metamorphosis.ts            # NET, MAT, DOM, AWARDS, PROJ, CHIPS, caps, names
pages/index.astro                  # <Metamorphosis client:load />  (or plain <script> import)
```

* Keep the canvas code framework-free; only move the DATA block into `data/` and import it.
* `nameWidth()`, `U`, `FX/FY` are computed in `size()` — call it again if the component mounts
  after fonts load (`document.fonts.ready.then(size)`) so text particle sampling uses the real font.
* `prefers-reduced-motion` disables autoplay and particle easing; keep that.
* For the VI locale, translate `caps`, `names`, hero strings in `drawHero`, and the contact bar.

## Known limits / nice-to-haves

* Phone width works but the matrix is dense; consider hiding the `years` line under 500px.
* Repo cards are static data; fetch stars at build time the way the current site does.
* The contact bar uses `navigator.clipboard` with a select-text fallback.
