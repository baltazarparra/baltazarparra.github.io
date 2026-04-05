# PRD - Home com secoes de Writing e Projects

Status: Draft aprovado para implementacao
Data: 2026-04-05
Owner: Baltazar Parra

## 1. Resumo

Adicionar duas novas secoes na home do portfolio para destacar:

1. posts recentes do DEV publicados em 2026
2. projetos selecionados dos repositorios pinados no GitHub

A interface precisa ser coerente com a linguagem atual do site: tipografia forte, estrutura editorial, alto contraste, bordas marcadas e animacoes discretas.

## 2. Contexto

Hoje a home e composta principalmente por:

- Hero
- About
- Connect
- Footer

O conteudo principal do portfolio ainda nao evidencia producao editorial recente nem projetos autorais em destaque. Isso enfraquece a leitura do site como hub profissional e criativo.

## 3. Objetivo do produto

Transformar a home em uma experiencia mais completa, mostrando com clareza:

- producao intelectual recente
- projetos autorais selecionados
- continuidade entre perfil, escrita, construcao e canais de contato

## 4. Problema que estamos resolvendo

- O visitante nao encontra rapidamente conteudo recente de escrita.
- O visitante nao encontra rapidamente projetos em destaque.
- A home atual comunica perfil e canais, mas nao comunica bem "o que esta sendo produzido agora".

## 5. Escopo aprovado

As novas secoes serao inseridas entre `ABOUT` e `CONNECT`, nesta ordem:

1. `WRITING`
2. `PROJECTS`

Com isso, a numeracao da home fica:

1. `ABOUT`
2. `WRITING`
3. `PROJECTS`
4. `CONNECT`

## 6. Conteudo aprovado

### 6.1 Posts

Regra aprovada:

- usar apenas posts publicados em 2026
- nao forcar 4 itens se nao existirem 4 posts no ano

Itens confirmados em 2026-04-05:

1. `Stop Vibing, Start Eval-ing: EDD in Practice`
2. `Stop Vibing, Start Eval-ing: EDD for AI-Native Engineers`
3. `What is 'Harness Design' and why does it matter`

Origem:

