# Plano de implementação — refinamento visual e performance (julho/2026)

> **Status:** pronto para execução
> **PRD de origem:** [`docs/prd-refinamento-2026-07.md`](./prd-refinamento-2026-07.md)
> **Estratégia:** simplificar a página antes de ampliar motion; estabilizar os
> contratos do renderer antes de ligar o loader a eles; manter cada fase
> pequena, verificável e reversível.

## 1. Resultado esperado

Executar P1–P6 e F1–F4 sem reescrever a stack Astro existente e sem regredir
os budgets de performance, acessibilidade, boas práticas e SEO. Ao final:

- o deploy não contém dependências ou assets mortos;
- Caipora mantém o warp, sem borda atrasada ou eyebrow;
- Elsewhere, Clouds e Footer formam o trecho final da página nessa ordem;
- o renderer mostra o Smile assim que seu núcleo está pronto, sem aguardar o
  retrato;
- o retrato entra e sai sem pop, responde ao ponteiro em desktop e preserva o
  comportamento scroll-reativo no touch;
- o loader sempre libera a página por `ready`, `fallback` ou timeout CSS;
- `scrollBend` não faz leituras de layout no callback contínuo de scroll;
- a API `window.__unifiedRendererMetrics` e os fallbacks de capacidade
  continuam funcionais.

## 2. Contratos que orientam a implementação

### 2.1 Estados do renderer

O trabalho deve primeiro tornar explícita esta máquina de estados:

| Estado | Significado | Consequência visual |
| --- | --- | --- |
| sem `data-renderer` | boot ainda não terminou | loader aguarda; página carrega por baixo |
| `data-renderer="ready"` | contexto, programas e geometria do Smile produziram o primeiro frame | loader pode sair, mesmo que o retrato ainda esteja carregando |
| `data-renderer="fallback"` | WebGL ou o núcleo do Smile falhou | loader sai; HTML/CSS e imagem estática permanecem |

Falha isolada da textura do retrato não deve rebaixar o renderer inteiro para
`fallback`. Cada `[data-liquid-slot]` deve ter estado próprio — `loading`,
`ready` ou `error` — e conservar seu `<img>` como underlay/fallback.
`data-liquid="active"` só indica que existe ao menos uma superfície GPU pronta;
não deve mais ser usado para esconder globalmente as imagens HTML.

### 2.2 Reveal do retrato

O canvas é único, então o takeover da imagem precisa acontecer no shader:

- manter o `<img>` visível por baixo do canvas;
- adicionar `uReveal` ao programa de mídia;
- desenhar a superfície com blend e alpha derivado de `uReveal`;
- combinar o progresso de upload da textura com a proximidade da superfície
  à borda do viewport, evitando troca abrupta no scissor;
- iniciar em `0`, chegar a `1` com easing em 500–700 ms e voltar de forma
  simétrica quando a superfície deixa o viewport;
- em `error` ou `fallback`, deixar o `<img>` assumir sem buraco visual.

Esse contrato resolve init e scroll com o mesmo mecanismo, em vez de somar
fades CSS e WebGL independentes.

### 2.3 Cache de geometria do scroll

`scrollBend` deve separar medição e render:

1. resetar transforms temporariamente;
2. medir grupos, pontos e superfícies em lote;
3. armazenar `normalizedX` por ponto e `width`/`height` por superfície;
4. durante scroll, escrever apenas `translate`, `rotate`, paths e `clip-path`;
5. invalidar o cache em `ScrollTrigger.refreshInit`, `ResizeObserver` e após
   `document.fonts.ready`.

O renderer WebGL pode continuar atualizando o rect da única superfície líquida
durante scroll; a meta desta rodada é eliminar as centenas de medições dos
títulos e as medições de superfícies puramente CSS.

### 2.4 Invariantes

- Não adicionar framework, runtime de animação ou segundo canvas.
- Não remover nem renomear chaves existentes de
  `window.__unifiedRendererMetrics`; métricas novas podem ser aditivas.
- Interação de hover continua protegida por
  `(hover: hover) and (pointer: fine)`.
- Touch não sintetiza hover e mantém a refração ligada ao scroll.
- Não criar branch de `prefers-reduced-motion`, conforme D5; fallbacks de
  WebGL, touch, erro de asset e JavaScript ausente continuam obrigatórios.
- Não editar `dist/`; todo artefato vem de `pnpm build`.

## 3. Sequência de execução

| Fase | Entrega | Dependência | Gate principal |
| --- | --- | --- | --- |
| 0 | baseline, higiene e guardrails | — | build e artifact check |
| 1 | Caipora simplificado | 0 | browser: warp sem overlay |
| 2 | Clouds reduzido e reordenado | 1 | browser: ordem, embed e end trail |
| 3 | cache e limpeza do scroll path | 2 | trace sem layout reads de `scrollBend` |
| 4 | lifecycle assíncrono e retrato WebP | 3 | fallback + reveal sem pop |
| 5 | hover líquido do retrato | 4 | enter/move/leave + runtime |
| 6 | loader sobre contrato estável | 4 | ready/fallback/timeout/noscript |
| 7 | consolidação e aceite final | 5 e 6 | todos os gates da PRD |

