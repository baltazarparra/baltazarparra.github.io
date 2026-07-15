# ROADMAP — baltz.dev v2: one-page nível award, do zero absoluto

> **Para o agente executor (Codex / GPT-5.6):** este documento define o
> resultado esperado, as restrições e a barra de conclusão de cada fase — o
> caminho é seu. Cada fase tem um **Gate** (evidência exigida para avançar) e
> **Perguntas** (decisões que pertencem ao Baltz — quando bloquear, pergunte
> apenas o menor item em aberto; não expanda escopo sem confirmação).
> Trabalhe uma fase por vez, na ordem. Nunca marque um gate como cumprido sem
> a evidência pedida.

---

## Missão

Reconstruir o site pessoal de Baltazar Parra ("baltz") **do zero absoluto** —
repositório vazio, nenhuma stack herdada, nenhum arquivo — e entregar uma
**one-page** com o mesmo conteúdo do site atual (https://www.baltz.dev/),
porém digna de **Awwwards Site of the Day + Developer Award**.

O diferencial não é técnica nova: é passar pelos passos de planejamento dos
grandes estúdios (conceito → direção de arte → motion concept → protótipo →
produção → polish), que o site atual nunca recebeu.

## Estratégia central: replicação comprovada

**Não vamos inventar nada original do zero.** Vamos analisar os premiados e o
mercado (Awwwards, Codrops, 14islands) e replicar o que comprovadamente
funciona.

Regra operacional para o executor: **toda decisão de design, motion ou técnica
deve citar pelo menos uma referência premiada ou tutorial consolidado que a
valide** (um SOTD que usa o padrão, um case study que o descreve, um tutorial
do Codrops que o ensina). Decisão sem referência = especulação = não entra.

A identidade não vem de invenção — vem de três coisas que já são nossas:
1. **O conteúdo** (trajetória, jogo Caipora, EP Clouds, posts) — nenhum
   concorrente tem esse material.
2. **A combinação** de padrões comprovados escolhida na direção de arte.
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

## Contexto — o que a pesquisa concluiu (jul/2026)

Síntese de 4 frentes — 14islands (processo), Codrops (técnicas), Awwwards
(julgamento), auditoria do baltz.dev. Documento completo:
https://claude.ai/code/artifact/afe03f5c-45f8-41fb-a84d-0db0a95b28cb

1. **Awwwards julga:** Design 40% · Usabilidade 30% · Criatividade 20% ·
   Conteúdo 10% (com efeito halo). ~75% dos SOTDs também levam Developer
   Award — técnica é pré-requisito; o que decide é conceito + direção de arte.
2. **14islands:** motion concept **antes** do design detalhado; easings como
   design tokens; creative developer presente desde a concepção.
3. **Making-ofs premiados:** conceito → moodboard → protótipo de motion →
   mecânica antes de acabamento → performance como requisito → polish nas
   "costuras" (loader, transições, cursor, 404).
4. **Auditoria do baltz.dev:** a engenharia atual já é nível award (shader de
   fogo, quality tiers, disciplina de reduced-motion); o que falta é
   concepção — exatamente o que este roadmap corrige.

## Decisões já tomadas (não relitigar)

| Área | Decisão |
|---|---|
| Formato | One-page + 404 |
| Conteúdo | O do site atual, copy melhorada, zero placeholder |
| Estratégia criativa | Replicação comprovada; sem invenção especulativa |
| Idioma do site | Inglês (corrigindo o `lang="pt-BR"` atual) |
| Assets elegíveis para reuso | smile.glb, shaders (fogo/partículas/TV noise), quality tiers, cursor-brasa, sprite Caipora, EP Clouds — reusar é opção, não obrigação; decide-se nas fases 2–4 |
| Stack | **Não decidida** — é o gate da Fase 4, escolhida com base no que o mercado premiado comprovadamente usa |

## Autonomia do executor

**Pode sem perguntar:** ler/criar/editar código e rascunhos, rodar
builds/lints/audits/medições, criar protótipos descartáveis, instalar
dependências dentro da stack aprovada na Fase 4.

**Precisa de confirmação do Baltz:** escolha de conceito, direção de arte e
stack (fases 1, 2 e 4 são co-criação); deploy de produção; submissões e
qualquer publicação externa; compras (fontes, domínio, serviços); alterações
no site atual (ele fica no ar, intocado, até o launch da v2).

---

## Fase 0 — Catálogo de padrões comprovados

**Resultado:** `docs/padroes.md` — a biblioteca de referência de onde TODAS
as decisões posteriores vão citar evidência.

Para **cada seção da one-page** (hero, about, writing, projects, showcase de
jogo/música, connect, footer) e para **cada costura** (loader, scroll,
transições internas, cursor, 404), catalogar 2–3 soluções premiadas:

- Fonte: SOTDs recentes de portfólio (Julien Calot, MONOLOG, Pacôme Pertant,
  Bruno Simon, Elliott Mangham, Adcker), case studies do Codrops (Vitasović,
  Gradogna, "Sketching the Impossible"), cases da 14islands, Webzibition.
- Para cada padrão registrar: onde foi usado (link), por que funciona (em uma
  frase), e qual tutorial/técnica o implementa (link do Codrops quando
  existir).
- Registrar também 5 clichês a evitar (ex.: o esqueleto "seções numeradas +
  títulos uppercase gigantes + cards", identificado na auditoria como o
  pattern genérico de portfólio ~2022 — que é exatamente o site atual).

**Gate:** `docs/padroes.md` cobre todas as seções e costuras da one-page, cada
padrão com link de premiado + link de implementação.

**Perguntas para o Baltz:**
- Dessas referências, quais mais parecem "você"? Quais rejeita de cara?

---

## Fase 1 — Conceito

**Resultado:** `docs/conceito.md` — manifesto de uma página.

- Montar **3 conceitos candidatos**, cada um combinando apenas padrões do
  catálogo da Fase 0 (nada especulativo), amarrados ao nosso material: fogo,
  smile, Caipora, Clouds, trajetória.
- Cada candidato responde, por escrito: como é o loader, como o scroll conta
  a história da página (a one-page tem UMA narrativa de scroll — ela é a
  "transição de página" do nosso formato), e como é o 404.
- Teste de aprovação: o conceito cabe em uma frase e decide sozinho essas
  costuras. Se não decide, é moodboard — refinar ou descartar.

**Gate:** Baltz escolheu (ou remixou) um candidato; manifesto aprovado
explicitamente.

**Perguntas para o Baltz:**
- Público primário: recrutadores/empresas, estúdios criativos ou clientes?
- O que a pessoa deve sentir em 5 segundos e lembrar no dia seguinte?
- O fogo continua sendo a alma, vira coadjuvante, ou sai?
- O smile 3D permanece como assinatura do hero?
- Caipora e Clouds: vitrines discretas ou protagonistas da narrativa?

---

## Fase 2 — Direção de arte

**Resultado:** `docs/direcao-de-arte.md` + frames estáticos das telas-chave
(hero, uma seção de conteúdo, connect, 404).

- Tipografia com personalidade, tratada como imagem (avaliar manter Space
  Grotesk vs alternativa; self-host obrigatório). Citar em quais premiados a
  escolha se apoia.
- Paleta com **fonte única de verdade**: tokens que alimentam CSS custom
  properties E uniforms de shader (no site atual a paleta vive duplicada
  dentro do GLSL — erro conhecido, não repetir).
- **Tokens de motion:** curvas de easing nomeadas, durações, staggers —
  versionados como design tokens (padrão 14islands, observado no CSS deles).
- Resolver a ambiguidade do site atual (fundo declarado claro, página
  efetivamente escura) — contraste auditável.
- Teste de cada frame: *sem animação nenhuma, isso parece dirigido por
  alguém?* Se parece template, refazer.

**Gate:** frames estáticos aprovados pelo Baltz; arquivo único de tokens
(cor + tipo + motion) pronto para consumo por código; cada decisão com sua
referência do catálogo.

**Perguntas para o Baltz:**
- Fundo escuro, claro, ou mudança de tema ao longo do scroll?
- Manter grotesca única ou parear com uma display/serifa de tela? Orçamento
  para fonte comercial?
- Eixo estético: mais brutalista (baltz.dev atual) ou mais editorial premium
  (14islands)?

---

## Fase 3 — Motion concept & protótipos

**Resultado:** 2–3 protótipos descartáveis provando a coreografia da página +
`docs/motion-concept.md` com números.

- A one-page vive ou morre pela narrativa de scroll: prototipar o arco
  completo (hero → seções → connect) como coreografia única, não efeitos
  isolados — "a animação tem um diretor, não só uma biblioteca".
- Replicar técnicas já validadas pelo mercado, escolhidas no catálogo. Fortes
  candidatas (todas com tutorial no Codrops):
  - mouse-trail em DataTexture alimentando o fundo (Wave Propagation Grid)
  - transições de seção com máscara SVG/clip-path scrubbed
  - tipografia cinética com SplitText
  - shader de fogo portado/evoluído (TSL com fallback é opção, não requisito)
- **Validação obrigatória por protótipo:** FPS medido com CPU 4× throttled em
  viewport mobile, registrado por escrito. < 55fps → simplificar agora.

**Gate:** motion concept aprovado pelo Baltz + evidência de performance
registrada (números, não impressões).

**Perguntas para o Baltz:**
- Qual protótipo "parece você"? O que falta de personalidade?
- Som opt-in entra no conceito ou fica de fora?

---

## Fase 4 — Stack & fundação

**Resultado:** repositório novo, vazio no início da fase, com esqueleto
deployado no fim.

- **Decidir a stack aqui**, com base em evidência de mercado (o que os SOTDs
  e a 14islands comprovadamente usam) e nas necessidades reveladas pelos
  protótipos — não por preferência prévia. Referência do que o mercado usa:
  Three.js/R3F, GSAP + ScrollTrigger (+ SplitText, hoje grátis), Lenis;
  build/framework variam (Vite SPA, Next.js, Astro, Nuxt — para one-page,
  avaliar o mais simples que atenda SEO + performance). Registrar a decisão e
  o racional em `docs/stack.md`.
- Fundar o repo: tooling (lint, CI com build + Lighthouse), deploy contínuo
  com previews desde o dia 1.
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

**Gate:** preview deployado com smooth scroll, um shader rodando sob tiers,
tokens funcionando; Lighthouse ≥ 95 nas quatro categorias no esqueleto;
`docs/stack.md` aprovado pelo Baltz.

**Perguntas para o Baltz:**
- Nome do repo e domínio final (continua baltz.dev?)
- TypeScript? (recomendação: sim; decisão é sua)

---

## Fase 5 — Produção da one-page

**Resultado:** a página completa, navegável de ponta a ponta, com conteúdo
final.

- Ordem comprovada dos making-ofs: **mecânica antes de acabamento** — layout,
  scroll e interações principais primeiro; refinamento visual por último.
- Conteúdo em paralelo (não depois): migrar o inventário do site atual
  (`src/data/homeContent.js` e seções) com **copy melhorada e voz própria** —
  conteúdo vale 10% da nota com efeito halo sobre o resto. Bio que conta uma
  história, descrições de projeto com contexto e resultado em 2–3 frases
  (não uma linha), Caipora e Clouds apresentados com orgulho de autor.
- Navegação da one-page: âncoras/menu/indicador de progresso — navegação
  óbvia apesar da estética (Usabilidade = 30%; o site atual não tem nenhuma).

**Gate:** página completa com conteúdo final revisado pelo Baltz, zero
placeholder, build de produção limpo.

**Perguntas para o Baltz:**
- Revisão da copy: a voz está certa?
- Os 2 posts e 3 projetos atuais permanecem ou algum sai/entra?

---

## Fase 6 — Polish: as costuras

**Resultado:** nenhum estado, momento ou canto sem intenção — é aqui que o
award é ganho.

- Loader com propósito (pré-compila shaders durante o load; padrão comprovado).
- Coreografia de scroll contínua — a página como uma superfície única.
- Micro-interação em todo elemento interativo (hover, focus, cursor).
- 404 com personalidade; som opt-in se aprovado na Fase 3.
- Fallback `prefers-reduced-motion` tão dirigido quanto a versão animada.

**Gate:** walkthrough gravado (load → scroll completo → 404 →
reduced-motion) aprovado pelo Baltz.

---

## Fase 7 — Hardening & QA

**Resultado:** `docs/qa.md` — o checklist de aceite (abaixo) 100% verde, cada
item com evidência (número, screenshot ou gravação).

- Core Web Vitals; Chrome/Safari/Firefox; devices reais incluindo um Android
  intermediário; teclado, contraste, alt text, semântica; SEO com URLs
  absolutas no domínio final (o site atual erra: canonical/OG apontam para
  github.io).
- Reviews externos: 2–3 devs/designers convidados pelo Baltz — ensaio para o
  júri de 18 estranhos.

**Gate:** `docs/qa.md` completo; pendências viram fix ou têm aceite de risco
explícito do Baltz.

---

## Fase 8 — Launch & submissão

**Resultado:** v2 no ar, endurecida, submetida.

- Launch no domínio final com redirects do site antigo; canonical/OG corretos.
- **2–4 semanas de observação antes de submeter** (conselho direto de
  jurados: submissão prematura expõe bugs ao júri).
- Making-of escrito (formato Codrops) — os premiados documentam o porquê; e
  o nosso porquê é justamente esta tese: *replicar padrões comprovados com
  processo de estúdio*.
- Submissão escalonada: CSSDA primeiro, depois Awwwards (SOTD + Developer
  Award). Screenshots e descrição também são julgados.

**Gate:** submissão enviada com aprovação final do Baltz.

**Perguntas para o Baltz:**
- Data-alvo de launch (define o ritmo das fases 5–7)?
- Orçamento para submissões (são pagas)?

---

## Checklist de aceite — barra Awwwards

Nenhum item se marca sem evidência.

**Conceito (Criatividade, 20%)**
- [ ] A página é UMA ideia memorável, descritível em uma frase
- [ ] A combinação de padrões + conteúdo autoral (fogo/smile/Caipora/Clouds)
      é reconhecivelmente nossa — mesmo sem nada inédito, ninguém tem esta página

**Design (40%)**
- [ ] Frames estáticos parecem dirigidos, mesmo sem motion
- [ ] Tipografia com personalidade; grid, cor e espaçamento consistentes em
      tudo — incluindo footer e 404
- [ ] Micro-interação em todo elemento interativo

**Usabilidade (30%)**
- [ ] LCP < 2.5s; carregamento percebido < 3s (loader com identidade)
- [ ] 60fps de scroll em Android intermediário (CPU 4× throttled)
- [ ] Mobile impecável: touch, viewport, tipografia
- [ ] Navegação óbvia (âncoras/menu/progresso) apesar da estética
- [ ] `prefers-reduced-motion` com fallback bonito; teclado, contraste,
      alt text, semântica

**Conteúdo (10% + efeito halo)**
- [ ] Zero placeholder, zero stock, zero "coming soon"
- [ ] Copy com voz própria; projetos com contexto, não uma linha

**Developer Award**
- [ ] Chrome/Safari/Firefox, desktop e mobile
- [ ] Degradação graciosa por capacidade de device (tiers)
- [ ] HTML semântico, SEO, código como vitrine

**Submissão**
- [ ] 2–4 semanas de hardening pós-launch antes de submeter
- [ ] Screenshots e descrição caprichados; escalonar CSSDA → Awwwards

---

## Backlog imediato (site atual, independente da v2)

- [ ] Corrigir `canonical`/`og:url` em `index.html` (apontam para
      `baltazarparra.github.io` em vez de `baltz.dev`) e `og:image` para URL
      absoluta.

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
