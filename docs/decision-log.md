# Decision log — baltz.dev v2

Registro de decisões que afetam escopo, experiência, arquitetura ou validação.
Cada entrada deve conter contexto, decisão, evidência, alternativa rejeitada e
forma de revalidação.

## D-0001 — Produção permanece intocada durante o baseline

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** a missão exige uma codebase v2 isolada e continuidade do site
  atual até o launch aprovado.
- **Decisão:** P0 altera apenas roadmap, plano e documentação/evidências locais.
- **Evidência:** `git status` não registra alteração em `src/`, `public/`,
  configuração de build ou `dist/`; nenhum comando de deploy foi executado.
- **Alternativa rejeitada:** corrigir SEO e performance do site atual durante o
  baseline. Isso misturaria observação com intervenção e excederia a autorização.
- **Revalidar quando:** Baltz autorizar explicitamente a trilha independente de
  correções do site atual ou no gate de launch da v2.

## D-0002 — Mediana de três Lighthouse por perfil

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** uma única execução de laboratório varia e não sustenta decisões
  de performance.
- **Decisão:** registrar três execuções mobile e três desktop e reportar mediana
  e intervalo mínimo–máximo.
- **Evidência:** seis relatórios JSON em `docs/evidence/p0/`, produzidos com
  Lighthouse 13.4.0 e Chrome 149.
- **Alternativa rejeitada:** tratar uma execução isolada ou uma impressão visual
  como baseline.
- **Revalidar quando:** P4 definir budgets de runtime e P5/P8 medir protótipos e
  build final.

## D-0003 — TBT/TTI atuais são dívida, não budget da v2

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** a página com animação contínua não alcança CPU quiet no Chrome
  headless; o perfil mobile mediano marcou TBT de 11,7 s.
- **Decisão:** usar os resultados como evidência de risco para simplificação e
  instrumentação, sem transformar números contaminados pelo ambiente WebGL/WSL
  em meta de produto.
- **Evidência:** `docs/baseline.md`, relatórios Lighthouse e tentativa diagnóstica
  que expirou sem limite explícito de load.
- **Alternativa rejeitada:** aceitar performance por causa do bom LCP desktop ou
  exigir que a v2 apenas supere o site atual.
- **Revalidar quando:** P4 medir FPS/frame time/long tasks em hardware definido e
  P8 testar devices reais.

## D-0004 — Fallback de automação visual no P0

- **Data:** 15 jul. 2026
- **Status:** aceita com limitação
- **Contexto:** o executável `agent-browser` não estava disponível no ambiente.
- **Decisão:** usar Chrome headless local para smoke visual e Lighthouse, sem
  alegar compatibilidade cross-browser ou device real.
- **Evidência:** screenshots e user agent registrados em `docs/evidence/p0/`.
- **Alternativa rejeitada:** bloquear todo o baseline por uma ferramenta ausente.
- **Revalidar quando:** P8 executar a matriz real de browsers/devices.

## D-0005 — Referências validam princípios, não layouts

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** P1 reúne sites premiados e case studies, mas a identidade da v2
  não pode ser uma colagem de soluções distintivas.
- **Decisão:** catalogar princípio, adequação, risco, custo e licença; qualquer
  expressão visual será redesenhada a partir do conteúdo do Baltz.
- **Evidência:** `docs/padroes.md` cobre 13 áreas e explicita antirrepertório e
  restrições de uso.
- **Alternativa rejeitada:** escolher uma referência por semelhança estética e
  replicar sua composição.
- **Revalidar quando:** P2 comparar conceitos e P3 aprovar frames.

## D-0006 — Loader e WebGL não serão a única entrada

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** no Chrome headless, MONOLOG ficou em fundo preto, Elliott em 60%,
  Julien em 0% e Pacôme exibiu erro 500; Bruno ofereceu fallback HTML funcional.
