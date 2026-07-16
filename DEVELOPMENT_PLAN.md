# Plano de desenvolvimento — baltz.dev

> Status: o site Astro foi promovido à raiz do repositório; as menções a “v2”
> abaixo são contexto histórico do plano, não uma segunda aplicação ativa.

> **Status:** em execução; P0 a P8 concluídos em 15 jul. 2026. P8 fechou com
> riscos de cobertura física/manual aceitos; a preparação local do P9 está
> autorizada e o site atual permanece intocado.
> **Fonte de escopo:** `ROADMAP.md`, revisado em 15 jul. 2026.
> **Regra de operação:** executar uma fase por vez; nenhum gate é concluído sem
> a evidência descrita neste documento.

## Objetivo controlável

Entregar uma one-page autoral, acessível, performática e preparada para
submissão ao Awwwards, sem interromper ou reescrever o site atual antes do
launch aprovado. O resultado deve ser forte mesmo sem animação e continuar
usável quando WebGL, smooth scroll ou motion estiverem indisponíveis.

Ganhar SOTD ou Developer Award é uma ambição, não uma condição que o projeto
consiga garantir.

## Modelo de execução

- O `ROADMAP.md` define visão, escopo e barra de qualidade.
- Este arquivo define ordem, dependências, entregáveis e gates.
- `docs/decision-log.md` registrará decisões relevantes, evidências,
  alternativas rejeitadas e validação.
- `docs/qa.md` concentrará a evidência final.
- A produção atual permanece intocada até autorização explícita.
- Preview, deploy, compra e submissão externa sempre exigem aprovação.
- Mudança aprovada em um gate não é relitigada sem evidência nova ou regressão.

## Trilhas de trabalho

### Trilha principal — v2

Pesquisa → brief → conceito → direção de arte/copy → motion → stack/vertical
slice → produção → polish → QA → launch → observação/submissão.

### Trilha independente — correções do site atual

SEO e metadados podem ser corrigidos sem esperar a v2, mas só depois de
autorização específica do Baltz. Essa trilha não pode alterar layout, motion ou
conteúdo fora do backlog aprovado.

## Correspondência com o roadmap

| Plano | Roadmap | Função |
|---|---|---|
| P0 | Pré-condição adicionada | Baseline e governança |
| P1 | Fase 0 | Catálogo de padrões |
| P2 | Fase 1 | Brief e conceito |
| P3 | Fase 2 | Copy e direção de arte |
| P4 | Fase 3 | Motion concept e protótipos |
| P5 | Fase 4 | Stack, isolamento e vertical slice |
| P6 | Fase 5 | Produção completa |
| P7 | Fase 6 | Polish e costuras |
| P8 | Fase 7 | Hardening e QA |
| P9–P10 | Fase 8 | Launch, observação e submissão |

## Fases executáveis

### P0 — Baseline e governança

**Estado:** concluído em 15 jul. 2026. Evidências em `docs/baseline.md`,
`docs/qa.md` e `docs/evidence/p0/`.

**Entrada**

- Roadmap revisado.
- Repositório atual acessível.

**Execução**

1. Criar `docs/decision-log.md`, `docs/qa.md` e estrutura de evidências.
2. Registrar commit/branch, dependências, browsers e ambiente de medição.
3. Rodar lint e build sem corrigir automaticamente resultados.
4. Medir bundles, Lighthouse em três execuções, acessibilidade e performance
   inicial.
5. Capturar screenshots desktop/mobile e reduced-motion do site atual.
6. Registrar débitos conhecidos sem transformar o baseline em redesign.

**Entregáveis**

- `docs/baseline.md`.
- Estrutura documental inicial.
- Evidências reproduzíveis do estado atual.

**Gate P0**

- Baseline executável por outra pessoa.
- Nenhuma alteração em produção.
- Falhas de ambiente documentadas e resolvidas ou aceitas para seguir.

---

### P1 — Catálogo de padrões e antirrepertório

**Estado:** concluído em 15 jul. 2026. S1 e S8 foram preferidas; S3–S7 foram
rejeitadas; S2 permaneceu neutra. Registro em `docs/padroes.md`.

**Entrada**

- Baseline concluído.
- Inventário fixo da one-page.

**Execução**

1. Catalogar referências para hero, about, writing, projects, Caipora,
   Clouds, connect e footer.
