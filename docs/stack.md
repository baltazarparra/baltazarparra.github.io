# P5 — stack, isolamento e fundação implementados

> **Estado:** gate concluído em 15 jul. 2026. Fundação e vertical slice estão
> em `v2/`; nenhum preview externo ou deploy foi criado.

## Decisão proposta

Adotar uma saída estática em **Astro + TypeScript estrito**, usando HTML/Astro
para toda a estrutura e conteúdo e **React/R3F apenas como ilhas** para o Smile
3D e o shader. GSAP + ScrollTrigger coordena Pinned Edit sobre scroll nativo;
Lenis não entra na fundação.

Criar a v2 em `v2/`, como pacote independente do workspace pnpm deste mesmo
repositório. O site React/Vite atual continua na raiz, com scripts, `src/`,
`public/` e `dist/` intocados. A v2 usa `v2/dist/` e histórico Git normal — sem
branch órfã e sem reescrita de histórico.

Na decisão original de P5, GitHub Pages seria o alvo estático de launch. A
inspeção externa de P9 comprovou que o domínio já é servido pela Vercel; essa
parte da decisão foi substituída por D-0020. P5 continuou sem deploy externo.

O domínio canônico aprovado é `https://baltz.dev/`, com `www` redirecionando
para o apex e `baltazarparra.github.io` como origem de hosting, não como
canonical. DNS e redirects só serão alterados no launch autorizado.

## Requisitos que governam a escolha

1. One-page + 404, sem backend, CMS, autenticação ou conteúdo em runtime.
2. Conteúdo e navegação devem existir antes e sem WebGL.
3. The Edit precisa de motion global, mas só Smile e shader exigem React/Three.
4. O baseline atual transfere cerca de 708 kB e deixa Three no caminho inicial;
   o Lighthouse mobile mediano foi 52, com 11,7 s de TBT no ambiente descrito.
5. Pinned Edit passou no harness com scroll nativo. Não existe evidência de que
   smooth scroll seja necessário.
6. O build final precisa ser compatível com hosting estático e com uma página
   404 real.

## Comparação das stacks

| Critério | Astro estático + ilhas | Vite + React SPA | Next com static export |
|---|---|---|---|
| HTML inicial | Estrutura e copy saem como HTML; JS só nas ilhas | Na arquitetura atual, a interface depende do bundle React | Gera HTML estático, inclusive 404 |
| Limite de hidratação | Explícito por `client:*` | React hidrata/monta a aplicação inteira | Exige separar Server e Client Components |
| React/R3F | Integração oficial; preserva componentes selecionados | Caminho mais direto e familiar | Funciona em Client Components |
| Motion global | Script TypeScript com GSAP; independente das ilhas | Direto em React, com lifecycle adicional | Funciona, com fronteiras client/server adicionais |
| Hosting estático | Saída `dist/`; GitHub Pages documentado | Saída `dist/`; GitHub Pages documentado | Saída `out/`, mas recursos de servidor ficam indisponíveis |
| Adequação ao escopo | Forte: página editorial com poucas ilhas pesadas | Possível, mas mantém uma casca SPA que o conteúdo não exige | Possível, porém suas capacidades de servidor/rotas não são necessárias |
| Custo de migração | Médio e seletivo | Baixo, com menor mudança estrutural | Alto sem benefício proporcional neste escopo |
| Risco principal | Criar ilhas grandes demais e perder a vantagem | Repetir o débito de JS e inicialização atual | Complexidade acidental e fronteiras client/server |

### Conclusão crítica

Vite não é rejeitado por incapacidade. Ele continua excelente para o harness e
para aplicações client-side, mas a arquitetura atual é uma SPA onde quase todo
o conteúdo poderia ser HTML estático. Manter essa casca por familiaridade não
resolve o débito dominante do baseline.

Next também gera export estático, mas o projeto não usa rotas dinâmicas,
Server Actions, APIs, dados no servidor ou otimização de imagem dependente de
runtime. Adotar essas fronteiras sem usar suas vantagens aumenta a superfície
de manutenção.

Astro oferece a fronteira que o projeto já pede: documento estático primeiro e
hidratação apenas para as duas experiências WebGL. A escolha não garante
performance; ela torna o custo identificável e auditável por ilha.

## Arquitetura proposta