- **Decisão:** conteúdo e navegação básicos devem existir antes e sem WebGL. Um
  loader só será criado se a vertical slice comprovar espera inevitável e
  progresso real.
- **Evidência:** verificação visual descrita em `docs/padroes.md`; baseline P0 já
  mostrou trabalho contínuo e TBT alto no site atual.
- **Alternativa rejeitada:** tratar loader cinematográfico como requisito de
  prêmio.
- **Revalidar quando:** P5 medir inicialização da vertical slice.

## D-0007 — Curadoria autoral da shortlist P1

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** a pesquisa reduziu o repertório a oito direções de princípio,
  mas a escolha do que “parece Baltz” não é decisão técnica.
- **Decisão:** usar S1 — Podium e S8 — MONOLOG como referências preferidas;
  rejeitar S3, S4, S5, S6 e S7; manter S2 neutra. A P2 buscará narrativa
  contínua e contida com força verbal, sem copiar layout ou tom de agência.
- **Evidência:** resposta explícita do Baltz e shortlist S1–S8 em
  `docs/padroes.md`.
- **Alternativa rejeitada:** Codex escolher uma direção por conveniência.
- **Revalidar quando:** os três conceitos P2 revelarem incompatibilidade
  concreta com o conteúdo, acessibilidade ou performance.

## D-0008 - Hierarquia autoral nasce nos conceitos

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** o primeiro roteiro de briefing pediu que o Baltz definisse o
  protagonismo de fogo, smile, Caipora e Clouds antes da direção de arte.
- **Decisão:** tratar esses elementos como material criativo. Cada conceito P2
  deve propor e justificar sua própria hierarquia; a P3 materializa a direção
  aprovada em copy, tokens e frames.
- **Evidência:** correção explícita do Baltz e três hipóteses completas em
  `docs/conceito.md`.
- **Alternativa rejeitada:** delegar ao briefing uma resposta que deveria ser
  demonstrada pelos conceitos.
- **Revalidar quando:** o conceito escolhido não decidir sozinho hero, arco de
  scroll, loading e 404.

## D-0009 - The Edit é o conceito da v2

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** C1 preservava fogo como protagonista; C3 removia o fogo literal
  e o smile 3D. C2 concentrava a percepção de execução em edição, tipografia,
  mídia e contenção.
- **Decisão:** aprovar C2, The Edit, sem remix. Fogo será coadjuvante, smile terá
  um plano curto no hero, e Caipora e Clouds serão os dois showcases autorais
  de maior escala.
- **Evidência:** escolha explícita "C2" do Baltz e comparação registrada em
  `docs/conceito.md`.
- **Alternativa rejeitada:** C1, C3 e o remix C2+C3 nesta versão.
- **Revalidar quando:** somente se os frames P3 não alcançarem a reação "que
  projeto bem executado!" ou falharem nos requisitos de acesso e performance.

## D-0010 - Direção visual de The Edit

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** C2 precisa tornar precisão perceptível sem cair em portfolio
  editorial genérico ou reintroduzir fogo como espetáculo permanente.
- **Decisão:** tema grafite único, Instrument Sans variável, raio zero,
  laranja térmico como único acento, smile em plano curto, Caipora full-bleed e
  Clouds como cover split. Sem cards equivalentes, numeração ou loader.
- **Evidência:** aprovação explícita do Baltz em 15 jul. 2026;
  `docs/direcao-de-arte.md`, `docs/design-tokens.json`, storyboard e preflight
  em `docs/evidence/p3/`.
- **Alternativa rejeitada:** manter o fundo de fogo, usar serifa editorial por
  conveniência ou aplicar a mesma composição a todas as seções.
- **Revalidar quando:** P4 revelar incompatibilidade concreta entre a direção
  estática e os budgets de motion ou acessibilidade.

## D-0011 - Pinned Edit é o motion concept da v2

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** The Edit precisa de narrativa contínua sem transformar cada
  seção em demonstração de efeito ou atrasar leitura.
