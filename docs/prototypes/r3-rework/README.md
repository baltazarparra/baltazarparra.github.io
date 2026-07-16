# R3 — Rework composition

Prototype isolated from `v2/`. It carries the approved R2 renderer forward
without adding a second WebGL context.

## What this gate validates

- no header and no generic hero statement;
- role and location remain in the hero;
- portrait is square, capped at 400 px visually on desktop and 288 px on
  mobile, so the 800 × 800 source is never upscaled;
- revised About heading with no leading “I” and no legacy body copy;
- linked rows and panels are clickable across their complete surface;
- actual lazy Spotify embed plus a separate full-cover link;
- full-bleed Caipora interruption and asymmetric editorial rhythm;
- one-column mobile composition with no overlaps or horizontal dependency;
- global grain stays CSS-only while the shared renderer owns the dynamic field,
  Smile and portrait liquid response.

## Run

```sh
pnpm exec vite docs/prototypes/r3-rework --host 127.0.0.1 --port 4303
```

Use `?frame=hero`, `about`, `writing`, `projects`, `caipora`, `clouds` or
`elsewhere` to isolate a frame for visual QA.