```text
v2/
├── public/                  # somente assets aprovados e locais
├── src/
│   ├── components/         # componentes Astro sem runtime por padrão
│   ├── islands/
│   │   ├── SmileScene.tsx  # React/R3F; hidratação medida
│   │   └── ThermalField.tsx
│   ├── data/site.ts        # inventário tipado e copy versionada
│   ├── layouts/
│   ├── lib/
│   │   ├── motion/         # GSAP/ScrollTrigger e fallbacks
│   │   ├── quality/        # tiers e capability detection
│   │   └── tokens/         # adaptadores CSS/uniforms
│   ├── pages/
│   │   ├── index.astro
│   │   └── 404.astro
│   └── styles/
├── astro.config.ts
├── eslint.config.js
├── package.json
└── tsconfig.json
```

O DOM, os headings, a navegação e a copy pertencem aos componentes Astro. Uma
falha de React, Three, shader ou modelo não remove conteúdo nem links. As ilhas
são decorativas/enriquecedoras e recebem fallback estático dirigido.

### Hidratação implementada

- `SmileScene`: o hero começa com um smile gráfico em CSS. React, R3F, Three e
  `smile.glb` só são importados depois de intenção real por mouse ou caneta.
- `ThermalField`: uma fronteira Astro observa a faixa fora da primeira dobra e
  importa a ilha somente em desktop sem touch; não há runtime React no fallback.
- Touch mantém o poster; reduced motion e tier sem WebGL mantêm fallbacks
  estáticos. O documento sem JavaScript preserva copy, navegação e mídia.
- React não será usado para seções editoriais, navegação ou dados estáticos.

### Motion e scroll

- GSAP + ScrollTrigger permanece porque P4 já validou a coreografia com ele.
- Scroll é nativo. Lenis fica fora até existir defeito reproduzível que ele
  resolva sem prejudicar teclado, touch, reduced motion ou custo de runtime.
- O CSS não começa com conteúdo oculto. GSAP melhora estados já legíveis.
- Pinned Edit só usa pin em desktop/fine pointer; touch recebe fluxo sem pin.

### TypeScript e conteúdo

TypeScript estrito é recomendado e faz parte do pacote proposto. Ele protege as
fronteiras de maior risco: tokens, uniforms, configuração de tiers, lifecycle
de WebGL, catálogo de assets e estrutura do conteúdo. O build usará
`astro check && astro build`, porque `astro build` transpila TypeScript, mas não
faz type-check por si só.

O conteúdo ficará em `src/data/site.ts`, com tipos simples e zero CMS/Content
Collections. O inventário é pequeno, fixo e não contém posts locais ou casos
longos; adicionar uma camada editorial agora não resolve requisito existente.
Toda a copy é incorporada ao HTML no build.

### Tokens

`docs/design-tokens.json` permanece como fonte canônica. Um adaptador de build
validará o schema e produzirá:

- CSS custom properties para layout, cor, tipo e motion;
- objeto TypeScript para easings, tiers e uniforms;
- teste de paridade que falha se um token necessário estiver ausente.

Não haverá segunda paleta escrita dentro do GLSL.

## Isolamento comparado

| Modelo | Vantagem | Custo/risco | Decisão proposta |
|---|---|---|---|
| `v2/` no mesmo repo | Execução lado a lado, histórico e evidências juntos, port explícito de assets | Requer filtros e saídas separadas | **Adotar** |
| Novo repositório | Isolamento físico máximo | Divide histórico, issues, assets e coordenação de domínio/Pages | Não adotar sem necessidade de lifecycle independente |
| Branch órfã | Histórico novo no mesmo remoto | Impede comparação lado a lado e aumenta risco de branch/deploy errado | Rejeitar |

Após aprovação, `pnpm-workspace.yaml` passa a incluir somente `v2` como pacote
adicional. Os comandos da v2 serão filtrados e nunca reutilizarão o `dist/` da
raiz. Antes de qualquer alteração de hosting, o build atual continuará sendo a
fonte publicada.

## Dependências implementadas

- Base: Astro 7.0.9, TypeScript 5.9.3, ESLint 10.5.0,
  `@astrojs/check` 0.9.9 e integração React 6.0.1.
- Runtime visual: React 19.2.7, Three r184, R3F 9.6.1 e GSAP 3.13.0.
- Drei, post-processing, Lenis e bibliotecas de UI não entraram na fundação.
- O lockfile registra as versões resolvidas; Astro e as ferramentas de check
  críticas foram fixados explicitamente.

Instrument Sans foi portada com a licença OFL e reduzida aos caracteres ASCII
usados pela copy inglesa. O WOFF2 caiu de 87 kB para 50.556 bytes. Os demais
assets são cópias auditadas do site atual; a raiz publicada não foi alterada.

## Sequência executável depois da aprovação