- **Decisão:** usar B - Pinned Edit como espinha; limitar Cut e Settle
  a transições funcionais; excluir Words como sistema global e manter som fora
  do conceito. Touch remove pin; reduced motion mostra estados finais.
- **Evidência:** aprovação explícita do Baltz em 15 jul. 2026;
  `docs/motion-concept.md`, harness em `docs/prototypes/p4/` e 20 execuções
  registradas em `docs/evidence/p4/`.
- **Alternativa rejeitada:** repetir máscara em todas as seções, revelar toda
  copy palavra a palavra ou introduzir áudio sem requisito narrativo.
- **Revalidar quando:** vertical slice ou device real violar os budgets, a
  leitura ou os fallbacks definidos.

## D-0012 - Astro estático com ilhas em diretório isolado

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** a v2 é uma one-page + 404 sem backend ou CMS. O baseline da SPA
  atual tem conteúdo semanticamente simples, mas transfere cerca de 708 kB e
  deixa Three no caminho inicial. P4 comprovou Pinned Edit com scroll nativo.
- **Decisão:** usar Astro estático e TypeScript estrito; HTML/Astro
  para estrutura e copy; React/R3F apenas para Smile e shader; GSAP sobre scroll
  nativo; v2 em `v2/` neste repositório; GitHub Pages como alvo estático;
  `https://baltz.dev/` como canonical.
- **Evidência:** aprovação explícita do Baltz em 15 jul. 2026, comparação e
  fontes oficiais em `docs/stack.md`, baseline P0 e medições P4.
- **Alternativa rejeitada:** SPA React integral, Next sem requisito de servidor,
  branch órfã, novo repositório e Lenis na fundação.
- **Revalidar quando:** a vertical slice falhar nos budgets ou revelar uma
  limitação técnica concreta.
- **Nota posterior:** a escolha de stack, isolamento e canonical permanece;
  apenas o alvo GitHub Pages foi substituído por Vercel em D-0020 após inspeção
  do ambiente real.

## D-0013 - Primeiro viewport estável; WebGL depois de intenção

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** `client:idle` para o Smile deixava React/Three no caminho
  inicial e aumentava trabalho de main thread. A tipografia variável completa
  também mantinha o LCP mobile acima de 2,5 s no modelo do Lighthouse.
- **Decisão:** renderizar um smile estático dirigido em CSS; importar a cena 3D
  somente após `pointerenter` real de mouse/caneta; manter touch, reduced motion
  e ausência de JavaScript em fallback; usar `font-display: optional` e subset
  ASCII da Instrument Sans. Texto não anima opacidade, preservando contraste e
  a árvore acessível durante todo o scroll.
- **Evidência:** seis relatórios Lighthouse finais, smoke em quatro perfis e
  sete percursos instrumentados em `docs/evidence/p5/`. Mobile passou de um
  LCP observado acima de 4 s durante a iteração para mediana de 2,414 s; TBT
  mediano é 0 ms.
- **Alternativa rejeitada:** hidratar o Smile em idle, relaxar o budget de LCP,
  ocultar copy até o ScrollTrigger ou remover a tipografia aprovada.
- **Revalidar quando:** P8 medir device real, quando a copy exigir caracteres
  fora do subset ou se o Smile passar a ter função além de enriquecimento.

## D-0014 - Inventário e copy editorial congelados no P6

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** o ajuste fino de layout e motion exigia um inventário estável;
  conteúdo alterado depois desse ponto reabre responsividade e hierarquia.
- **Decisão:** manter os dois posts, os três projetos e a copy atual; integrar
  Writing entre About e Projects com datas semânticas e uma ação por texto. O
  conteúdo continua versionado em `v2/src/data/site.ts`, sem CMS.
- **Evidência:** confirmação explícita "sim" do Baltz em 15 jul. 2026 e
  verificações em `docs/evidence/p6/`.