2. Catalogar costuras: entrada, scroll, transições, cursor, loading e 404.
3. Para cada padrão, registrar princípio, adequação ao conteúdo, implementação,
   licença, custo provável e riscos.
4. Identificar soluções distintivas que não podem ser copiadas.
5. Registrar pelo menos cinco clichês que a v2 deve evitar.
6. Montar uma shortlist visual para revisão do Baltz.

**Entregáveis**

- `docs/padroes.md`.
- Primeiras entradas de `docs/decision-log.md`.

**Gate P1**

- Todas as seções e costuras estão cobertas.
- Fontes essenciais são verificáveis e duráveis.
- Baltz registra referências preferidas e rejeitadas.

---

### P2 — Brief e conceito

**Estado:** concluído em 15 jul. 2026. C2, The Edit, foi aprovado explicitamente
e registrado em `docs/conceito.md`.

**Entrada**

- Catálogo aprovado.
- Respostas do Baltz sobre público, sensação, lembrança e protagonismo dos
  elementos autorais.

**Execução**

1. Consolidar o brief em objetivos e restrições observáveis.
2. Criar três conceitos candidatos, cada um descritível em uma frase.
3. Definir para cada candidato o arco de scroll, hero, showcases, loader e
   404.
4. Avaliar memorabilidade, aderência ao público, acessibilidade, performance e
   risco de execução.
5. Refinar ou combinar candidatos somente com direção explícita do Baltz.

**Entregáveis**

- `docs/conceito.md`.
- Matriz comparativa dos três candidatos.

**Gate P2**

- Um conceito aprovado explicitamente.
- A frase-mãe decide as principais costuras sem explicações adicionais.

---

### P3 — Copy, direção de arte e tokens

**Estado:** concluído em 15 jul. 2026. Direção, copy inicial, tokens e frames
foram validados e aprovados explicitamente pelo Baltz. O site atual permanece
intocado.

**Entrada**

- Conceito aprovado.
- Conteúdo atual inventariado.

**Execução**

1. Produzir primeira versão da copy em inglês, sem placeholders.
2. Criar frames desktop/mobile de hero, conteúdo, showcase, connect/footer e
   404.
3. Definir grid, tipografia, paleta, superfícies e hierarquia visual.
4. Verificar licença e estratégia de self-host da tipografia.
5. Definir tokens agnósticos de stack para cor, tipo, spacing, z-index e motion.
6. Validar contraste, reflow e legibilidade em WCAG 2.2 AA.
7. Avaliar os frames sem motion; se parecerem template, iterar.

**Entregáveis**

- `docs/direcao-de-arte.md`.
- Copy v1.
- Frames estáticos.
- Arquivo canônico de tokens.

**Gate P3**

- Frames e copy inicial aprovados.
- Contraste AA comprovado.
- Licenças registradas.
- Tokens sem duplicação entre CSS e shader.

---

### P4 — Motion concept e protótipos

**Estado:** concluído em 15 jul. 2026. Pinned Edit, Cut/Settle limitados, Words
fora do sistema global, som fora, budgets e fallbacks foram aprovados
explicitamente pelo Baltz.

**Entrada**

- Direção de arte e tokens aprovados.
- Device/browsers de referência definidos.

**Execução**

1. Criar harness descartável, sem acoplar a produção atual.
2. Construir dois ou três protótipos do arco completo de scroll.
3. Incluir touch e reduced-motion desde o protótipo.
4. Medir FPS, frame time p50/p95, long tasks, memória e inicialização.
5. Registrar ambiente, throttling e traces usados.
6. Remover ou simplificar efeitos que excedam os budgets.
7. Definir easings, durações e staggers finais como tokens.

**Entregáveis**

- Protótipos descartáveis.
- `docs/motion-concept.md`.
- Budgets de runtime.

**Gate P4**

- Uma coreografia aprovada.
- Evidência de performance reproduzível.
- Fallbacks definidos para motion reduzido, touch e baixa capacidade.

---

### P5 — Stack, isolamento e vertical slice

**Estado:** concluído em 15 jul. 2026. Stack, isolamento e domínio foram
aprovados; a vertical slice passou nos budgets e está documentada em
`docs/evidence/p5/`.

**Entrada**

- Requisitos revelados pelos protótipos.
- Aprovação do Baltz para stack e modelo de isolamento.

**Execução**

1. Comparar stacks por SEO, acessibilidade, manutenção, hosting, performance e
   adequação aos protótipos.
