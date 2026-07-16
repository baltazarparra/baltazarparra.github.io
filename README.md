# baltz.dev

Personal portfolio of Baltazar Parra, built as a static Astro site with a
canvas-driven interactive layer.

## Commands

Use Node.js 22.12+ and pnpm 11.8.

```bash
pnpm dev
pnpm lint
pnpm check
pnpm build
pnpm launch:check
```

`pnpm build` writes the production site to `dist/`. `pnpm preview` serves that
artifact locally.

## Deployment

Vercel publishes the site at `https://baltz.dev` from the `dist/` directory.
The `Deploy to GitHub Pages` workflow also publishes the same static build at
`https://baltazarparra.github.io` after every push to `main`.

## Structure

```text
src/
  pages/          # Astro routes
  layouts/        # shared document shell and metadata
  components/     # server-rendered presentation components
  data/           # portfolio content
  lib/visual/     # unified WebGL and interaction renderer
  styles/         # global and page-level styling
public/           # images, 3D assets, fonts, SEO files
scripts/          # generation and browser/artifact checks
```

The former Vite/React implementation has been removed; the Astro site at the
repository root is the only application and deployment target.