- **Alternativa rejeitada:** inventar conteúdo novo, usar placeholders, excluir
  itens sem direção autoral ou introduzir um CMS sem necessidade operacional.
- **Revalidar quando:** Baltz solicitar mudança de inventário ou um destino
  externo ficar indisponível.

## D-0015 - P7 sem loader, embed ou som; motion entra em idle

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** o polish só deveria adicionar costuras justificadas. A página
  já mostra conteúdo no primeiro frame; player incorporado adicionaria runtime
  e privacidade de terceiro; GSAP antes do LCP criou regressão mensurável.
- **Decisão:** não criar loader; manter Spotify como link explícito sem embed;
  manter som fora; importar GSAP em idle e omiti-lo em reduced motion; aplicar
  timeout de 8 s e posters/fallbacks aos assets pesados.
- **Evidência:** conceito C2, aprovação P4 e medições/percursos em
  `docs/evidence/p7/`. A mediana de LCP caiu de 2,558 s durante a iteração para
  2,271 s após retirar motion do caminho crítico.
- **Alternativa rejeitada:** loader decorativo, iframe do Spotify, áudio
  ambiente e execução imediata de GSAP.
- **Revalidar quando:** RUM demonstrar espera perceptível inevitável, embed se
  tornar requisito editorial, Baltz aprovar som ou motion em idle perder uma
  interação real.

## D-0016 - Identidade técnica e social coerentes com The Edit

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** a v2 precisava representar corretamente Baltz e `baltz.dev`
  para crawlers sem reutilizar o social card legado, visualmente incompatível
  com a direção aprovada.
- **Decisão:** publicar canonical absoluto, robots/sitemap do domínio final,
  JSON-LD `WebSite` + `Person` e um OG/Twitter 1200 × 630 próprio de The Edit.
  A 404 recebe `noindex, follow`.
- **Evidência:** seis Lighthouse 100 em SEO, inspeção de metadata e card final
  em `docs/evidence/p8/`.
- **Alternativa rejeitada:** manter `og.jpg` legado ou depender de metadata
  incompleta do hosting.
- **Revalidar quando:** domínio, identidade pública ou copy principal mudar.

## D-0017 - Cobertura física e manual do P8

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** Chrome, Firefox e WebKit passaram no laboratório, mas o
  ambiente não fornece Safari/macOS/iOS, Android físico ou sessão manual de
  leitor de tela. WebKit Linux e árvore AX não são substitutos integrais.
- **Decisão:** fechar P8 com aceite explícito dos riscos de não executar Safari
  macOS/iOS real, Android intermediário real e leitor de tela manual. A
  preparação local do P9 está autorizada; deploy continua fora da autorização.
- **Evidência:** aceite escrito do Baltz em 15 jul. 2026 — “aceito os riscos do
  P8 e autorizo preparar o P9” — e `docs/evidence/p8/`.
- **Alternativa rejeitada:** marcar cobertura emulada como device físico ou
  inspeção AX como teste manual.
- **Revalidar quando:** houver acesso a hardware/leitor de tela ou mudança
  relevante em layout, motion ou semântica.

## D-0018 - GitHub Pages por artifact workflow manual

- **Data:** 15 jul. 2026
- **Status:** substituída
- **Contexto:** o comando legado `gh-pages -d dist` usava uma cadeia com cinco
  avisos e apontava para o artefato da aplicação antiga, criando risco de
  segurança e de publicar o site errado.
- **Decisão:** remover `gh-pages` e comandos locais de deploy; preparar um
  workflow manual que constrói `v2/dist`, exige SHA completo, confirmação
  booleana, branch `main`, quality gates e environment `github-pages`.
- **Evidência:** audit zerado e preflight em `docs/evidence/p9/`. Antes de
  commit, a inspeção externa confirmou que `baltz.dev` é servido pela Vercel e
  que Pages não possui custom domain; o workflow proposto foi removido.