As fases 5 e 6 partem do mesmo lifecycle estabilizado na fase 4 e podem ser
revisadas separadamente, mas o aceite final só acontece com ambas integradas.

## 4. Fases detalhadas

### Fase 0 — Baseline, higiene e guardrails

**Objetivo:** reduzir ruído antes das mudanças visuais e guardar uma referência
comparável.

**Alterações:**

1. Registrar o estado inicial com `pnpm launch:check`, Lighthouse mobile e
   desktop, `pnpm runtime:measure` e screenshots de Hero, retrato, Caipora e
   Clouds.
2. Remover `public/smile.glb` e `public/caipora.jpeg`.
3. Remover `three`, `@react-three/fiber`, `@types/three` e `@astrojs/react` de
   `package.json`, atualizando `pnpm-lock.yaml` via pnpm.
4. Atualizar `AGENTS.md`: assets reais, futura ordem de seções e política D5.
   A ordem só deve ser alterada quando a fase 2 aterrissar.
5. Registrar D5 em `docs/decision-log.md` como substituição do trecho de
   motion de D-0025. Manter `docs/baseline.md` intacto como registro histórico.

**Aceite da fase:**

- nenhum import removido é usado em `src/`, `scripts/` ou configs;
- `pnpm install --lockfile-only` não deixa o lock inconsistente;
- `pnpm launch:check` verde;
- `dist/` não contém os dois assets removidos.

**Boundary de rollback:** commit apenas de higiene e documentação, sem mudança
visual intencional.

### Fase 1 — Caipora sem borda atrasada

**Objetivo:** eliminar o artefato e o caminho de render que só existia para
ele, preservando a energia do bloco.

**Alterações:**

1. Trocar Caipora de `data-scroll-surface="border"` para `"edge"`.
2. Remover border, eyebrow, campo de dados e regras responsivas associadas.
3. Reequilibrar o espaço entre `h2`, kicker, descrição, features e CTA; o `h2`
   passa a ser a primeira âncora visual do copy.
4. Em `scrollBend.js`, remover overlay SVG, path por superfície, leitura de
   border e branch de desenho absoluto. Preservar ribs e `clip-path` relativo.
5. Em `home-rework.css`, remover `.scroll-surface-overlay` e o seletor exclusivo
   do modo `border`.
6. Atualizar `verify-browser.mjs` para validar superfícies por classe ativa e
   `clipPath`, sem depender do índice de paths do overlay.
7. Atualizar a decisão de Caipora no decision log.

**Aceite da fase:**

- nenhum `.scroll-surface-overlay` existe no DOM;
- scroll rápido nos dois sentidos não deixa traço fora do bloco;
- Caipora ainda recebe `clip-path` enquanto o impulso está ativo e o remove ao
  estabilizar;
- screenshots desktop, 390 px e 320 px não mostram overflow ou quebra de
  ritmo;
- `pnpm lint`, `pnpm check`, `pnpm build` e browser checks verdes.

### Fase 2 — Clouds como epílogo

**Objetivo:** reduzir Clouds ao gesto editorial pedido e formar um encerramento
contínuo com Elsewhere.

**Alterações:**

1. Mover Clouds depois de Elsewhere e antes do Footer.
2. Manter apenas heading `my lofi ep` e iframe; remover capa, link redundante,
   slot líquido e superfície de scroll.
3. Reduzir `site.clouds` a `embedUrl` e remover `public/clouds-cover.jpg`.
4. Trocar a composição chroma do heading sem alterar `ChromaText`.
5. Limpar regras de `.clouds-cover` e layout de duas colunas em
   `global.css` e `home-rework.css`; construir uma coluna única alinhada à
   grade existente.
6. Adicionar `data-end-zone` a Clouds e validar que a transição Elsewhere →
   Clouds não dispara um leave intermediário perceptível.
7. Atualizar `verify-browser.mjs` e `verify-cross-browser.mjs`: ordem das
   seções, heading, iframe lazy, ausência de capa e contagem de links/foco.
8. Atualizar ordem e assets em `AGENTS.md` e registrar D3/D4 no decision log.

**Aceite da fase:**

- a ordem DOM é `#elsewhere`, `#clouds`, `footer`;
- `#clouds-title` lê exatamente `my lofi ep`;
- o iframe mantém `loading="lazy"`, título e política de referrer;
- `rg` não encontra `clouds-cover`, `coverUrl` ou o link removido em código de
  produção, dados e scripts de verificação;