2. Decidir TypeScript e estratégia de conteúdo.
3. Criar a codebase isolada sem apagar ou reescrever o site atual.
4. Configurar lint, build, CI e budgets.
5. Implementar tokens como fonte para CSS e uniforms.
6. Portar somente assets aprovados e registrar origem/licença.
7. Construir vertical slice com hero, navegação, transição, showcase, shader,
   tiers e reduced-motion.
8. Rodar Lighthouse três vezes e registrar mediana/dispersão.

**Entregáveis**

- `docs/stack.md`.
- Codebase v2 isolada.
- Vertical slice representativa.

**Gate P5**

- Stack e isolamento aprovados.
- Build e lint limpos.
- Vertical slice cumpre budgets e requisitos de acessibilidade.
- Preview externo somente se autorizado.

---

### P6 — Produção da one-page

**Estado:** concluído em 15 jul. 2026. O inventário editorial foi confirmado,
a one-page completa passou nos fallbacks, teclado e budgets; evidências em
`docs/evidence/p6/`.

**Entrada**

- Vertical slice aprovada.
- Copy em revisão final.

**Execução**

1. Implementar estrutura, navegação e conteúdo completo primeiro.
2. Construir mobile/touch e teclado junto com desktop.
3. Integrar Writing, Projects, Caipora, Clouds e Connect.
4. Congelar a copy antes do ajuste fino de layout e motion.
5. Aplicar a coreografia aprovada sem criar novos padrões fora do conceito.
6. Verificar estados sem WebGL, sem JavaScript pesado e com reduced-motion.
7. Rodar lint, build e checks de regressão por incremento.

**Entregáveis**

- One-page completa.
- Conteúdo final versionado.
- Matriz de fallbacks implementada.

**Gate P6**

- Zero placeholder e zero link morto.
- Página completa em desktop/mobile e navegável por teclado.
- Build de produção limpo.

---

### P7 — Polish e costuras

**Estado:** concluído em 15 jul. 2026. O walkthrough foi aprovado explicitamente
pelo Baltz; evidências em `docs/evidence/p7/`.

**Entrada**

- Página completa e estável.

**Execução**

1. Implementar loader apenas se a medição justificar espera perceptível.
2. Finalizar microinterações, foco, hover, press e touch.
3. Construir 404 e comportamento de retorno.
4. Finalizar reduced-motion com direção própria.
5. Implementar estados de loading, timeout e erro para assets pesados.
6. Avaliar embed do Spotify, privacidade e click-to-load.
7. Adicionar som somente se aprovado e sempre opt-in.

**Entregáveis**

- Experiência completa de load a 404.
- Walkthrough desktop/mobile/reduced-motion.

**Gate P7**

- Walkthrough aprovado pelo Baltz.
- Nenhum estado crítico sem fallback ou recuperação.

---

### P8 — Hardening e QA

**Estado:** concluído em 15 jul. 2026. Safari/iOS real, Android intermediário
real e leitor de tela manual não foram executados; Baltz aceitou explicitamente
esses riscos. Evidências em `docs/evidence/p8/`; checklist de launch e rollback
em `docs/`.

**Entrada**

- Polish concluído.
- Matriz de browsers/devices disponível.

**Execução**

1. Testar Chrome, Safari e Firefox em desktop/mobile aplicável.
2. Testar em Android intermediário real definido e iOS disponível.
3. Validar teclado, foco, screen reader, contraste, zoom, reflow e alt text.
4. Executar Lighthouse, Performance traces e testes de budgets.
5. Validar canonical, OG, Twitter, sitemap, robots e dados estruturados.
6. Revisar carregamento de terceiros, cookies e privacidade.
7. Convidar revisores externos indicados pelo Baltz, se disponíveis.
8. Corrigir pendências ou registrar aceite de risco explícito.

**Entregáveis**

- `docs/qa.md` completo.
- Evidências finais organizadas.
- Plano de rollback e checklist de launch.

**Gate P8**

- Checklist 100% verde ou riscos aceitos por escrito.
- Aprovação explícita para preparar produção.

---

### P9 — Launch controlado

**Estado:** candidato local concluído em 15 jul. 2026. A captura externa
read-only confirmou Vercel como hosting, registrou deployment/domínios/DNS e
substituiu a hipótese GitHub Pages. Artifact gate, build Vercel local, audit e
budgets estão em `docs/evidence/p9/`. Commit, push/Preview e produção seguem
separados por autorização.

