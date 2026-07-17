# PRD — Refinamento visual e performance (julho/2026)

> **Versão:** 1.4 — revisão de executabilidade em 2026-07-17; decisões D1–D5
> resolvidas e dependências técnicas ordenadas. Pronta para execução pelo
> [`plano de implementação`](./plano-implementacao-refinamento-2026-07.md).
> **Validação:** cada afirmação técnica foi conferida contra o código atual,
> `AGENTS.md`, os budgets de CI (`lighthouserc.cjs`) e os scripts de
> verificação (`verify-browser.mjs`, `measure-runtime.mjs`,
> `check-launch-artifact.mjs`).

Documento de requisitos para a rodada de ajustes combinada em 2026-07-17.
Cobre (a) achados da revisão de performance e (b) quatro mudanças de produto:
loader de abertura, retrabalho do retrato, limpeza do bloco Caipora e
reorganização do bloco Clouds.

Princípios:
- Coerência e elegância; nenhum motion gratuito.
- Zero regressão nos gates já assertados em CI (ver §2).
- Conforme o working agreement do `AGENTS.md`, escolhas de produto ficam
  explícitas em §8 — as cinco decisões D1–D5 foram resolvidas em 2026-07-17.

---

## 1. Baseline medido (build de produção, preview local)

| Métrica | Valor | Observação |
| --- | --- | --- |
| LCP | 161 ms | Local, sem throttling — não representa campo; os gates reais são os budgets do §2 |
| CLS | 0.00 | Preservar |
| JS único | 145 KB (54 KB gzip) | GSAP + ScrollTrigger são a maior parte |
| HTML | 57 KB (12.8 KB gzip) | CSS 100% inline (`inlineStylesheets: "always"`) — relevante para o F1 |
| Forced reflow no load | ~38 ms | 29 ms em `ScrollTrigger.enable` — custo único, aceitável |

O site está saudável. Os ganhos reais estão em peso de assets, trabalho por
frame durante o scroll e no caminho de inicialização do renderer.

## 2. Gates existentes (CI — `lighthouserc.cjs`, não regredir)

| Gate | Budget |
| --- | --- |
| Performance | ≥ 0.80 |
| Accessibility / Best Practices / SEO | = 1.00 |
| LCP | ≤ 2500 ms |
| CLS | ≤ 0.05 |
| TBT | ≤ 200 ms |

Toda fase termina com esses budgets verdes (3 runs, mobile e desktop).

---

## 3. Achados de performance

### P1 — Assets mortos no deploy `[quick win]`
`public/smile.glb` (217 KB, substituído por `smile-lite.bin`) e
`public/caipora.jpeg` (45 KB, sprite vem do site do jogo) não são
referenciados por código nem por scripts de verificação (conferido —
`check-launch-artifact.mjs` só asserta `og.png`).

**Ação:** deletar ambos. Atualizar a seção *Assets* do `AGENTS.md`, que cita
`/smile.glb` como exemplo.

### P2 — Dependências não utilizadas `[quick win]`
Sem importações em nenhum arquivo: `three`, `@react-three/fiber`,
`@types/three`. Além disso, **`@astrojs/react` não está registrado em
`astro.config.ts`** (não há `integrations`) e não existe nenhum componente
`.jsx/.tsx` — a dependência é inócua. `react`, `react-dom` e
`@phosphor-icons/react` são usados apenas em build-time (SSR do ícone do
GitHub no frontmatter) — manter; opcionalmente mover para
`devDependencies` (build estático, sem efeito em runtime).

**Ação:** remover `three`, `@react-three/fiber`, `@types/three` e
`@astrojs/react`; rodar `pnpm build` para confirmar.

### P3 — Retrato pesado e carregado ansiosamente
`baltz-portrait.jpg` tem 153 KB (JPEG progressivo 800×800), sem
`loading="lazy"` apesar de estar abaixo da dobra, e é baixado de novo como
textura WebGL (o cache resolve o segundo hit, mas o peso permanece).