- métricas do renderer reportam uma superfície líquida;
- teclado e end trail funcionam no novo fim de página.

### Fase 3 — Scroll sem layout thrashing

**Objetivo:** remover medições repetidas do caminho contínuo de scroll depois
que a lista final de superfícies estiver estável.

**Alterações:**

1. Criar uma etapa única de `measureLayout()` em `scrollBend.js`.
2. Armazenar `normalizedX` e `halfWidth` nos grupos; armazenar dimensões nas
   superfícies; gerar `surfacePoints` a partir do cache.
3. Invalidar em refresh, resize, mudança observada de layout e conclusão de
   fontes; fazer leituras em lote antes de qualquer escrita.
4. Preservar a limpeza de styles quando grupos saem do viewport ou o impulso
   volta a idle.
5. Ajustar `verify-browser.mjs` para exercitar refresh/resize antes e depois do
   scroll, prevenindo cache obsoleto.

**Aceite da fase:**

- não há `getBoundingClientRect()` em `renderGroup`, `renderSurface` ou no
  subscriber contínuo de `scrollBend`;
- headings continuam arqueando corretamente após resize e em 320/390/1440 px;
- trace não mostra forced layout repetido atribuível a `scrollBend`;
- o frame p95 não piora em relação ao baseline além da variância de uma frame.

### Fase 4 — Lifecycle assíncrono e retrato WebP

**Objetivo:** desacoplar o Smile da mídia abaixo da dobra e criar um takeover
progressivo, resiliente a falha de textura.

**Alterações:**

1. Converter `baltz-portrait.jpg` para WebP em 800 × 800, comparar visualmente
   e apontar `src`/`data-liquid-source` para o novo asset; adicionar
   `loading="lazy"` ao `<img>`.
2. Inicializar contexto, programas, buffers e geometria sem aguardar imagens.
3. Produzir o primeiro frame e definir `data-renderer="ready"`; iniciar upload
   das superfícies de forma assíncrona e independente.
4. Implementar `data-media-state` por superfície. Erro de imagem mantém o
   fallback HTML e registra o estado, sem derrubar Smile ou campo visual.
5. Adicionar `uReveal`, blend e easing; deixar o `<img>` sob o canvas em vez de
   escondê-lo por `data-liquid="active"`.
6. Fazer entrada/saída no viewport modular o reveal antes que o scissor corte
   uma superfície opaca.
7. Preservar todas as chaves existentes de `window.__unifiedRendererMetrics` e
   tornar `surfaces` coerente com uma única superfície.
8. Atualizar o cenário de falha de asset em `verify-browser.mjs` para bloquear
   o retrato WebP, não a capa removida.

**Aceite da fase:**

- bloquear o retrato não bloqueia `data-renderer="ready"` nem o Smile;
- bloquear a geometria resulta em `fallback` e imagem estática utilizável;
- nenhuma direção de scroll produz troca opaca abrupta na borda do viewport;
- o asset WebP é menor que o JPEG de origem sem degradação perceptível no
  tamanho de render;
- CLS permanece 0.00 e a API de métricas continua consumível pelos scripts.

### Fase 5 — Hover líquido do retrato

**Objetivo:** compor a refração existente com uma resposta contínua ao cursor,
sem duplicar shader ou estado.

**Alterações:**

1. Permitir `updateMediaPointer` no modo portrait.
2. Unificar a lente/onda de hover com o branch de refração do retrato no mesmo
   fragment shader.
3. Preservar impacto localizado no enter/leave e fazer o move atualizar ponto,
   velocidade e hover target.
4. Ajustar amplitude, decaimento e frequência com a regra: o rosto continua
   legível em repouso e em movimento; o efeito nunca vira ruído constante.
5. Garantir que software renderer e ponteiro não-fino não executem o pipeline
   de hover.

**Aceite da fase:**

- enter nasce no ponto de entrada; move acompanha o cursor; leave nasce no
  ponto de saída e decai;
- touch altera o retrato apenas por scroll;
- não há nova long task, alocação por frame ou segundo programa de mídia;
- `pnpm runtime:measure` mantém frame p95 e long tasks dentro do baseline e dos
  budgets da PRD.

### Fase 6 — Loader de abertura

**Objetivo:** substituir o smile-poster por uma abertura editorial que nunca
aprisiona a navegação.

**Alterações:**

1. Inserir o overlay no HTML inicial e remover markup/CSS de `.smile-poster`.
2. Usar o tom papel, `baltazarparra` centralizado e Instrument Sans com fallback
   próximo. Marcar o overlay como decorativo para a árvore de acessibilidade.
3. Manter o overlay como camada visual; não impedir parsing, paint, fetches ou
   inicialização do renderer abaixo dele.
