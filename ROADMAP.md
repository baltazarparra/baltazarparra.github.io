# ROADMAP — baltz.dev: one-page submission-ready

> Status: the Astro implementation was promoted to the repository root. This
> roadmap retains its earlier planning language as project history; `v2/` is no
> longer an active or deployable codebase.

> **Status:** revisado e validado em 15 jul. 2026 contra o repositório atual e
> fontes oficiais. O objetivo controlável é construir uma experiência com barra
> compatível com SOTD/Developer Award; a concessão de qualquer prêmio depende do
> júri e não pode ser tratada como critério contratual de sucesso.

> **Para o agente executor (Codex):** este documento define o
> resultado esperado, as restrições e a barra de conclusão de cada fase — o
> caminho é seu. Cada fase tem um **Gate** (evidência exigida para avançar) e
> **Perguntas** (decisões que pertencem ao Baltz — quando bloquear, pergunte
> apenas o menor item em aberto; não expanda escopo sem confirmação).
> Trabalhe uma fase por vez, na ordem. Nunca marque um gate como cumprido sem
> a evidência pedida.

---

## Missão

Construir a v2 do site pessoal de Baltazar Parra ("baltz") em uma codebase
isolada, sem alterar a produção atual até o launch, e entregar uma **one-page**
com o mesmo escopo de conteúdo do site atual (https://www.baltz.dev/), preparada
para submissão ao **Awwwards Site of the Day** e, se obtiver SOTD, ao
**Developer Award**.

A fundação da v2 começa limpa, mas isso não obriga a descartar trabalho bom:
assets e módulos existentes só entram depois de auditados, aprovados e portados
de forma explícita. A decisão entre novo repositório, branch órfã ou diretório
isolado é um gate da Fase 4; nenhuma opção pode apagar ou reescrever o histórico
do site atual.

O diferencial não é técnica nova: é passar pelos passos de planejamento dos
grandes estúdios (conceito → direção de arte → motion concept → protótipo →
produção → polish), que o site atual nunca recebeu.

## Estratégia central: síntese comprovada

Vamos analisar projetos premiados, estudos de caso, padrões da web e técnicas
documentadas para sintetizar uma solução própria. Referências validam princípios
e mecanismos; não autorizam copiar identidade visual, composição distintiva,
assets, código ou narrativa de terceiros.

Regra operacional para o executor: decisões relevantes entram em um **decision
log** com hipótese, evidência, alternativa rejeitada e forma de validação. A
evidência adequada depende da decisão:

1. objetivo, público e conteúdo autoral para conceito e narrativa;
2. WCAG, Web Vitals e documentação oficial para acessibilidade/performance;
3. premiados e case studies para direção de arte e motion;
4. protótipos e medições do próprio projeto para escolhas técnicas.

Quando existir tutorial de implementação, registrar o link e a licença. Uma
referência premiada é evidência de repertório, não prova automática de que a
solução funciona para este público, conteúdo ou device.

A identidade não depende de novidade técnica — vem de três coisas que já são
nossas:
1. **O conteúdo** (trajetória, jogo Caipora, EP Clouds, posts) — nenhum
   concorrente tem esse material.
2. **A síntese** de padrões comprovados escolhida na direção de arte.
3. **A execução** — easing, timing e performance impecáveis ("easing e timing
   precisos valem mais que efeitos elaborados" — consenso dos making-ofs).

## Escopo fixo: a one-page

Inventário de conteúdo (o mesmo do site atual — migrar e melhorar a copy, não
expandir):

| Seção | Conteúdo atual |
|---|---|
| Hero | "baltz" + avatar + subtítulo (Thoughtworks) + assinatura 3D (smile) |
| About | Bio curta |
| Writing | 2 posts (dev.to, AI/workflow) |
| Projects | 3 projetos com links |
| Caipora | Vitrine do jogo autoral (roguelike folk horror BR) |
| Connect | Links de contato/redes |
| Clouds | Vitrine do EP autoral (embed Spotify) |
| Footer | Mínimo |

Fora de escopo: múltiplas rotas, case studies longos, CMS, blog próprio.
(Único extra permitido: um 404 com personalidade, porque o júri visita.)

## Contexto — o que a pesquisa sustenta (jul/2026)

Síntese de 4 frentes — 14islands (processo), Codrops (técnicas), Awwwards
(julgamento), auditoria do baltz.dev. O artifact externo abaixo não é uma fonte
durável nem auditável sem autenticação; a Fase 0 deve importar para o repositório
as referências e notas que forem realmente usadas:
https://claude.ai/code/artifact/afe03f5c-45f8-41fb-a84d-0db0a95b28cb

1. **Awwwards julga:** Design 40% · Usabilidade 30% · Criatividade 20% ·
   Conteúdo 10%. O sistema oficial envia cada indicado a pelo menos 18 jurados;
   só vencedores de SOTD seguem para o júri de Developer Award e precisam de
   nota técnica superior a 7. A alegação anterior de que “~75% dos SOTDs” levam
   Developer Award foi removida por não ter fonte oficial reproduzível.
2. **14islands:** motion concept **antes** do design detalhado; easings como
   design tokens; creative developer presente desde a concepção.
3. **Making-ofs premiados:** conceito → moodboard → protótipo de motion →
   mecânica antes de acabamento → performance como requisito → polish nas
   "costuras" (loader, transições, cursor, 404).
4. **Auditoria do baltz.dev:** a base atual demonstra engenharia cuidadosa
   (shader de fogo, quality tiers, rAF, reduced-motion e pausa de trabalho
   offscreen). “Nível award” ainda é hipótese: só pode ser afirmado depois dos
   gates de performance, acessibilidade, browsers e devices da Fase 7.

### Fontes oficiais da validação

- [Awwwards — Evaluation System](https://www.awwwards.com/about-evaluation/)
- [Awwwards — Developer Award Guidelines](https://docs.google.com/document/d/1Gvmg6Z60UQ-4BOM3XyUcBKvq2shd4J-l_MoXT26JFEg/edit)
- [GSAP — Installation](https://gsap.com/docs/v3/Installation/)
- [GSAP — SplitText](https://gsap.com/docs/v3/Plugins/SplitText/)
- [Chrome DevTools — Performance reference](https://developer.chrome.com/docs/devtools/performance/reference)
- [web.dev — Core Web Vitals thresholds](https://web.dev/articles/defining-core-web-vitals-thresholds)
- [W3C — WCAG 2.2](https://www.w3.org/TR/WCAG22/)

## Decisões já tomadas (não relitigar)

| Área | Decisão |
|---|---|
| Formato | One-page + 404 |
| Conteúdo | O do site atual, copy melhorada, zero placeholder |
| Estratégia criativa | Síntese comprovada; sem cópia de soluções distintivas |
| Idioma do site | Inglês (corrigindo o `lang="pt-BR"` atual) |
| Assets elegíveis para reuso | smile.glb, shaders (fogo/partículas/TV noise), quality tiers, cursor-brasa, sprite Caipora, EP Clouds — reusar é opção, não obrigação; decide-se nas fases 2–4 |
| Stack | Astro estático + TypeScript; HTML/Astro para conteúdo, React/R3F só em ilhas, GSAP sobre scroll nativo; implementação na raiz do repositório |

## Autonomia do executor

**Pode sem perguntar:** ler/criar/editar código e rascunhos dentro da codebase
de trabalho aprovada, rodar builds/lints/audits/medições, criar protótipos
descartáveis e instalar dependências dentro da stack aprovada na Fase 4.

**Precisa de confirmação do Baltz:** escolha de conceito, direção de arte,
modelo de isolamento da v2 e stack (fases 1, 2 e 4 são co-criação); qualquer
preview/deploy externo; deploy de produção; submissões e publicação externa;
compras (fontes, domínio, serviços); alterações no site atual (ele fica no ar,
intocado, até o launch da v2).

---

## Fase 0 — Catálogo de padrões comprovados

**Resultado:** `docs/padroes.md` + `docs/decision-log.md` — biblioteca de
referências e registro das decisões relevantes.

Para **cada seção da one-page** (hero, about, writing, projects, showcase de
jogo/música, connect, footer) e para **cada costura** (loader, scroll,
transições internas, cursor, 404), catalogar 2–3 soluções premiadas:

- Fonte: SOTDs recentes de portfólio (Julien Calot, MONOLOG, Pacôme Pertant,
  Bruno Simon, Elliott Mangham, Adcker), case studies do Codrops (Vitasović,
  Gradogna, "Sketching the Impossible"), cases da 14islands, Webzibition.
- Para cada padrão registrar: onde foi usado (link), princípio que demonstra,
  onde poderia servir ao nosso conteúdo, riscos de cópia/clichê, custo provável
  de performance/acessibilidade e tutorial/licença quando existir.
- Registrar também 5 clichês a evitar (ex.: o esqueleto "seções numeradas +
  títulos uppercase gigantes + cards", identificado na auditoria como o
  pattern genérico de portfólio ~2022 — que é exatamente o site atual).

**Gate:** `docs/padroes.md` cobre todas as seções e costuras da one-page; cada
padrão tem uma referência verificável e, quando aplicável, implementação e
licença. Nenhuma fonte essencial depende apenas de conteúdo autenticado ou
efêmero.

**Perguntas para o Baltz:**
- Dessas referências, quais mais parecem "você"? Quais rejeita de cara?

---

## Fase 1 — Conceito

**Resultado:** `docs/conceito.md` — brief aprovado + manifesto de uma página.

- Antes de criar candidatos, fechar público primário, sensação nos primeiros
  cinco segundos e lembrança no dia seguinte. A hierarquia narrativa entre
  fogo, smile, Caipora e Clouds é uma hipótese de direção que cada conceito
  deve propor e justificar, não uma pré-condição delegada ao briefing.

- Montar **3 conceitos candidatos**, usando princípios do catálogo da Fase 0 e
  hipóteses autorais explícitas, amarrados ao nosso material: fogo, smile,
  Caipora, Clouds, trajetória.
- Cada candidato responde, por escrito: como é o loader, como o scroll conta
  a história da página (a one-page tem UMA narrativa de scroll — ela é a
  "transição de página" do nosso formato), e como é o 404.
- Teste de aprovação: o conceito cabe em uma frase e decide sozinho essas
  costuras. Se não decide, é moodboard — refinar ou descartar.

**Gate:** brief respondido; Baltz escolheu (ou remixou) um candidato; manifesto
aprovado explicitamente.

**Perguntas para o Baltz:**
- Público primário: recrutadores/empresas, estúdios criativos ou clientes?
- O que a pessoa deve sentir em 5 segundos e lembrar no dia seguinte?
- Qual conceito resolve melhor, por meio da própria direção, o papel de fogo,
  smile, Caipora e Clouds?

---

## Fase 2 — Direção de arte

**Resultado:** `docs/direcao-de-arte.md` + primeira versão da copy + frames
estáticos desktop/mobile das telas-chave (hero, conteúdo, showcase,
connect/footer e 404).

- Tipografia com personalidade, tratada como imagem (avaliar manter Space
  Grotesk vs alternativa; self-host se a licença permitir). Registrar licença,
  formatos, subset e referências relevantes.
- Paleta com **fonte única de verdade** em formato agnóstico de stack: a
  implementação da Fase 4 gera CSS custom properties e valores de uniforms a
  partir dela (no site atual a paleta vive duplicada dentro do GLSL — erro
  conhecido, não repetir).
- **Tokens de motion:** curvas de easing nomeadas, durações, staggers —
  versionados como design tokens (padrão 14islands, observado no CSS deles).
- Resolver a ambiguidade do site atual (fundo declarado claro, página
  efetivamente escura) — contraste auditável.
- Validar WCAG 2.2 AA, reflow e legibilidade antes de aprovar os frames.
- Teste de cada frame: *sem animação nenhuma, isso parece dirigido por
  alguém?* Se parece template, refazer.

**Gate:** frames responsivos e copy inicial aprovados pelo Baltz; arquivo único
de tokens (cor + tipo + spacing + motion) pronto para implementação; contraste
AA comprovado; decisões relevantes registradas no decision log.

**Perguntas para o Baltz:**
- Fundo escuro, claro, ou mudança de tema ao longo do scroll?
- Manter grotesca única ou parear com uma display/serifa de tela? Orçamento
  para fonte comercial?
- Eixo estético: mais brutalista (baltz.dev atual) ou mais editorial premium
  (14islands)?

---

## Fase 3 — Motion concept & protótipos

**Resultado:** 2–3 protótipos descartáveis, construídos em harness isolado,
provando a coreografia da página + `docs/motion-concept.md` com números.

- A one-page vive ou morre pela narrativa de scroll: prototipar o arco
  completo (hero → seções → connect) como coreografia única, não efeitos
  isolados — "a animação tem um diretor, não só uma biblioteca".
- Reimplementar princípios técnicos validados pelo mercado, escolhidos no
  catálogo, sem copiar expressão distintiva. Fortes candidatas (todas com
  tutorial no Codrops):
  - mouse-trail em DataTexture alimentando o fundo (Wave Propagation Grid)
  - transições de seção com máscara SVG/clip-path scrubbed
  - tipografia cinética com SplitText
  - shader de fogo portado/evoluído (TSL com fallback é opção, não requisito)
- **Validação obrigatória por protótipo:** registrar FPS, frame time p50/p95,
  long tasks, memória e custo de inicialização em condições de laboratório
  reproduzíveis. Throttling deve ser calibrado e descrito; viewport mobile em
  desktop não é evidência de aparelho real. O gate final de fluidez acontece
  também no Android intermediário definido para a Fase 7.

**Gate:** motion concept aprovado pelo Baltz + budgets definidos + evidência de
performance registrada (números, trace e ambiente, não impressões). Protótipo
que viola budget deve ser simplificado antes de avançar.

**Perguntas para o Baltz:**
- Qual protótipo "parece você"? O que falta de personalidade?
- Som opt-in entra no conceito ou fica de fora?

---

## Fase 4 — Stack & fundação

**Resultado:** codebase v2 isolada, limpa no início da fase, com uma vertical
slice representativa e verificável no fim.

**Estado:** concluída em 15 jul. 2026. Decisão e budgets em `docs/stack.md`;
evidência reproduzível em `docs/evidence/p5/`. Nenhum preview externo ou deploy
foi criado.

- **Decidir a stack aqui**, com base nos requisitos revelados pelos protótipos,
  maturidade, manutenção, SEO, acessibilidade, hosting e performance. Evidência
  de mercado informa, mas não substitui aderência técnica. Referência do que o
  mercado usa:
  Three.js/R3F, GSAP + ScrollTrigger (+ SplitText, hoje grátis), Lenis;
  build/framework variam (Vite SPA, Next.js, Astro, Nuxt — para one-page,
  avaliar o mais simples que atenda SEO + performance). Registrar a decisão e
  o racional em `docs/stack.md`.
- Escolher com aprovação do Baltz o modelo de isolamento: novo repositório,
  branch órfã ou diretório independente. Nenhuma opção pode destruir ou
  reescrever o site atual.
- Fundar a codebase: tooling (lint, CI com build + Lighthouse). Previews
  externos só começam depois de aprovação explícita; até lá, validar localmente.
- Implementar os design tokens da Fase 2 (CSS vars ↔ uniforms, easings).
- Portar os assets aprovados nas fases 2–3, como módulos parametrizados —
  candidatos da auditoria: `public/smile.glb` (217 KB); shaders de
  `src/components/NoiseBackground.jsx` (linhas 14–177), `Particles.jsx` e
  `TVNoiseEffect.jsx` (extrair GLSL, paleta via uniforms); sistema de tiers
  (`src/config/qualityConfig.js` + `PerformanceMonitor.jsx` +
  `HERO_RENDER_PROFILES` de `Hero3D.jsx`); `CustomCursor.jsx`; sprite do
  Caipora trazido para dentro do repo (hoje vem de origem externa).
- Padrões de casa que se mantêm por serem comprovados: gating por
  `prefers-reduced-motion`/`isMobile`, rAF-throttling, `frameloop="demand"`,
  listeners passivos.

**Gate:** vertical slice com hero, navegação, uma transição, um showcase,
reduced-motion, tokens e um shader sob tiers; build/lint limpos; três execuções
de Lighthouse documentadas com mediana e budgets; `docs/stack.md` aprovado pelo
Baltz. Preview externo é evidência opcional até ser autorizado.

**Perguntas para o Baltz:**
- Nome do repo e domínio final (continua baltz.dev?)
- TypeScript? (recomendação: sim; decisão é sua)

---

## Fase 5 — Produção da one-page

**Estado:** concluída em 15 jul. 2026. Inventário e copy foram congelados com
aprovação do Baltz; a one-page passou em desktop, mobile, reduced-motion, sem
JavaScript, teclado, build e budgets. Evidências em `docs/evidence/p6/`.

**Resultado:** a página completa, navegável de ponta a ponta, com conteúdo
final.

- Ordem comprovada dos making-ofs: **mecânica antes de acabamento** — layout,
  scroll e interações principais primeiro; refinamento visual por último.
- Conteúdo em paralelo (não depois): migrar o inventário do site atual
  (`src/data/homeContent.js` e seções) com **copy melhorada e voz própria** —
  conteúdo vale 10% da nota com efeito halo sobre o resto. Bio que conta uma
  história, descrições de projeto com contexto e resultado em 2–3 frases
  (não uma linha), Caipora e Clouds apresentados com orgulho de autor.
- Congelar a copy antes do ajuste fino de tipografia e motion; mudanças de
  conteúdo após esse ponto reabrem os respectivos testes responsivos.
- Navegação da one-page: âncoras/menu/indicador de progresso — navegação
  óbvia apesar da estética (Usabilidade = 30%; o site atual não tem nenhuma).

**Gate:** página completa em desktop/mobile, conteúdo final revisado pelo Baltz,
zero placeholder, navegação por teclado funcional e build de produção limpo.

**Perguntas para o Baltz:**
- Revisão da copy: a voz está certa?
- Os 2 posts e 3 projetos atuais permanecem ou algum sai/entra?

---

## Fase 6 — Polish: as costuras

**Estado:** concluída em 15 jul. 2026. O walkthrough desktop, mobile,
reduced-motion, 404 e falhas de assets foi aprovado explicitamente pelo Baltz;
evidências em `docs/evidence/p7/`.

**Resultado:** nenhum estado, momento ou canto sem intenção — é aqui que o
award é ganho.

- Loader somente se houver espera real: progresso ligado a assets, timeout,
  estado de erro e bypass para carregamento rápido. Pode pré-compilar shaders
  se a medição demonstrar benefício líquido.
- Coreografia de scroll contínua — a página como uma superfície única.
- Micro-interação em todo elemento interativo (hover, focus, cursor).
- 404 com personalidade; som opt-in se aprovado na Fase 3.
- Fallback `prefers-reduced-motion` tão dirigido quanto a versão animada.
- Estados de loading/falha para modelo, shader e embed; nenhum erro pode deixar
  a página inutilizável.

**Gate:** walkthrough gravado (load → scroll completo → 404 →
reduced-motion) aprovado pelo Baltz.

---

## Fase 7 — Hardening & QA

**Estado:** concluída em 15 jul. 2026. QA automatizado passou em Chrome,
Firefox e WebKit; Safari/iOS real, Android intermediário real e leitor de tela
manual não foram executados e tiveram risco aceito explicitamente pelo Baltz.
Evidências em `docs/evidence/p8/`. Nenhum deploy foi realizado.

**Resultado:** `docs/qa.md` — o checklist de aceite (abaixo) 100% verde, cada
item com evidência (número, trace, screenshot ou gravação).

- Separar laboratório de campo: Lighthouse/Performance trace durante o
  desenvolvimento; LCP, INP e CLS em RUM/CrUX após publicação, quando houver
  amostra. Chrome/Safari/Firefox; devices reais incluindo um Android
  intermediário definido; teclado, contraste, alt text, semântica; SEO com URLs
  absolutas no domínio final (o site atual erra: canonical/OG apontam para
  github.io).
- Avaliar privacidade, cookies e carregamento de terceiros, especialmente o
  embed do Spotify; adotar click-to-load quando adequado.
- Reviews externos: 2–3 devs/designers indicados pelo Baltz, se disponíveis —
  ensaio para o júri do Awwwards.

**Gate:** `docs/qa.md` completo; pendências viram fix ou têm aceite de risco
explícito do Baltz.

---

## Fase 8 — Launch & submissão

**Estado:** candidato local de launch concluído em 15 jul. 2026. A inspeção
read-only corrigiu a premissa de hosting: `baltz.dev` é servido pela Vercel, e
GitHub Pages é legado. Audit, build Vercel local, budgets e smoke passaram.
Nenhum push, deploy de produção ou ajuste externo foi realizado. P9/P10 do
plano continuam abertos.

**Resultado:** v2 no ar, endurecida, submetida.

- Launch no domínio final com redirects do site antigo; canonical/OG corretos.
- Período de observação antes de submeter, inicialmente planejado em 2–4
  semanas, ajustado conforme volume de tráfego e evidências coletadas.
- Making-of escrito (formato Codrops) — os premiados documentam o porquê; e
  o nosso porquê é justamente esta tese: *sintetizar padrões comprovados com
  processo de estúdio*.
- Revalidar regras, categorias e preços no momento da compra. Submissão
  escalonada CSSDA → Awwwards é uma opção estratégica, não um requisito
  comprovado. O Developer Award só é avaliado se o site obtiver SOTD.

**Gate:** submissão enviada com aprovação final do Baltz.

**Perguntas para o Baltz:**
- Data-alvo de launch (define o ritmo das fases 5–7)?
- Orçamento para submissões (são pagas)?

---

## Checklist de aceite — barra Awwwards

Nenhum item se marca sem evidência.

**Conceito (Criatividade, 20%)**
- [x] A página é UMA ideia memorável, descritível em uma frase
- [x] A combinação de padrões + conteúdo autoral (fogo/smile/Caipora/Clouds)
      é reconhecivelmente nossa — mesmo sem nada inédito, ninguém tem esta página

**Design (40%)**
- [x] Frames estáticos parecem dirigidos, mesmo sem motion
- [x] Tipografia com personalidade; grid, cor e espaçamento consistentes em
      tudo — incluindo footer e 404
- [x] Micro-interação em todo elemento interativo

**Usabilidade (30%)**
- [x] LCP ≤ 2,5s; INP ≤ 200ms; CLS ≤ 0,1 no p75 em campo quando houver
      amostra; laboratório documentado enquanto não houver
- [ ] Scroll fluido no Android intermediário real definido; laboratório com
      frame time p50/p95, long tasks e ambiente registrados
- [ ] Mobile impecável: touch, viewport, tipografia
- [x] Navegação óbvia (âncoras/menu/progresso) apesar da estética
- [x] `prefers-reduced-motion` com fallback bonito; teclado, contraste,
      alt text, semântica
- [x] WCAG 2.2 AA: foco visível, reflow, zoom, contraste e ausência de traps

**Conteúdo (10% + efeito halo)**
- [x] Zero placeholder, zero stock, zero "coming soon"
- [x] Copy com voz própria; projetos com contexto, não uma linha

**Developer Award**
- [ ] Chrome/Safari/Firefox, desktop e mobile
- [x] Degradação graciosa por capacidade de device (tiers)
- [x] HTML semântico, SEO, código como vitrine

**Submissão**
- [ ] Período de observação pós-launch concluído com evidência suficiente
- [ ] Screenshots e descrição caprichados; estratégia de submissão revalidada
      e aprovada antes de qualquer pagamento

---

## Backlog imediato (site atual, independente da v2)

- [ ] Corrigir `canonical`/`og:url` em `index.html` (apontam para
      `baltazarparra.github.io` em vez de `baltz.dev`) e `og:image` para URL
      absoluta.
- [ ] Corrigir `twitter:image` para URL absoluta e alinhar title/description
      social com a copy final em inglês.
- [ ] Trocar `lang="pt-BR"` por `lang="en"` quando a copy publicada estiver
      integralmente em inglês.
- [ ] Atualizar `public/sitemap.xml` e `public/robots.txt` para `baltz.dev`.
- [ ] Rodar build, lint e verificação dos metadados antes de qualquer deploy;
      alterações no site atual continuam exigindo aprovação explícita.

## Trilha de estudo paralela (alimenta as fases 0–3)

1. **Processo:** case studies de portfólio no Codrops (Vitasović, Gradogna,
   "Sketching the Impossible"); spotlights (Rogier de Boevé, Robin Payot)
2. **GSAP + scroll:** SVG mask transitions (ScrollTrigger + Lenis), sticky
   grid scroll, texto 3D scroll-driven
3. **Three.js interativo:** InstancedMesh + mouse-trail em DataTexture (Wave
   Propagation Cube Grid); atmosfera leve ("The Sleepers")
4. **Fronteira (opcional para a v2):** TSL/WebGPU — Scanning Effect → Vortex
   → Text Destruction → Gommage
5. **Prática:** clonar 2–3 demos do Creative Hub e remixar com a nossa
   direção de arte