**Ação:** converter para WebP (~40–60 KB esperado, mesma resolução) —
`texImage2D` aceita WebP sem mudança de código. Adicionar `loading="lazy"`
ao `<img>` de fallback. Executar junto com F2.

### P4 — Waterfall de inicialização do renderer
`unifiedRenderer.init()` espera `Promise.all(geometria + TODAS as texturas
líquidas)` antes do primeiro frame. O smile do hero fica bloqueado por
imagens abaixo da dobra (retrato e capa do Clouds).

**Ação:** com F4 (remoção da capa) resta uma textura só (retrato). Separar o
boot em dois contratos:

1. **Core:** contexto, programas, buffers e geometria do Smile; após o primeiro
   frame, marcar `data-renderer="ready"` e liberar o loader.
2. **Mídia:** carregar, decodificar e subir cada textura de forma assíncrona,
   com estado `loading` / `ready` / `error` no próprio slot. Falha do retrato
   preserva o `<img>` e não derruba o renderer inteiro.

Isso encurta o caminho crítico de F1 e evita que a semântica de `ready` mude
depois que o loader estiver implementado.

### P5 — Layout thrashing durante o scroll
Confirmado no código e no trace:

- `scrollBend.renderGroup` chama `getBoundingClientRect()` **por ponto, por
  frame** (centenas de chamadas nos títulos chroma durante scroll).
- O path de borda de `renderSurface` desenha num overlay SVG `position:
  fixed` usando coordenadas absolutas (`rect.left/top`) medidas no rAF —
  **esta é a causa direta da borda laranja "atrasada" do Caipora (F3)**: o
  overlay corre sempre ≥1 frame atrás do scroll. Já o `clip-path` do próprio
  bloco usa só `width/height` (relativos ao elemento) e **não** atrasa.
- `unifiedRenderer.updateRects()` refaz os rects de todas as superfícies a
  cada tick de scroll — barato com ≤3 superfícies, mas vale registrar.

**Ação concreta (além do F3, que elimina o overlay):** a posição horizontal
dos pontos do chroma não muda com scroll vertical. Separar medição e escrita:
cachear `normalizedX` por ponto e `width/height` por grupo/superfície em
`ScrollTrigger.refreshInit`, `ResizeObserver` e após `document.fonts.ready`;
durante scroll, usar só o cache. As leituras de refresh devem ser feitas em
lote, antes das escritas. Meta: nenhuma chamada de `getBoundingClientRect` no
subscriber contínuo de `scrollBend`; permanece apenas a medição da única
superfície WebGL onde o rect de viewport é necessário.

### P6 — Política de motion: sem `prefers-reduced-motion` (D5 — decidido)
Decisão do Baltz em 2026-07-17: o site **não** implementa e **não deve
implementar** `prefers-reduced-motion`. Motion pleno é parte central da
persona (minimal, dark, editorial, **kinetic**) — degradá-lo contradiz o
produto. Isso substitui conscientemente o precedente da iteração anterior
registrado no decision-log, que exigia suporte à preferência.

Estado verificado: hoje não existe **nenhuma** referência a reduced-motion
em `src/`, `scripts/`, configs ou CI — não há código a remover; a proibição
é normativa, para impedir reintrodução futura.

**Ação:**
1. Registrar a decisão como D-xxxx (status: substitui a decisão histórica)
   no `docs/decision-log.md`.
2. Documentar a proibição na seção *Performance and accessibility* do
   `AGENTS.md`, para que nenhum agente futuro reintroduza a preferência.
3. Nenhuma feature desta PRD deve conter branch de reduced motion.

Nota de transparência (não bloqueante): respeitar a preferência é critério
WCAG 2.3.3 de nível AAA — recomendação, não requisito. Os gates de CI
(Lighthouse/axe, §2) não testam reduced-motion, então a política não
conflita com o budget de acessibilidade = 1.00. Os fallbacks funcionais que
permanecem (sem WebGL, touch, noscript) são de capacidade, não de
preferência de motion.

