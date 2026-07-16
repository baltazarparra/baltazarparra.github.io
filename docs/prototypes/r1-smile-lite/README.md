# R1 — Smile Lite

Isolated performance study for replacing the current React/R3F/Three.js Smile
runtime with native WebGL while preserving the original 3D mesh.

## Generate geometry

```bash
node docs/prototypes/r1-smile-lite/export-geometry.mjs
```

The exporter reads `v2/public/smile.glb`, applies scene transforms and writes a
small binary containing quantized positions, normals and Uint16 indices.

## Run

```bash
pnpm exec vite docs/prototypes/r1-smile-lite --host 127.0.0.1 --port 4300
```

Open `http://127.0.0.1:4300/`. This prototype is not connected to the v2 page
and cannot affect production.

## Gate

- visual result retains the recognisable Smile and pointer response;
- no React, R3F, Three.js or GLTF loader reaches the browser;
- geometry transfer <= 150 KB;
- renderer gzip <= 30 KB;
- first render <= 250 ms desktop and <= 400 ms mobile target device;
- frame p95 <= 20 ms;
- fallback remains visible without WebGL or with a renderer failure.

## Automated result

Measured locally in headless Chrome with three 5-second desktop runs, three
mobile runs and one reduced-motion run:

- production renderer: 8.94 KB raw / 3.63 KB gzip;
- geometry: 77.81 KB raw / 38.15 KB gzip (64.1% smaller than the GLB);
- desktop and mobile frame p95: 16.7 ms median;
- frames above 20 ms: 0%;
- long tasks and console errors: 0;
- desktop JS heap: 1.36 MiB median, with 0.08 MiB median growth;
- mobile and reduced-motion render on demand instead of keeping a permanent
  animation loop.

The production build was also checked to ensure Vite emits the geometry as a
hashed asset. First-render timing and the art direction still require a cold
load on the target browser before this study replaces the current hero.
