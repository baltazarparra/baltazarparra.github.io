# QA — baltz.dev v2

> Documento vivo. O P0 registra apenas o baseline do site atual; a matriz final
> e o aceite de launch pertencem ao P8.

## Estado dos gates

| Gate | Estado | Evidência |
|---|---|---|
| P0 — baseline e governança | Concluído | `docs/baseline.md` e `docs/evidence/p0/` |
| P1 — catálogo e antirrepertório | Concluído | `docs/padroes.md` e D-0007 |
| P2 — brief e conceito | Concluído | `docs/conceito.md` e D-0009 |
| P3 — direção de arte | Concluído | `docs/direcao-de-arte.md`, D-0010 e `docs/evidence/p3/` |
| P4 — motion concept | Concluído | `docs/motion-concept.md`, D-0011 e `docs/evidence/p4/` |
| P5 — stack e vertical slice | Concluído | `docs/stack.md`, D-0012/D-0013, `v2/` e `docs/evidence/p5/` |
| P6 — produção completa | Concluído | D-0014, `v2/` e `docs/evidence/p6/` |
| P7 — polish e costuras | Concluído | D-0015 e `docs/evidence/p7/` |
| P8 — hardening e QA | Concluído com riscos aceitos | `docs/evidence/p8/` e D-0017 |
| P9 — launch controlado | Preparação local em execução | `docs/launch-checklist.md` |
| P10 | Não iniciado | Ver `DEVELOPMENT_PLAN.md` |

## Baseline automatizado

| Check | Ambiente | Resultado | Estado |
|---|---|---|---|
| ESLint | Node 24.14.0 / pnpm 11.8.0 | Zero warnings | Passou |
| Build de produção | Vite 8.0.16 | Build concluído | Passou |
| Console | Lighthouse/Chrome 149 | Zero erros | Passou |
| Axe/Lighthouse | 3× mobile + 3× desktop | 100 em todas | Passou no automatizado |
| Best Practices | 3× mobile + 3× desktop | 100 em todas | Passou no automatizado |
| SEO técnico | 3× mobile + 3× desktop | 100 em todas | Passou com débitos editoriais |
| Performance mobile | Emulação Lighthouse | Mediana 52; TBT 11,7 s | Dívida crítica |
| Performance desktop | Emulação Lighthouse | Mediana 63; TBT 6,6 s | Dívida crítica |

## Smoke visual do site atual

| Cenário | Evidência | Resultado | Limitação |
|---|---|---|---|
| Desktop 1440×1000 | `desktop-1440x1000.png` | Conteúdo e WebGL renderizados | Chrome headless/WSL |
| Mobile 390×844, DPR 2 | `mobile-390x844@2x.png` | Sem overflow visível no hero | Emulação, não aparelho real |
| Reduced motion | `reduced-motion-1440x1000.png` | Conteúdo renderizado em estado reduzido | Emulação de mídia |

## Vertical slice P5 automatizada

| Check | Ambiente | Resultado | Estado |
|---|---|---|---|
| ESLint + Astro check + build | Node 24.14 / Astro 7.0.9 | Zero warnings, erros ou hints; 2 páginas estáticas | Passou |
| Lighthouse mobile, 3× | Chrome 149, preset mobile | Performance 97; LCP mediano 2,414 s; TBT mediano 0 ms | Passou |
| Lighthouse desktop, 3× | Chrome 149, preset desktop | Performance 100; LCP mediano 0,533 s; TBT 0 ms | Passou |
| A11y / Best Practices / SEO | 6 relatórios | 100 / 100 / 100 em todos | Passou |
| Runtime desktop, 3× | 1440×1000, SwiftShader | 60 fps; p95 16,8 ms; zero long tasks | Passou no laboratório |
| Runtime mobile, 3× | 390×844 emulado | 60 fps; p95 16,7 ms; zero long tasks | Passou no laboratório |
| Fallbacks | desktop, mobile/touch, reduced e sem JS | Copy/nav presentes; WebGL condicionado; zero erros/request failures | Passou |
| 404 local | Astro preview | HTTP 404 real, canonical e retorno para home | Passou localmente |