### P7 — Observações sem ação (registrar e seguir)
- Bundle de 54 KB gzip é aceitável para o nível de motion; trocar GSAP por
  scroll nativo não compensa agora.
- `og.png` (330 KB) só é baixado por crawlers sociais.
- DPR do canvas travado em 1: escolha deliberada; retrato WebGL fica
  levemente soft em retina. Reavaliar somente se F2 expor o problema.

---

## 4. Mudanças de produto

### F1 — Loader de abertura (substitui o skeleton do smile)

**Hoje:** `.smile-poster` desenha um smile CSS no hero e some via
`html[data-renderer="ready"]`. O canvas inteiro já faz fade-in de 350 ms no
mesmo atributo.

**Requisitos:**
1. Remover o `.smile-poster` (markup + CSS).
2. Overlay full-screen presente no HTML inicial: tela vazia em tom claro,
   apenas `baltazarparra` centrado, Instrument Sans (preload já existe).
   Como todo CSS é inline no HTML, o overlay pinta no primeiro frame sem
   FOUC. Fundo no tom papel dos tokens (`rgb(243 240 233)`, o mesmo do
   antigo smile-poster) com o nome em `--color-canvas` (D1 — decidido).
3. Não bloquear o carregamento por trás: página, renderer e texturas seguem
   carregando sob o overlay (conteúdo continua pintando — o overlay não
   pode usar técnica que suprima o render por baixo).
   O loader é decorativo para a árvore de acessibilidade e, enquanto visível,
   só bloqueia o ponteiro como camada visual; não altera a semântica do `main`.
4. Dispensa quando `html[data-renderer]` assumir **qualquer** valor final —
   `ready` **ou** `fallback` (o caminho de WebGL indisponível/erro também
   libera o site).
5. Timeout de segurança **independente do bundle JS**: se o módulo nunca
   carregar, o overlay sai sozinho em ~2.5 s. Mecanismo recomendado:
   animação CSS pura com `animation-delay` (`forwards`, terminando em
   `visibility: hidden`), acelerada/cancelada quando `data-renderer` chega.
   Cobre também o cenário noscript sem markup extra.
6. Transição de saída: fade do overlay ~600 ms, easing suave; opcional
   fade-up curto do hero na entrada.
7. **Entrada tardia do smile:** se o overlay sair por timeout antes de
   `ready`, o smile aparece depois — deve entrar com fade (o fade de 350 ms
   do canvas já cobre; validar que nenhum caminho o pula).
8. Fonte: não bloquear o loader por fonte (`font-display: optional` já
   garante); manter stack de fallback visualmente próxima.

**Dependência técnica:** implementar depois do lifecycle assíncrono de P4. O
loader consome `data-renderer`; ele não deve ser responsável por inferir se a
textura do retrato terminou.

**Critérios de aceite:** CLS 0.00; budgets §2 verdes; nenhuma rota (ready,
fallback, timeout, noscript) deixa o overlay preso; transição discreta,
sem flash duro de luminância na revelação do site escuro.

### F2 — Retrato: fade gradual + efeito líquido estilo 14islands

**Hoje (conferido no código):**
- O `<img>` some em 200 ms quando o renderer assume; o canvas faz fade-in
  em 350 ms — a troca ainda lê como abrupta.
- Ao rolar, a superfície WebGL é recortada por scissor/`rectIsVisible` —
  aparece/some **sem nenhum fade** ao cruzar a borda do viewport (a causa
  principal do "pop" reportado).
- O modo `portrait` ignora `pointermove` (`moveMedia` retorna cedo) e o
  shader só aplica a lente líquida no branch **não**-portrait: hoje o
  retrato reage apenas ao impacto de borda no enter/leave.