- **Alternativa rejeitada:** atualizar o pacote e manter publicação local em
  branch, ou disparar deploy automaticamente em push.
- **Revalidar quando:** somente se o hosting voltar deliberadamente a GitHub
  Pages. D-0020 é a decisão vigente.

## D-0019 - CSS crítico inline para margem de LCP

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** o primeiro preflight P9 mediu LCP mobile entre 2,559 e 2,576 s;
  a folha CSS crítica custava 153–159 ms e bloqueava o gate.
- **Decisão:** usar `build.inlineStylesheets: "always"`. Com apenas home + 404,
  a duplicação é menor que o custo/risco da requisição render-blocking.
- **Evidência:** após a mudança, LCP mobile 2,268/2,255/2,256 s, desktop
  492/569/567 ms e zero recurso render-blocking em seis relatórios P9.
- **Alternativa rejeitada:** relaxar o budget de 2,5 s, aceitar variância sem
  margem ou reescrever a direção do hero.
- **Revalidar quando:** o site ganhar múltiplas rotas ou o CSS crescer a ponto
  de a duplicação superar o benefício.

## D-0020 - Vercel como hosting real do launch

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** uma inspeção externa autorizada mostrou que `baltz.dev` e
  `www.baltz.dev` são aliases verificados do projeto Vercel
  `rvnn/baltazarparra-github-io`. O GitHub Pages permanece em modo legado,
  branch `gh-pages`, sem custom domain, e não serve o domínio final.
- **Decisão:** manter a integração Git/Vercel existente e versionar um
  `vercel.json` raiz que instala pelo lockfile, constrói apenas
  `@baltz/site-v2` e publica `v2/dist`. CI valida, mas não faz deploy. Preview,
  promoção e produção continuam exigindo autorização explícita.
- **Evidência:** snapshot read-only e build local Vercel em
  `docs/evidence/p9/`; `.vercel/output/static` idêntico a `v2/dist`.
- **Alternativa rejeitada:** migrar o domínio para GitHub Pages com base numa
  premissa histórica ou manter dois mecanismos concorrentes de publicação.
- **Revalidar quando:** o projeto Vercel, a integração Git, a branch de produção
  ou o provedor de hosting mudar.

## D-0021 - Apex como domínio primário

- **Data:** 15 jul. 2026
- **Status:** proposta
- **Contexto:** a v2 aprovada emite canonical, sitemap, robots e OG para
  `https://baltz.dev/`, mas a configuração Vercel observada redireciona o apex
  com 308 para `https://www.baltz.dev/`.
- **Decisão:** no launch, tornar `baltz.dev` primário e redirecionar `www` para
  o apex, preservando o canonical já validado. Não alterar antes de autorização
  específica e snapshot de rollback.
- **Evidência:** headers HTTP, DNS e configuração de domínios registrados em
  `docs/evidence/p9/hosting-snapshot.json`.
- **Alternativa rejeitada:** publicar com canonical divergente do domínio
  efetivamente primário; trocar toda a metadata da v2 para `www` sem decisão.
- **Revalidar quando:** Baltz decidir que `www` deve ser a identidade pública ou
  a configuração de domínio mudar antes da janela.

## D-0022 - Rework preserva C2 e substitui a composição do P3

- **Data:** 15 jul. 2026
- **Status:** aceita como requisito; composição R3 em validação
- **Contexto:** após o launch candidate anterior, Baltz avaliou a página como
  sem impacto, com pouca vida, retrato superdimensionado e ausência do embed do
  Spotify. Também especificou cortes exatos de copy, remoção do header e
  superfícies líquidas comparáveis à referência 14islands.
- **Decisão:** preservar o conceito C2 The Edit, grafite, Instrument Sans,
  radius zero e assimetria, mas substituir a composição do P3 pelo rework R3.
  O novo baseline não tem header, reduz o retrato, torna componentes com links
  integralmente clicáveis e inclui o embed real de Clouds. O embed supersede a
  rejeição condicional registrada em D-0015; ele será lazy e nunca autoplay.
