# Evidências do P0

Artefatos do baseline local feito em 15 jul. 2026. Eles descrevem o site atual;
não são budgets nem aprovação de launch para a v2.

## Inventário

| Arquivo | Finalidade |
|---|---|
| `desktop-1440x1000.png` | Smoke visual desktop |
| `mobile-390x844@2x.png` | Smoke visual mobile emulado |
| `reduced-motion-1440x1000.png` | Smoke visual com reduced-motion emulado |
| `lighthouse-mobile-{1,2,3}.json` | Três execuções mobile |
| `lighthouse-desktop-{1,2,3}.json` | Três execuções desktop |
| `lighthouse-debug.json` | Primeira execução diagnóstica que não atingiu CPU quiet |

## Ambiente

- Preview: build de produção servido em `http://127.0.0.1:4173`.
- Node.js 24.14.0, pnpm 11.8.0, Lighthouse 13.4.0.
- Google Chrome 149.0.7827.200 em WSL2/headless.
- Mobile Lighthouse: viewport 412×823, DPR 1,75, CPU slowdown 4×, RTT 150 ms,
  throughput 1.638,4 Kbps, método `simulate`.
- Desktop Lighthouse: viewport 1350×940, DPR 1, CPU slowdown 1×, RTT 40 ms,
  throughput 10.240 Kbps, método `simulate`.
- `maxWaitForLoad`: 10.000 ms nas seis execuções comparáveis.

Os valores acima também estão gravados em `configSettings` e `environment` de
cada relatório, tornando a configuração auditável sem depender deste resumo.

## Reprodução

Com Node.js e pnpm disponíveis:

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm build
pnpm preview --host 127.0.0.1 --port 4173
```

Em outro terminal, execute Lighthouse 13.4.0 três vezes para cada `formFactor`,
com Chrome 149, saída JSON, categorias `performance`, `accessibility`,
`best-practices` e `seo`, e `maxWaitForLoad=10000`. Use os valores de
`configSettings` nos relatórios como configuração canônica.

## Limitações

- viewport mobile não equivale a Android real;
- Chrome/WebGL headless em WSL não representa uma GPU de usuário;
- o desktop informa timeout parcial por causa do trabalho contínuo;
- screenshots comprovam renderização inicial, não a jornada completa;
- não houve Safari, Firefox, iOS, teclado ou screen reader nesta fase.