- [DEV profile](https://dev.to/baltz)
- [DEV public API](https://dev.to/api/articles?username=baltz&per_page=20)

### 6.2 Projetos

Regra aprovada:

- usar apenas os repositorios pinados `1`, `3` e `4`
- nao incluir os outros pinados

Itens selecionados:

1. `guia` - Development flow with code agents
2. `dark-pixels` - A plataform vintage game, with a souls-like spirit, made in Javascript
3. `crypto-transfer` - A DApp made with web3 tools for transfer cryptocurrency

Origem:

- [GitHub profile](https://github.com/baltazarparra)

## 7. Usuarios e necessidade principal

### Usuario primario

- recrutadores
- liderancas tecnicas
- pares de engenharia/design
- pessoas que chegam via LinkedIn, GitHub ou DEV

### Necessidades

- entender rapidamente o perfil de atuacao atual
- ver provas concretas de producao recente
- acessar conteudo e projetos em poucos cliques

## 8. Requisitos funcionais

### RF-01 - Nova secao de posts

A home deve exibir uma secao `WRITING` com os posts de 2026 aprovados no escopo.

Cada item deve exibir no minimo:

- titulo
- data de publicacao
- tempo de leitura
- link para o post no DEV

### RF-02 - Nova secao de projetos

A home deve exibir uma secao `PROJECTS` com exatamente 3 projetos:

- `guia`
- `dark-pixels`
- `crypto-transfer`

Cada card deve exibir no minimo:

- nome do repositorio
- descricao curta
- link para o GitHub
- linguagem ou label curta quando disponivel

### RF-03 - Ordem da narrativa

As secoes devem respeitar a seguinte sequencia:

- About
- Writing
- Projects
- Connect

### RF-04 - Navegacao externa

Todos os links externos devem abrir em nova aba com `target="_blank"` e `rel="noreferrer"`.

### RF-05 - Responsividade

As duas novas secoes devem funcionar com boa leitura em:

- mobile
- tablet
- desktop

## 9. Requisitos de experiencia e interface

### UX-01

As novas secoes devem parecer parte do mesmo sistema visual atual, sem introduzir um layout generico ou "template blog".

### UX-02

A secao `WRITING` deve ter carater mais editorial, com leitura em lista e enfase em titulo e metadados.

### UX-03

A secao `PROJECTS` deve ter carater mais de showcase, com cards ou blocos destacados, mas ainda alinhados ao visual minimalista e tipografico do site.

### UX-04

O contraste, foco visivel e hit area dos links devem permanecer acessiveis.

### UX-05

As animacoes devem seguir o comportamento atual do site:

- suaves
- condicionadas a `prefers-reduced-motion`
- reduzidas ou simplificadas em mobile

## 10. Direcao visual

Manter os principios atuais:

- tipografia grande e assertiva
- uso predominante de preto, branco e acento laranja/vermelho
- muito espaco negativo
- secoes numeradas
- linhas/bordas fortes
- transicoes elegantes sem excesso

Direcao recomendada por secao:

- `WRITING`: lista editorial com separadores horizontais, metadados pequenos e titulos com forte hierarquia
- `PROJECTS`: grid de 1 coluna no mobile e 2-3 colunas em larguras maiores, com cards de destaque consistentes com o restante da pagina

## 11. Estrategia de dados

Para esta iteracao, os dados serao estaticos no front-end.

Motivos:

- reduz complexidade
- evita dependencia de API em runtime
- evita problemas com rate limit, instabilidade ou parsing
- combina com a simplicidade atual do projeto

Implementacao sugerida:

- criar um arquivo local para os dados curados das secoes

Estrutura sugerida:

`src/data/homeContent.js`

## 12. Abordagem tecnica sugerida

### Arquivos principais

- `src/App.jsx`
- `src/App.css`
- `src/data/homeContent.js`

### Componentes sugeridos

- `src/components/LatestPostsSection.jsx`
- `src/components/FeaturedProjectsSection.jsx`

Se a implementacao ficar pequena, os componentes podem continuar dentro de `App.jsx`. Se crescerem alem do razoavel, devem ser extraidos.

## 13. Conteudo base da implementacao

### 13.1 Posts

Cada item deve conter ao menos:

- `title`
- `url`
- `publishedAt`
- `readingTime`

### 13.2 Projetos

Cada item deve conter ao menos:

- `name`
- `description`
- `url`
- `language`

## 14. Fora de escopo

Nao faz parte desta entrega:

- integracao em tempo real com API do DEV
- integracao em tempo real com API do GitHub
- CMS
- pagina interna de projetos
- filtros, busca ou paginacao
- alteracoes no hero, modelo 3D ou footer

## 15. Criterios de aceite

### CA-01

A home exibe uma secao `WRITING` entre `ABOUT` e `PROJECTS`.

### CA-02

A secao `WRITING` mostra exatamente 3 posts de 2026 aprovados no escopo.

### CA-03

A home exibe uma secao `PROJECTS` entre `WRITING` e `CONNECT`.

### CA-04

A secao `PROJECTS` mostra exatamente estes 3 repositorios:

- `guia`
- `dark-pixels`
- `crypto-transfer`

### CA-05

A pagina permanece coerente visualmente com o site atual em desktop e mobile.

### CA-06

As novas secoes respeitam acessibilidade basica:

- foco visivel
- links clicaveis
- contraste legivel

### CA-07

O projeto compila com sucesso em build de producao.

## 16. Validacao e teste

Checklist de validacao:

1. conferir ordem das secoes
2. conferir textos e links dos 3 posts
3. conferir textos e links dos 3 projetos
4. validar layout em mobile
5. validar layout em desktop
6. validar `prefers-reduced-motion`
7. executar build

## 17. Riscos e observacoes

- O requisito original de "4 posts mais recentes" foi substituido por "apenas posts deste ano".
- Em 2026-04-05, a fonte publica retorna apenas 3 posts de 2026.
- Se um quarto post de 2026 for publicado no futuro, a secao pode ser expandida facilmente pela camada de dados local.

## 18. Proximo passo recomendado

Implementar a PRD em uma iteracao unica com:

1. camada local de dados
2. duas novas secoes
3. ajuste de numeracao
4. ajuste de responsividade e animacao
5. validacao com build