- **Evidência:** briefing explícito do Baltz e protótipo isolado em
  `docs/prototypes/r3-rework/`.
- **Alternativa rejeitada:** apenas polir a composição antiga ou adicionar mais
  efeitos sobre a mesma hierarquia.
- **Revalidar quando:** Baltz aprovar ou rejeitar o gate visual R3, ou o embed
  demonstrar custo incompatível com os budgets na validação R7.

## D-0023 - Um renderer substitui os islands React/Three da home

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** a composição R3 aprovada precisava chegar ao Astro sem
  reintroduzir o custo do GLB, dois contextos e chunks React/Three que tornaram
  a primeira versão lenta.
- **Decisão:** a home usa um módulo WebGL próprio com um contexto e três
  programas para campo, Smile e retrato. O Smile consome o binário quantizado
  de 77,8 KB. A integração Astro React e os islands antigos foram removidos do
  build; reduced motion não inicializa WebGL e preserva posters DOM.
- **Evidência:** `astro check`, lint e build limpos; bundle da home 16,8 KB sem
  chunk React; verificação Playwright em desktop, mobile e reduced motion.
- **Alternativa rejeitada:** otimizar os dois islands existentes ou carregar o
  GLB antigo depois do primeiro paint.
- **Revalidar quando:** o renderer ganhar uma nova superfície, o browser perder
  contexto ou RUM demonstrar regressão de frame time.

## D-0024 - Superfícies líquidas compartilham programa e assets locais

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** retrato e capa de Clouds precisam da mesma resposta líquida sem
  multiplicar contextos, shaders ou depender de CORS do Spotify CDN.
- **Decisão:** generalizar o programa de mídia do renderer para uma lista de
  superfícies com textura e estado de ponteiro independentes. Retrato e Clouds
  usam o mesmo draw path; a capa 640 × 640 é servida localmente. O embed permanece
  lazy, sem autoplay, com link externo sempre disponível como fallback.
- **Evidência:** um canvas, três programas e duas superfícies reportados no
  preview; desktop/mobile sem overflow e sem erro de console.
- **Alternativa rejeitada:** segundo canvas para Clouds, CSS displacement
  aproximado ou textura remota sujeita a CORS.
- **Revalidar quando:** entrar uma terceira mídia, o custo de upload de textura
  afetar o primeiro paint ou o embed mudar sua política de carregamento.

## D-0025 - Touch e motion preservam o mesmo conteúdo sem efeitos presos

- **Data:** 15 jul. 2026
- **Status:** aceita
- **Contexto:** a composição precisava funcionar a partir de 320 px, manter
  alvos acessíveis e responder a mudanças de `prefers-reduced-motion` durante a
  sessão, não apenas no carregamento.
- **Decisão:** restringir hover visual a ponteiros finos, usar feedback `active`
  no touch, garantir alvos mínimos de 24 px e restaurar posters DOM sempre que
  reduced motion for ativado. O renderer pode retomar quando a preferência
  volta a motion completo.
- **Evidência:** Playwright em 320/360/390/768 px sem overflow ou alvos menores
  que 24 px; sequência de foco com outline; motion dinâmico preservando Smile,
  retrato e Clouds; sem links vazios ou imagens sem alt.
- **Alternativa rejeitada:** desativar apenas animações CSS ou manter hover
  global e aceitar estado preso em touch.
- **Revalidar quando:** a navegação ganhar controles novos, houver mudança na
  mídia query de capability ou a página receber formulários.

## Template para próximas decisões

## D-XXXX — Título

- **Data:**
- **Status:** proposta | aceita | rejeitada | substituída
- **Contexto:**
- **Decisão:**
- **Evidência:**
- **Alternativa rejeitada:**
- **Revalidar quando:**