**Requisitos:**
1. Aparição/desaparecimento sempre gradual (scroll e init): crossfade
   `<img>` ↔ superfície WebGL ~500–700 ms. Como o canvas é único e
   compartilhado, o fade por superfície deve ser **in-shader**: uniform de
   reveal por superfície (`uReveal` 0→1 easado no JS), com blend habilitado
   nesse draw. O `<img>` permanece alinhado sob o canvas; não deve mais ser
   escondido globalmente por `data-liquid="active"`. O reveal combina estado
   da textura e proximidade da borda do viewport, para o scissor nunca cortar
   uma superfície já opaca.
2. Hover replicando os cards do 14islands:
   - **Enter:** ondulação líquida a partir do ponto de entrada (o impacto
     de borda atual já dá a base).
   - **Move:** distorção líquida contínua seguindo o cursor — habilitar o
     pipeline de hover (`updateMediaPointer`) para `portrait` e unificar os
     branches do shader (lente/onda do modo cover + refração do modo
     portrait compostas, ou lente só; decidir pelo resultado visual).
   - **Leave:** mesmo efeito do enter a partir do ponto de saída, decaindo.
3. Touch/mobile: sem hover; mantém o comportamento scroll-reativo atual
   (refração sutil), agora com o fade do item 1.
4. Fallback: WebGL indisponível ou falha do núcleo usa `<img>` estático com
   crossfade CSS de entrada; falha apenas da textura marca o slot como `error`,
   mantém o `<img>` e não remove o Smile.
5. Servir o retrato em WebP + `loading="lazy"` (P3) nesta entrega.
6. **Preservar a API de métricas** (`window.__unifiedRendererMetrics`) —
   `measure-runtime.mjs` e `verify-browser.mjs` a consomem.

**Critérios de aceite:** nenhum pop-in do retrato em qualquer ponto/direção
de scroll; hover fluido em desktop (sem long tasks novas); touch sem efeito
de hover; budgets §2 verdes.

### F3 — Caipora: remover borda laranja e eyebrow tags

**Hoje:** `.caipora-showcase` tem `border: 1px solid rgb(255 102 0 / 65%)` e
`data-scroll-surface="border"` — único elemento no modo `border` (conferido;
`project-primary` e `clouds-cover` usam `edge`, que tem `borderWidth: 0` e
nunca desenha path). O overlay SVG fixo da borda é o artefato que "atrasa" e
escapa do bloco. O `.caipora-eyebrow` renderiza as tags "Original game" /
"Play in browser".

**Requisitos:**
1. Remover a `border` laranja do CSS. Manter background, scanlines e
   box-shadow — a identidade do bloco permanece.
2. Warp de scroll do bloco (D2 — decidido): trocar
   `data-scroll-surface="border"` por `"edge"` — mantém a ondulação do
   card, que não atrasa por ser element-relative, coerente com o card de
   Selected Work.
3. Remover `.caipora-eyebrow`: markup em `index.astro`, CSS (incluindo o
   bloco mobile) e o campo `eyebrow` de `src/data/site.ts`. Revisar o ritmo
   vertical do copy (o `h2` passa a abrir o bloco).
4. Limpeza no `scrollBend.js`: sem superfícies `border`, **deletar** o
   branch de path de borda, a criação do overlay `scroll-surface-overlay` e
   o CSS associado. Ganho direto do P5.
5. Atualizar `verify-browser.mjs`: o loop de superfícies
   (`["project", "caipora", "clouds"]`) e asserts relacionados precisam
   refletir o novo estado, sem depender do índice de paths do overlay.

**Critérios de aceite:** nenhum artefato fora do bloco em qualquer
velocidade de scroll; bloco coeso sem a borda; `verify:browser` verde.

### F4 — Clouds: mover para depois de Elsewhere e reduzir ao embed

**Hoje:** ordem `… → caipora → clouds → elsewhere`; o Clouds tem heading
"Producing...", embed do Spotify, link "Open in Spotify ↗" e a capa com
efeito líquido (`clouds-cover`, slot WebGL + `clouds-cover.jpg`).