Os dados brutos e screenshots estão em `docs/evidence/p5/`. Device mobile é
emulado, Chrome headless não substitui browser visível e o hosting ainda não
foi alterado; compatibilidade e 404 publicados permanecem no P8.

## Produção completa P6 automatizada

| Check | Ambiente | Resultado | Estado |
|---|---|---|---|
| ESLint + Astro check + build | Node 24.14 / Astro 7.0.9 | Zero warnings, erros ou hints; 2 páginas estáticas | Passou |
| Lighthouse mobile, 3× | Chrome 149, preset mobile | Performance mediana 97; LCP mediano 2,448 s; TBT mediano 0 ms | Passou; uma execução teve LCP de 2,569 s |
| A11y / Best Practices / SEO | 3 relatórios | 100 / 100 / 100 em todos | Passou |
| Runtime desktop, 3× | 1440×1000, SwiftShader | 58,8 fps; p95 16,8 ms; zero long tasks | Passou no laboratório |
| Runtime mobile, 3× | 390×844 emulado | 60 fps; p95 16,8 ms; zero long tasks | Passou no laboratório |
| Conteúdo e links | 4 perfis + verificação HTTP | Inventário aprovado; 11 destinos com HTTP 200; LinkedIn bloqueou curl com 999, mas perfil foi confirmado no índice | Passou com rechecagem manual P8 |
| Teclado | Desktop headless, 17 Tabs | Todos os alvos visíveis com outline de 2 px | Passou no automatizado |
| Fallbacks | desktop, mobile/touch, reduced e sem JS | Conteúdo completo; posters quando WebGL não entra; zero erros/request failures | Passou |

Dados brutos, screenshots e preflight estão em `docs/evidence/p6/`. Browser
visível, leitor de tela e device real continuam deliberadamente no P8.

## Polish P7 automatizado

| Check | Ambiente | Resultado | Estado |
|---|---|---|---|
| ESLint + Astro check + build | Node 24.14 / Astro 7.0.9 | Zero warnings, erros ou hints; 2 páginas estáticas | Passou |
| Lighthouse mobile, 3× | Chrome 149, preset mobile | Performance mediana 98; LCP mediano 2,271 s; TBT 0 ms; CLS 0 | Passou; uma execução teve LCP de 2,570 s |
| A11y / Best Practices / SEO | 3 relatórios | 100 / 100 / 100 em todos | Passou |
| Walkthrough | desktop, mobile, reduced e sem JS | Hero a Clouds; zero erro de console/request inesperado | Passou no automatizado |
| Teclado | Desktop headless, 17 Tabs | Todos os alvos visíveis com outline de 2 px | Passou no automatizado |
| Falha de asset | Capa do Spotify e smile.glb bloqueados | Fallbacks dirigidos; canvas removido; conteúdo funcional | Passou |
| 404 e retorno | Rota local inexistente | HTTP 404, canonical correto e retorno à home | Passou localmente |
| Loader / embed / som | Revisão de custo | Omitidos por medição, privacidade e decisão P4 | Passou |

O walkthrough foi aprovado explicitamente pelo Baltz. A evidência completa
está em `docs/evidence/p7/`.

## Hardening P8

| Check | Ambiente | Resultado | Estado |
|---|---|---|---|
| Lint + Astro check + build | Node 24.15 / Astro 7.0.9 | Zero warnings, erros ou hints; 2 páginas estáticas | Passou |
| Lighthouse mobile, 3× | Chrome 149 | Performance mediana 99; demais 100; LCP 2,267 s; TBT 0; CLS 0 | Passou |
| Lighthouse desktop, 3× | Chrome 149 | Todas as categorias 100; LCP mediano 489 ms; TBT 0; CLS 0 | Passou |
| Runtime desktop/mobile | Chrome headless / SwiftShader | 60 fps; p95 até 16,8 ms; zero long task | Passou no laboratório |
| Firefox | 151 desktop/mobile emulado | Layout, links, âncora, teclado desktop, 404; zero falhas | Passou |
| WebKit | 26.5 desktop/mobile/reduced | Layout, links, âncora, teclado, 404 e fallback | Passou com limitação de proxy externo |
| Reflow/zoom | 320 px, equivalentes a 200%/400% | Zero overflow; teclado íntegro a 400% | Passou no automatizado |
| Semântica/AX | Chrome Accessibility Tree | Landmarks/headings/imagens nomeadas; nenhum controle sem nome | Passou no automatizado |
| SEO/social | Build final | Canonical, robots, sitemap, OG 1200×630 e JSON-LD | Passou localmente |
| Privacidade | Chrome Network/Storage | Sem script externo, iframe, cookie ou storage | Passou |
| Resiliência | Chrome e WebKit com asset falho | Imagem/modelo ocultos; posters e copy preservados | Passou |
| Dependências | Audit do workspace | Runtime v2 sem alerta identificado; 5 avisos no deploy legado | Pendente antes de P9 |
| Device físico / leitor de tela | Indisponível | Safari/iOS, Android intermediário e sessão manual não executados | Requer teste ou aceite |