4. Definir uma animação CSS de saída com 600 ms e delay de segurança de cerca
   de 2,5 s. Seletores para `ready` e `fallback` removem o delay; o keyframe
   termina em `visibility: hidden` e sem interceptar ponteiro.
5. Preservar o fade tardio do canvas caso o timeout vença antes do Smile.
6. Atualizar os testes para cinco rotas: ready rápido, WebGL indisponível,
   geometria bloqueada, bundle JS bloqueado e JavaScript desabilitado.
7. Registrar D1 no decision log.

**Aceite da fase:**

- nenhum cenário mantém o overlay visível além do timeout + duração do fade;
- o conteúdo já existe e pinta sob o overlay;
- não há flash duro de papel para canvas, foco invisível preso ou mudança de
  layout;
- o Smile que chega depois do timeout ainda entra com fade.

### Fase 7 — Consolidação e aceite final

**Objetivo:** fechar requisitos, documentação e evidência como uma única
entrega candidata a publicação.

**Alterações:**

1. Remover seletores, campos e referências mortas com buscas direcionadas.
2. Confirmar os registros de decisão e a descrição arquitetural de `AGENTS.md`.
3. Executar a matriz automatizada e manual da seção 5.
4. Comparar payload, frame p95, long tasks, LCP, CLS e screenshots com o
   baseline da fase 0.
5. Gerar o artefato final local, sem deploy.

**Aceite da fase:** todos os critérios da PRD rastreados para uma evidência ou
um teste manual registrado; nenhuma pendência escondida em “validar depois”.

## 5. Matriz de verificação

### 5.1 Gates por tipo de mudança

| Mudança | Estático | Browser | Runtime | Lighthouse |
| --- | --- | --- | --- | --- |
| deps/assets/docs | lint, check, build, artifact | smoke | — | ao fechar fase 0 |
| Caipora/Clouds/layout | lint, check, build | desktop + 390 + 320 + teclado | — | se LCP/CLS mudar |
| scrollBend | lint, check, build | scroll, resize, refresh | trace + frame p95 | final |
| renderer/retrato | lint, check, build | ready/error/touch/hover | obrigatório | mobile + desktop |
| loader | lint, check, build | cinco rotas de saída | startup trace | mobile + desktop |

### 5.2 Comandos finais

1. `pnpm launch:check`
2. Iniciar `pnpm preview` em um terminal.
3. `pnpm verify:browser http://127.0.0.1:4100/ docs/evidence/refinamento-2026-07/browser`
4. `pnpm runtime:measure http://127.0.0.1:4100/ docs/evidence/refinamento-2026-07/runtime`
5. `pnpm lighthouse:ci`
6. `pnpm lighthouse:desktop`
7. Executar `scripts/verify-cross-browser.mjs` com o
   `PLAYWRIGHT_MODULE` do ambiente de QA; se o runtime não estiver disponível,
   registrar explicitamente a lacuna em vez de declarar compatibilidade.
8. `git diff --check`

### 5.3 Checklist manual

- loader em rede rápida, Slow 3G, JS bloqueado, WebGL bloqueado e noscript;
- retrato ao entrar/sair pelo topo e pelo fundo, em scroll lento e rápido;
- hover do retrato em enter/move/leave e touch sem hover preso;
- Caipora em scroll rápido nos dois sentidos;
- Elsewhere → Clouds → Footer e continuidade do end trail;
- foco visível, skip link, iframe nomeado, links externos e 320 px sem overflow;
- comparação visual do JPEG e WebP no tamanho real de render.

## 6. Rastreabilidade

| Requisito | Fase |
| --- | --- |
| P1, P2, P6 | 0 |
| F3 e overlay de P5 | 1 |
| F4 e redução do caminho de P4 | 2 |
| cache restante de P5 | 3 |
| P3, P4 e reveal de F2 | 4 |
| hover de F2 | 5 |
| F1 | 6 |
| budgets e aceite conjunto | 7 |

## 7. Riscos e contenção

| Risco | Contenção |
| --- | --- |
| Loader liberar antes de existir conteúdo visual | `ready` somente após o primeiro frame do núcleo; canvas mantém fade tardio |
| Falha de textura derrubar todo o canvas | estado e tratamento de erro por superfície |
| Alpha do retrato revelar halo ou dupla exposição | `<img>` alinhado ao mesmo rect, premultiplied alpha e teste sobre fundo real |
| Cache ficar obsoleto após fonte/resize | invalidação explícita e teste de refresh em três larguras |
| End trail piscar entre zonas contíguas | testar transição entre zonas e adiar leave enquanto o ponteiro entra na zona vizinha |
| Política D5 ser interpretada como conformidade ampla | documentar que é decisão de produto, fora de WCAG 2.3.3 AAA, sem alegar suporte à preferência |

Cada fase deve terminar em um commit focado. Se um gate falhar, corrigir dentro
da fase; não avançar acumulando regressões para a validação final.
