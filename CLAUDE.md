# CLAUDE.md

Guidance for working in this repository.

## What this is

Personal site / portfolio of Baltazar Parra ("baltz"), served at
`https://baltazarparra.github.io/`. Single-page React app built with Vite,
featuring an interactive 3D hero and a shader-driven animated background.
Aesthetic: minimal, cyberpunk, fire-themed.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml` / `pnpm-workspace.yaml`).

- `pnpm start` — dev server on port 3000 (auto-opens, host exposed on LAN)
- `pnpm build` — production build to `dist/` (terser minify, drops `console`/`debugger`)
- `pnpm preview` — preview the production build
- `pnpm lint` — ESLint over `.js`/`.jsx`, `--max-warnings 0` (lint must be clean)
- `pnpm deploy` — runs `predeploy` (build) then publishes `dist/` to GitHub Pages via `gh-pages`

There is no test runner configured.

## Architecture

Entry: `index.html` → `src/main.jsx` → `src/App.jsx`.

`src/App.jsx` is the single page. It composes fixed-position visual layers
(`CustomCursor`, `NoiseBackground`) over scrollable `<main>` content, and drives
all scroll/entrance animations with **GSAP + ScrollTrigger**. Smooth scrolling
uses **Lenis** (only mounted when animations are enabled). Sections in order:
Hero → About (01) → Writing (02) → Projects (03) → Connect (04) → Footer.

### Components (`src/components/`)

- `Hero3D.jsx` — React Three Fiber `<Canvas>` rendering the `smile.glb` model.
  Reacts to mouse/touch (gaze) and scroll (lift/scale). Lazy-loaded via
  `React.lazy` + `Suspense`. Optional `ChromaticAberration` post-processing.
  Camera, model fit, and motion profiles are tuned per viewport width via the
  `get*Profile` / `getCameraSettings` helpers.
- `NoiseBackground.jsx` — fullscreen R3F canvas with a custom GLSL Perlin-noise
  fire shader (`NoiseShader`), plus `Particles` and optional `TVNoiseEffect`.
  Mouse-reactive and scroll-reactive (special intensity ramp near the Connect
  section).
- `Particles.jsx` — GPU point cloud, GLSL vertex/fragment shaders.
- `TVNoiseEffect.jsx` — analog-TV static shader overlay (desktop, high tiers only).
- `CustomCursor.jsx` — custom trailing cursor; only mounts on
  `(hover: hover) and (pointer: fine)` devices and when motion is allowed.
- `PerformanceMonitor.jsx` — runs inside the background `<Canvas>`; samples FPS
  and adjusts `gl.setPixelRatio` at runtime to hold framerate.
- `LatestPostsSection.jsx` / `FeaturedProjectsSection.jsx` — render the Writing
  and Projects sections from data.

### Data & config

- `src/data/homeContent.js` — `writingPosts` and `featuredProjects` arrays.
  **Edit content here**, not in the section components.
- `src/config/qualityConfig.js` — adaptive quality system. `detectDeviceTier()`
  scores the device (memory, CPU cores, resolution, type, battery) into
  `ULTRA / HIGH / MEDIUM / LOW`. `QUALITY_TIERS` define particle counts, noise
  layers, DPR ranges, and whether heavy effects run. The result is cached;
  `forceQualityTier(tier)` overrides for debugging.

### Styles

- `src/index.css` — reset + CSS variables.
- `src/App.css` — all layout/section styling. Animations target the class names
  used by GSAP in `App.jsx` (e.g. `.section-number`, `.section-title`,
  `.connect-link`), so renaming a class can silently break an animation.

## Performance & accessibility conventions

This codebase trades complexity for smoothness on low-end and mobile devices.
Preserve these when editing:

- **Respect `prefers-reduced-motion`** and mobile detection. `App.jsx` computes
  `enableAnimations = !prefersReducedMotion && !isMobile`; many components take
  `reduceMotion` / `isMobile` props and disable work accordingly.
- **Gate heavy effects through `qualityConfig`** rather than hardcoding counts.
- **Throttle input/scroll with `requestAnimationFrame`** (see the rAF-scheduling
  patterns in `Hero3D` and `NoiseBackground`); use `{ passive: true }` listeners.
- **Pause offscreen/hidden work**: canvases use `frameloop="demand"` when not
  animating; `IntersectionObserver` and `visibilitychange` stop loops.
- Reuse THREE objects (vectors, etc.) inside `useFrame` instead of allocating.

## Build & deploy notes

- `vite.config.js` manually chunks `react` and `react-three` vendor bundles,
  hashes filenames, and disables sourcemaps. Console calls are stripped in prod.
- `public/` assets (the `.glb` model, `og.jpg`, icons, `manifest.json`,
  `robots.txt`, `sitemap.xml`, `sw.js`) are copied as-is to `dist/`.
- `public/sw.js` is an **unregister-only** service worker — it tears down any
  previously installed Workbox caches and removes itself. Don't reintroduce
  caching there without intent.
- `dist/` is committed/published output; never hand-edit it — rebuild instead.
- Deploy target is GitHub Pages from the built `dist/`. SEO/OG meta lives in
  `index.html`; absolute URLs assume the `baltazarparra.github.io` origin.