Evidência completa em `docs/evidence/p8/`. O trabalho automatizado terminou e
Baltz aceitou explicitamente os limites físicos/manuais em 15 jul. 2026.

## Matriz final P8

| Área | Cenários mínimos | Estado |
|---|---|---|
| Teclado | Ordem de foco, foco visível, skip/bypass, ativação | Passou em Chrome/Firefox/WebKit desktop |
| Screen reader | Landmarks, headings, links, imagens, iframe | AX automatizada passou; sessão manual pendente |
| Zoom/reflow | 200% e 400%, 320 CSS px | Passou no automatizado |
| Contraste | Texto, foco, estados, canvas/fallback | Passou P3 + Lighthouse P8 |
| Motion | Normal, reduced-motion, touch, sem WebGL | Passou em laboratório; device real pendente |
| Chrome | Desktop e mobile | Passou; Android real pendente |
| Safari | macOS e iOS | WebKit Linux passou; Safari físico pendente |
| Firefox | Desktop/mobile | Passou |
| Conteúdo | Copy final, links, alt text, embeds | Passou; LinkedIn exige browser por anti-bot |
| SEO/social | Domínio, canonical, OG/Twitter, sitemap, robots | Passou local; hosting final P9 |
| Privacidade | Fontes, Spotify, terceiros/cookies | Passou; apenas capa lazy sem referrer |
| Performance | Lighthouse 3×, traces, FPS/frame time, memória | Passou no laboratório; campo/device pendentes |
| Resiliência | Sem JS pesado, WebGL falho, asset timeout/erro | Passou Chrome/WebKit |
| 404 | Conteúdo, retorno, status/hosting | Passou local; hosting final P9 |
| Rollback | Backup, DNS/hosting e procedimento testado | Plano pronto; valores/teste real no P9 |

## Critério para marcar um item final como verde

Um item só passa quando informa browser/device/versão, cenário executado,
resultado e evidência. Resultado automatizado não substitui verificação manual
quando a interação ou percepção faz parte do critério. Risco não corrigido exige
aceite escrito do Baltz antes de P9.

## Preparação local P9

| Check | Resultado | Estado |
|---|---|---|
| Deploy tooling | `gh-pages` removido; `vercel.json` publica somente `v2/dist` | Passou localmente |
| Supply chain | Audit de produção: 0 vulnerabilidade / 427 dependências | Passou |
| Artifact preflight | 2.087.839 bytes; metadata, OG e arquivos obrigatórios | Passou |
| Lighthouse mobile 3× | Perf 98/99/99; LCP 2,268/2,255/2,256 s; demais categorias 100 | Passou |
| Lighthouse desktop 3× | Perf e demais categorias 100; LCP 492/569/567 ms | Passou |
| Browser smoke | Chrome desktop, 17 Tabs, AX, privacidade, 404 e asset failure | Passou |
| CI | Workflow de quality sem deploy; YAML parseado | Passou localmente |
| Vercel build | Configuração Preview baixada; output idêntico a `v2/dist` | Passou localmente |
| Hosting/DNS/TLS | Vercel, deployment, aliases e DNS capturados sem alteração | Passou em leitura |
| Canonical/redirect | v2 usa apex; produção atual redireciona apex → `www` | Pendente correção autorizada |
| Deploy | Não autorizado e não executado | Pendente |

Evidências em `docs/evidence/p9/`. O candidato local está verde; P9 continua
aberto até Preview, ensaio de rollback, correção do redirect, autorização e
smoke de produção.
