# Execution Plan - Home Writing and Projects

Status: Ready for execution
Related PRD: [PRD-home-content-sections.md](./PRD-home-content-sections.md)
Data: 2026-04-05

## 1. Goal

Executar a PRD em pequenos passos seguros, mantendo a home sempre utilizavel e validando cada camada antes de abrir a proxima.

## 2. Execution principles

- mudar uma preocupacao por vez
- manter a home compilando ao fim de cada etapa
- validar estrutura antes de refinar estilo
- validar estilo antes de animar
- evitar acoplar dados, layout e animacao no mesmo passo
- deixar rollback simples, com alteracoes pequenas e localizadas

## 3. Recommended order

### Etapa 0 - Preparacao

Objetivo:

- alinhar a implementacao com a PRD antes de tocar layout

Acao:

- reler a PRD
- confirmar conteudo final dos 3 posts
- confirmar conteudo final dos 3 projetos
- definir a estrategia local de dados

Entregavel:

- lista final de dados pronta para codificar

Validacao:

- nomes, descricoes e links batem com a PRD
- nao ha ambiguidade sobre quantidade de itens

Gate para seguir:

- `WRITING` com 3 posts de 2026
- `PROJECTS` com `guia`, `dark-pixels` e `crypto-transfer`

### Etapa 1 - Camada de dados

Objetivo:

- isolar o conteudo em uma fonte local simples e reutilizavel

Acao:

- criar `src/data/homeContent.js`
- modelar duas colecoes:
  - `writingPosts`
  - `featuredProjects`
- incluir apenas os campos necessarios para renderizacao

Entregavel:

- arquivo de dados local funcionando

Validacao:

- estrutura dos objetos e consistente
- todos os itens possuem titulo/nome, descricao quando aplicavel e URL
- datas e tempos de leitura dos posts estao preenchidos

Gate para seguir:

- nenhuma informacao necessaria depende de hardcode dentro de `App.jsx`

### Etapa 2 - Estrutura base da interface

Objetivo:

- inserir as novas secoes na home com markup funcional, sem foco ainda em refinamento visual

Acao:

- escolher entre:
  - manter tudo em `src/App.jsx`
  - extrair `LatestPostsSection.jsx` e `FeaturedProjectsSection.jsx`
- inserir `WRITING` entre `ABOUT` e `PROJECTS`
- inserir `PROJECTS` entre `WRITING` e `CONNECT`
- renumerar secoes para `01`, `02`, `03`, `04`

Entregavel:

- home com as duas novas secoes renderizadas

Validacao:

- ordem narrativa correta
- todos os itens aparecem
- todos os links renderizam
- a pagina continua sem erros de runtime

Gate para seguir:

- a home funciona visualmente, mesmo que ainda sem acabamento

### Etapa 3 - Estilo estrutural de WRITING

Objetivo:

- dar forma editorial a secao de posts

Acao:

- criar estilos proprios para a secao `WRITING`
- trabalhar hierarquia de titulo, metadados e separadores
- manter coerencia com a estrutura visual atual

Entregavel:

- secao `WRITING` legivel e com identidade editorial

Validacao:

- titulos sao o elemento principal
- data e tempo de leitura estao visiveis, mas secundarios
- espacos, bordas e ritmo visual conversam com `ABOUT` e `CONNECT`

Gate para seguir:

- a secao se sustenta visualmente sem depender ainda de animacao

### Etapa 4 - Estilo estrutural de PROJECTS

Objetivo:

- transformar os 3 projetos em showcase claro e coerente com a home

Acao:

- criar layout de cards ou blocos destacados
- definir comportamento responsivo:
  - 1 coluna no mobile
  - 2 ou 3 colunas em telas maiores
- destacar nome, descricao e CTA

Entregavel:

- secao `PROJECTS` com leitura rapida e boa escaneabilidade

Validacao:

- os 3 cards possuem peso visual equilibrado
- nomes e descricoes nao quebram o layout
- a composicao conversa com o restante da pagina

Gate para seguir:

- `PROJECTS` esta estavel em mobile e desktop

### Etapa 5 - Responsividade e microajustes

Objetivo:

- ajustar detalhes de composicao para todos os breakpoints

Acao:

- revisar paddings, gaps, tamanhos tipograficos e quebras de linha
- revisar estados de hover, focus e active
- revisar areas clicaveis

Entregavel:

- comportamento consistente em mobile, tablet e desktop

Validacao:

- sem overflow horizontal
- sem cards comprimidos ou titulos ilegiveis
- foco visivel em todos os links

Gate para seguir:

- layout consistente em larguras pequenas e grandes

### Etapa 6 - Animacao e integracao com o sistema atual

Objetivo:

- integrar as novas secoes ao idioma de movimento do site

Acao:

- adicionar animacoes GSAP leves para `WRITING` e `PROJECTS`
- seguir o padrao existente do projeto
- respeitar:
  - `prefers-reduced-motion`
  - simplificacao em mobile

Entregavel:

- novas secoes animadas sem excesso

Validacao:

- animacoes nao prejudicam leitura
- nao ha salto de layout
- comportamento degradado corretamente em reduced motion e mobile

Gate para seguir:

- movimento melhora a experiencia, sem competir com o conteudo

### Etapa 7 - Polimento semantico e acessibilidade

Objetivo:

- fechar a implementacao com qualidade de interacao e leitura

Acao:

- revisar headings e semantica
- revisar textos de CTA
- revisar `target="_blank"` com `rel="noreferrer"`
- revisar contraste e ordem de leitura

Entregavel:

- implementacao semanticamente consistente

Validacao:

- navegacao por teclado funcional
- hierarquia de titulos coerente
- links externos seguros e consistentes

Gate para seguir:

- nenhuma pendencia funcional ou de acessibilidade basica

### Etapa 8 - Verificacao final

Objetivo:

- garantir que a entrega esta pronta para merge

Acao:

- executar build de producao
- revisar visualmente a home completa
- comparar resultado final contra a PRD

Entregavel:

- implementacao pronta

Validacao:

- build passa
- quantidade de itens bate com a PRD
- ordem das secoes bate com a PRD
- a home final parece uma evolucao natural do site

Gate de conclusao:

- tudo aprovado sem regressao aparente nas secoes existentes

## 4. Suggested implementation slices

Para manter elegancia e baixo risco, a implementacao pode ser fatiada assim:

1. Dados
2. Estrutura das secoes
3. Estilo de `WRITING`
4. Estilo de `PROJECTS`
5. Responsividade
6. Animacao
7. Acessibilidade e build

## 5. Validation checklist per commit

Ao final de cada etapa que gerar codigo, validar:

1. a aplicacao abre sem erro
2. a home continua navegavel
3. os links novos estao corretos
4. nao surgiu overflow horizontal
5. o diff continua pequeno e compreensivel

## 6. Recommended stop points

Pontos seguros para pausar, revisar ou abrir PR parcial:

- apos Etapa 1: dados prontos
- apos Etapa 2: estrutura pronta
- apos Etapa 4: layout principal pronto
- apos Etapa 8: entrega final pronta

## 7. Definition of done

A entrega esta concluida quando:

- `WRITING` exibe exatamente 3 posts de 2026
- `PROJECTS` exibe exatamente 3 repositorios selecionados
- as secoes estao na ordem correta
- a interface esta coerente com a identidade atual
- mobile e desktop estao estaveis
- animacoes estao suaves e opcionais por contexto
- o build de producao passa com sucesso