1. Criar `v2/` e registrar o pacote no workspace, sem tocar na aplicação atual.
2. Configurar Astro estático, TypeScript strict, ESLint, `astro check` e build.
3. Criar a casca sem JS: landmarks, skip link, anchors, hero e 404.
4. Integrar tokens canônicos em CSS e TypeScript, com validação de paridade.
5. Portar Instrument Sans e os assets aprovados, registrando origem/licença.
6. Implementar GSAP global com Pinned Edit e todos os fallbacks de P4.
7. Portar Smile como primeira ilha R3F e medir hidratação/inicialização.
8. Portar um shader mínimo sob tiers como segunda ilha; sem background eterno
   no caminho crítico.
9. Completar a vertical slice com hero, nav, transição e showcase Caipora.
10. Rodar lint, type-check, build, smoke de teclado/reduced motion/sem WebGL,
    traces e três Lighthouse por perfil.
11. Comparar os números com o baseline e com os budgets abaixo; simplificar
    antes de pedir aprovação do gate.

## Budgets iniciais da vertical slice

P4 mediu motion isolado; P5 adiciona rede, parse, hidratação, Three e assets.
Por isso os budgets abaixo são contratos iniciais e qualquer exceção exige
evidência e aceite explícito.

| Área | Budget P5 |
|---|---:|
| Lighthouse Performance, mediana de 3 | >= 90 desktop; >= 80 mobile simulado |
| Accessibility / Best Practices / SEO automatizados | 100 / 100 / 100 |
| LCP de laboratório | <= 2,5 s mobile; <= 1,5 s desktop |
| CLS | <= 0,05 |
| TBT | <= 200 ms mobile; <= 100 ms desktop |
| JS inicial da casca, gzip | <= 75 kB, excluindo ilhas WebGL adiadas |
| JS adicional até o primeiro WebGL-ready, gzip | <= 350 kB; carregamento adiado e medido |
| `smile.glb` transferido | <= 220 kB; não bloqueia conteúdo nem LCP |
| Frame time p95 durante scroll | <= 20 ms |
| Long tasks durante percurso de scroll | 0 acima de 50 ms após motion-ready |
| Erros de console e falhas de asset não tratadas | 0 |

## Resultado da vertical slice

| Área | Resultado P5 | Gate |
|---|---:|---|
| Lighthouse Performance, mediana de 3 | 100 desktop; 97 mobile | Passou |
| Accessibility / Best Practices / SEO | 100 / 100 / 100 nos 6 relatórios | Passou |
| LCP, mediana | 0,526 s desktop; 2,414 s mobile | Passou |
| CLS | 0 nos 6 relatórios | Passou |
| TBT | 0 ms mediano; máximo mobile 5 ms | Passou |
| JS externo inicial da casca, gzip | 46.710 bytes | Passou |
| JS adicional compartilhado/WebGL, gzip | aproximadamente 307 kB | Passou |
| `smile.glb` | 216.936 bytes; carregado por intenção | Passou |
| Frame time p95, mediana | 16,8 ms desktop; 16,7 ms mobile | Passou |
| Long tasks no percurso | 0 em 7 execuções | Passou |
| Console/falhas de request no smoke | 0 em 4 perfis | Passou |

Relatórios, screenshots, resultados brutos e limitações estão em
`docs/evidence/p5/`. A medição usa Chrome 149 headless e SwiftShader; Android,
Safari/iOS e Firefox reais continuam deliberadamente no P8.

Os valores de Lighthouse são laboratório, não substituem Core Web Vitals de
campo. Android intermediário, Safari/iOS e Firefox continuam pertencendo ao
gate P8; a vertical slice deve ser simplificada se já falhar no laboratório.

## Gate de decisão antes do scaffold

Pacote aprovado explicitamente pelo Baltz em 15 jul. 2026:

1. Astro estático + TypeScript estrito + ilhas React/R3F;
2. GSAP/ScrollTrigger com scroll nativo e sem Lenis na fundação;
3. `v2/` como pacote isolado neste repositório, sem branch órfã;
4. GitHub Pages como hipótese de hosting estático, depois substituída por
   Vercel em D-0020, sem deploy durante P5;
5. `https://baltz.dev/` como domínio canônico.

## Fontes oficiais

- [Astro — front-end frameworks e diretivas de hidratação](https://docs.astro.build/en/guides/framework-components/)
- [Astro — TypeScript e `astro check`](https://docs.astro.build/en/guides/typescript/)
- [Astro — deploy estático e GitHub Pages](https://docs.astro.build/en/guides/deploy/)
- [Vite — deploy estático no GitHub Pages](https://vite.dev/guide/static-deploy.html)
- [Next.js — static exports e limitações](https://nextjs.org/docs/app/guides/static-exports)
- [GitHub — o que é GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages)