**Requisitos:**
1. Mover a seção Clouds para **depois** de Elsewhere (última seção antes do
   footer).
2. Conteúdo reduzido a heading + embed do Spotify. Remover o anchor
   `clouds-cover` (imagem, label, slot líquido) e o link "Open in Spotify ↗"
   (o embed já dá acesso; pedido literal: "apenas o embed").
3. Heading: "Producing..." → **"my lofi ep"**, grafia literal (D4 —
   decidido). Atualizar os segmentos chroma em `index.astro` mantendo o
   padrão de reveal dos demais títulos.
4. Limpeza de dados e assets: deletar `public/clouds-cover.jpg`; em
   `site.ts`, `clouds` fica só com `embedUrl` (remover `coverUrl` e `url` —
   o link do álbum continua existindo no profile Spotify de Elsewhere).
5. Layout: seção vira coluna única alinhada à grade; revisar os breakpoints
   que citam `.clouds-copy`/`.clouds-cover` e remover CSS morto.
6. Renderer: com um só `data-liquid-slot`, conferir `data-liquid="active"`
   e o init (P4) — uma textura a menos no caminho crítico.
7. Cursor trail (D3 — decidido): estender ao Clouds. Adicionar
   `data-end-zone` à seção Clouds mantendo o do Elsewhere (o código já
   suporta múltiplas zonas e trata o leave entre zonas contíguas),
   replicando o tratamento CSS das vars `--end-x`/`--end-y` para o efeito
   ler como um trecho final contínuo da página.
8. Atualizar `verify-browser.mjs` (checks de `.clouds-cover`, heading e
   cenário de asset-failure), `verify-cross-browser.mjs` (resiliência,
   contagem de links/foco) e a ordem de seções descrita no `AGENTS.md`.

**Critérios de aceite:** ordem `elsewhere → clouds → footer`; embed
permanece `loading="lazy"`; zero referências mortas a `clouds-cover` em
CSS/JS/dados/scripts; budgets §2 verdes.

---

## 5. Impacto em tooling e documentação (transversal)

Conferido — estes arquivos referenciam o que vamos mudar e **devem ser
atualizados na mesma fase da mudança**:

| Arquivo | Depende de | Fase |
| --- | --- | --- |
| `package.json`, `pnpm-lock.yaml` | dependências removidas | 0 |
| `src/pages/index.astro`, `src/data/site.ts` | markup, ordem, dados e assets de F1–F4 | 1, 2, 4, 6 |
| `src/styles/global.css`, `src/styles/home-rework.css` | `.smile-poster`, Clouds, eyebrow, overlay e fallbacks de mídia | 1, 2, 4, 6 |
| `src/lib/motion/scrollBend.js` | overlay, paths de borda e cache de geometria | 1, 3 |
| `src/lib/visual/unifiedRenderer.js` | boot, mídia assíncrona, `uReveal`, hover e métricas | 4, 5 |
| `scripts/verify-browser.mjs` | `.smile-poster`, `.clouds-cover`, superfícies, heading e falhas de asset | 1, 2, 3, 4, 6 |
| `scripts/verify-cross-browser.mjs` | capa removida, resiliência e contagem de links/foco | 2, 7 |
| `scripts/measure-runtime.mjs` | `window.__unifiedRendererMetrics` (API compatível) | 4, 5, 7 |
| `AGENTS.md` | ordem das seções, assets, lifecycle do renderer e política D5 | 0, 2, 4 |
| `docs/decision-log.md` | loader, Caipora, Clouds e política D5 que substitui parte de D-0025 | fases correspondentes |

## 6. Plano de execução

O plano operacional completo, incluindo contratos de estado, arquivos,
rollback boundaries e matriz de testes, está em
[`docs/plano-implementacao-refinamento-2026-07.md`](./plano-implementacao-refinamento-2026-07.md).

A ordem reduz primeiro a superfície do problema e só conecta o loader quando
o lifecycle do renderer já estiver estável:

| Fase | Escopo | Itens |
| --- | --- | --- |
| 0 | Baseline, assets/deps mortos e guardrails de documentação | P1, P2, P6 |
| 1 | Caipora + remoção do overlay de borda | F3, parte do P5 |
| 2 | Clouds como epílogo + redução para uma superfície líquida | F4, parte do P4 |
| 3 | Cache de geometria no scroll | P5 restante |
| 4 | Boot assíncrono, WebP e reveal do retrato | P3, P4, parte do F2 |
| 5 | Hover líquido enter/move/leave | F2 restante |
| 6 | Loader consumindo o lifecycle estabilizado | F1 |
| 7 | Consolidação e aceite final | — |

Cada fase termina com lint, check, build e o teste proporcional à mudança. Um
commit focado por fase mantém revisão e rollback isolados; nenhuma regressão é
carregada para a fase seguinte.

## 7. Validação final (fase 7)

- `pnpm launch:check` (lint + build + artifact) verde.
- `pnpm lighthouse:ci` e `pnpm lighthouse:desktop` — budgets §2 (3 runs).
- `pnpm verify:browser` e `pnpm runtime:measure` verdes com os checks
  atualizados.
- `scripts/verify-cross-browser.mjs` atualizado e executado com o runtime de QA;
  se o ambiente não o oferecer, registrar a lacuna sem alegar cobertura.
- Trace de performance: nenhuma leitura/forced layout repetida atribuível a
  `scrollBend`; CLS 0.00; frame p95 e long tasks sem regressão relevante.
- Cenários automatizados do loader: ready, fallback WebGL, geometria bloqueada,
  bundle bloqueado e JavaScript desabilitado.
- Checklist manual: loader em rede rápida/lenta/noscript; hover do retrato
  (enter/move/leave) e scroll em ambas as direções; scroll rápido no Caipora;
  end trail e ordem das seções.
- Buscas finais sem referências mortas a `smile.glb`, `caipora.jpeg`,
  `clouds-cover`, `caipora-eyebrow`, `scroll-surface-overlay` ou dependências
  removidas. A proibição de `reduced-motion` é conferida em `src/`, `scripts/`
  e configs; documentos históricos e protótipos não são reescritos.

## 8. Decisões tomadas (2026-07-17)

As cinco decisões D1–D5 foram resolvidas pelo Baltz. Agrupá-las em registros
coerentes no `docs/decision-log.md` na fase correspondente; D5 deve marcar
explicitamente a substituição do trecho incompatível de D-0025.

| # | Decisão | Resolução |
| --- | --- | --- |
| D1 | Tom do loader | Tom papel dos tokens (`rgb(243 240 233)`, o mesmo do antigo smile-poster) com o nome em `--color-canvas` — "tela branca" no espírito, sem flash duro de luminância na transição para o site escuro |
| D2 | Warp de scroll do bloco Caipora | Manter via modo `edge` — preserva a identidade cinética, mesmo comportamento do card Selected Work; o artefato reportado era só a borda |
| D3 | Cursor trail de fim de página | Estender ao Clouds (nova última seção), mantendo o do Elsewhere — o efeito lê como um fim de página contínuo |
| D4 | Grafia do heading do Clouds | Literal `my lofi ep` — revisitar apenas se destoar visualmente |
| D5 | `prefers-reduced-motion` | **Não implementar e proibir**: motion pleno é parte central da persona do site. Nenhuma feature ganha branch de reduced motion; a proibição vai para o `AGENTS.md` e substitui o precedente da iteração anterior no decision-log. Fallbacks de capacidade (sem WebGL, touch, noscript) permanecem |

## 9. Fora de escopo

- Troca do GSAP por scroll nativo (P7).
- Aumento de DPR do canvas (P7).
- Qualquer mudança de conteúdo/copy além das descritas.
- Deploy: publicação segue o fluxo próprio (`docs/launch-checklist.md` /
  `docs/rollback-plan.md`); esta PRD termina no artefato validado local.
