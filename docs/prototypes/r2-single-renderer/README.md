# R2 — Single renderer

An isolated architecture study for drawing the ambient background, Smile mesh
and liquid media surfaces through one native WebGL canvas and context.

## Prepare assets

```bash
node docs/prototypes/r2-single-renderer/sync-assets.mjs
```

## Run

```bash
pnpm exec vite docs/prototypes/r2-single-renderer --host 127.0.0.1 --port 4302
```

Open `http://127.0.0.1:4302/`. The prototype does not import or modify the v2
runtime.

## Gate

- exactly one canvas and one WebGL context;
- background, Smile and liquid media all use that context;
- linked media remains semantic, focusable and fully clickable;
- frame p95 <= 20 ms during pointer interaction;
- no permanent animation loop on mobile;
- software WebGL renderers receive a static compatibility tier instead of a
  continuous GPU loop;
- DOM image and CSS field remain available as failure fallbacks;
- renderer and shaders <= 30 KB gzip, excluding media and geometry.

## Automated result

The production build and interaction harness were validated locally:

- renderer: 16.99 KB raw / 6.01 KB gzip;
- exactly 1 canvas, 1 WebGL context and 3 programs in every profile;
- SwiftShader compatibility tier: 60 fps median, 16.7–16.8 ms p95,
  0% frames above 20 ms and zero long tasks;
- mobile and reduced-motion profiles: 60 fps with no continuous animation loop;
- full linked card remains keyboard-focusable and clickable above its WebGL
  surface;
- Vite emits hashed geometry and portrait assets in the production build.

The full interaction tier is intentionally reserved for hardware GPU renderers.
It requires visual and performance confirmation in a real desktop browser before
this renderer is integrated into v2.
