# AGENTS.md

Guidance for working in this repository.

## Working agreement

- Do not assume missing product requirements. Ask the user whenever an
  unresolved choice materially affects the result.
- Apply critical, evidence-based judgment rather than agreeing by convenience.

## What this is

The personal portfolio of Baltazar Parra (`https://baltz.dev`), served as a
static Astro site. The aesthetic is minimal, dark, editorial, and kinetic. A
single canvas renderer handles the 3D Smile, visual field, liquid image
distortion, and pointer interactions.

The former Vite/React application was retired. The repository root contains
the only site implementation and deployment target.

## Commands

Package manager: **pnpm** (see `pnpm-lock.yaml`). Use Node.js 22.12 or newer.

- `pnpm dev` / `pnpm start` — local Astro server on port 3100.
- `pnpm lint` — ESLint with no warnings allowed.
- `pnpm check` — Astro and TypeScript checks.
- `pnpm build` — generates tokens, checks the site, and builds `dist/`.
- `pnpm artifact:check` — validates the static artifact and SEO assets.
- `pnpm launch:check` — lint, build, and artifact validation.
- `pnpm verify:browser` — browser-level interaction checks.
- `pnpm preview` — serves `dist/` on port 4100.

There is no unit-test runner.

## Architecture

Entry route: `src/pages/index.astro`. It uses `src/layouts/BaseLayout.astro`
for document metadata and composes the page sections in this order: Hero,
About, Writing, Selected work, Caipora, Clouds, Elsewhere, Footer.

### Source areas

- `src/data/site.ts` — editable content, links, labels, and project metadata.
- `src/components/ChromaText.astro` — scroll-revealed chromatic headings.
- `src/lib/visual/unifiedRenderer.js` — all canvas/WebGL visual behavior. It
  owns Smile gaze/scroll motion, image liquid displacement, and motion gating.
- `src/styles/global.css` — reset, tokens, base layout, accessibility defaults.
- `src/styles/home-rework.css` — the page’s layout, responsive rules, and
  non-canvas animations.
- `src/generated/` — generated design-token files; do not edit manually.
- `scripts/` — token/OG generators and launch verification.

### Assets

`public/` contains the Smile model, portrait, Caipora and Clouds images, font,
favicon, OG image, robots, and sitemap. Assets are referenced from the site
root (for example, `/smile.glb`).

## Performance and accessibility

- Keep pointer-specific interactions behind `(hover: hover) and (pointer:
  fine)`; touch remains scroll-reactive where meaningful.
- Use passive listeners and `requestAnimationFrame` scheduling for continuous
  input or scroll work.
- Reuse WebGL resources; avoid allocating vectors, textures, or DOM nodes per
  frame.
- Preserve semantic markup, visible focus states, the skip link, image alt
  text, and external-link safety attributes.

## Build and deployment

`astro.config.ts` produces a static site in `dist/`. Vercel uses `pnpm build`
and publishes `dist/`; the same artifact is suitable for any static host.

Do not hand-edit `dist/`; rebuild it. The GitHub Actions workflow runs lint,
type checks, artifact validation, and Lighthouse budgets for root site changes.