**Entrada**

- QA aprovado.
- Domínio e hosting confirmados; janela de launch aprovada.

**Execução**

1. Criar commit imutável e, após autorização específica, gerar Preview pela
   integração Git/Vercel.
2. Validar Preview e ensaiar rollback ao deployment capturado.
3. Alinhar o redirect `www` → apex ao canonical aprovado, somente com
   autorização de mudança externa.
4. Promover/mesclar somente o SHA aprovado e fazer smoke imediatamente.
5. Verificar 404, assets, social cards e analytics/RUM aprovado.
6. Corrigir apenas problemas de launch; mudanças criativas voltam ao fluxo de
   decisão.

**Entregáveis**

- v2 no domínio final.
- Registro de launch e smoke test.

**Gate P9**

- Produção estável e rollback disponível.
- Início formal do período de observação.

---

### P10 — Observação, making-of e submissão

**Entrada**

- Produção estável.
- Dados reais suficientes para avaliar regressões.

**Execução**

1. Acompanhar Web Vitals, erros e feedback durante o período acordado.
2. Corrigir regressões e repetir checks afetados.
3. Escrever making-of com decisões, referências e resultados reais.
4. Produzir screenshots e descrição da submissão.
5. Revalidar regras, categorias e preços de cada premiação.
6. Submeter somente após aprovação e autorização de pagamento.

**Entregáveis**

- Making-of.
- Pacote de submissão.
- Registro das submissões autorizadas.

**Gate P10**

- Submissão enviada com aprovação explícita do Baltz.

## Checkpoints que pertencem ao Baltz

1. **Após P1:** referências preferidas e rejeitadas.
2. **No início de P2:** público, sensação e lembrança; os conceitos propõem a
   hierarquia de fogo, smile, Caipora e Clouds.
3. **Após P2:** conceito final.
4. **Após P3:** frames, copy inicial e direção de arte.
5. **Após P4:** motion concept e eventual som.
6. **Em P5:** stack, TypeScript, isolamento, hosting e autorização de preview.
7. **Em P6:** copy final e inventário definitivo de posts/projetos.
8. **Antes de P9:** data, domínio e autorização de launch.
9. **Antes de P10:** orçamento, estratégia e autorização de submissão.

## Evidência mínima por gate

- **Decisão criativa:** frame/protótipo + racional no decision log.
- **Performance:** número + ambiente + trace ou relatório reproduzível.
- **Acessibilidade:** teste automatizado + verificação manual aplicável.
- **Compatibilidade:** browser/device/versão e resultado registrado.
- **Conteúdo:** texto final sem placeholder e aprovação do Baltz.
- **Publicação:** URL, smoke test, rollback e aprovação explícita.

## Riscos principais

| Risco | Sinal antecipado | Resposta |
|---|---|---|
| Conceito vira coleção de efeitos | Protótipos não compartilham narrativa | Voltar ao manifesto e remover efeitos |
| Referência vira cópia | Similaridade depende de composição distintiva | Preservar princípio, redesenhar expressão |
| WebGL domina conteúdo | Texto/navegação perdem legibilidade | Rebaixar shader e validar frame estático |
| Performance cai tarde | Budgets falham após integração | Medir desde vertical slice e por incremento |
| Mobile vira fallback pobre | Touch/reduced-motion entram só no QA | Projetar ambos desde P3/P4 |
| Copy quebra layout | Texto muda após polish | Congelar copy antes do ajuste fino |
| Loader mascara lentidão | Tempo artificial ou progresso falso | Mostrar apenas para espera real e medida |
| Preview altera produção | Hosting/branch mal isolados | Aprovar isolamento antes do primeiro deploy |
| Métrica de laboratório é tratada como campo | Lighthouse vira único critério | Separar lab, device real e RUM/CrUX |

## Próxima ação

Criar o commit do release candidato. Antes do push, obter autorização explícita
para o Preview que a integração Git/Vercel pode criar. Depois validar esse
Preview, ensaiar rollback ao deployment capturado, decidir a inversão do
redirect `www` → apex e pedir autorização final de produção para um SHA exato.

Não há cronograma fechado neste documento. Datas dependem da data-alvo de
launch, disponibilidade do Baltz para os checkpoints e acesso aos devices de
teste.
