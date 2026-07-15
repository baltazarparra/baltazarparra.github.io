# Evidência P9 — candidato de launch

Preparação e inspeção externa realizadas em 15 jul. 2026. Nenhum deploy de
produção, mudança de domínio, DNS ou configuração remota foi executado.

## Resultado

A v2 tem um caminho de build determinístico para a hospedagem que realmente
serve `baltz.dev`: o projeto Vercel `rvnn/baltazarparra-github-io`. O arquivo
raiz `vercel.json` instala pelo lockfile, constrói somente o pacote
`@baltz/site-v2` e publica `v2/dist`.

O utilitário legado `gh-pages` e os scripts locais de publicação foram
removidos. A tentativa inicial de preparar um workflow de GitHub Pages também
foi descartada depois que a inspeção externa mostrou que Pages não atende o
domínio final. Essa correção está registrada em D-0018/D-0020.

O workflow `.github/workflows/v2-quality.yml` continua sem deploy: em pull
request ou disparo manual ele instala pelo lockfile, audita dependências, roda
lint, type-check, build, preflight do artefato e seis Lighthouse.

## Hosting observado

| Item | Estado observado |
|---|---|
| Projeto Vercel | `rvnn/baltazarparra-github-io` |
| Produção atual | deployment `dpl_CbxAZtuZCjHXj4kGqZwLUykPpm2D` |
| Commit em produção | `491571cc6cf3aa92a00f182379c4233a741b18bb` (`main`) |
| Domínios | `baltz.dev` e `www.baltz.dev`, ambos verificados |
| DNS apex | `A 76.76.21.21` |
| DNS `www` | `CNAME cname.vercel-dns.com` |
| Integração Git | GitHub, branch de produção `main` |
| GitHub Pages legado | branch `gh-pages`; não serve o domínio customizado |

A inspeção revelou uma divergência que precisa ser corrigida no launch:
`baltz.dev` responde com 308 para `www.baltz.dev`, enquanto o canonical aprovado
e emitido pela v2 é `https://baltz.dev/`. A decisão proposta é inverter o
redirect, mantendo apex como primário. Isso exige autorização externa própria.

O snapshot não sensível está em `hosting-snapshot.json`.

## Build equivalente à Vercel

O projeto foi vinculado apenas no estado local ignorado pelo Git e
`vercel build --yes` passou com as configurações Preview baixadas do projeto:

- instalação `pnpm install --frozen-lockfile`;
- Astro check: 23 arquivos, zero erro, warning ou hint;
- duas páginas estáticas;
- saída `.vercel/output/static` idêntica a `v2/dist` por comparação recursiva;
- nenhum deployment criado pelo comando de build local.

`.env.local` e `.vercel/` permanecem ignorados e não fazem parte do candidato.

## Segurança de dependências

O primeiro audit P8 tinha cinco avisos no caminho legado
`gh-pages > globby > glob > minimatch`. Após remover `gh-pages`, restou um aviso
moderado em `js-yaml@4.1.1`, versão que o workspace forçava por override. O
override e o lockfile foram atualizados para `4.2.0`.

Resultado final de `pnpm audit --prod --json`: zero vulnerabilidade entre 427
dependências avaliadas, incluindo opcionais. O workflow bloqueia avisos
moderados, altos e críticos.

## Preflight do artefato

`pnpm v2:launch:check` passou:

- ESLint limpo;
- Astro check: 23 arquivos, zero erro, warning ou hint;
- duas páginas estáticas;
- artefato de 2.087.839 bytes;
- `index.html`, `404.html`, `robots.txt`, `sitemap.xml` e `og.png` presentes;
- canonical, robots, JSON-LD, OG 1200 × 630 e domínio validados;
- nenhuma URL local ou `og.jpg` legado no HTML.

O preflight é implementado em `v2/scripts/check-launch-artifact.mjs` e falha o
processo quando qualquer requisito não é atendido.

## Performance

A primeira execução do gate bloqueou o launch: os três LCPs mobile ficaram
entre 2,559 e 2,576 s. A análise mostrou a frase do hero como LCP e uma folha
CSS render-blocking com custo estimado de 153–159 ms. O budget não foi relaxado.

Como a v2 tem só home + 404, `build.inlineStylesheets: "always"` eliminou a
requisição crítica. Resultado final:

| Perfil | Execuções | Performance | A11y | Best Practices | SEO | LCPs | TBT mediano | CLS |
|---|---:|---:|---:|---:|---:|---|---:|---:|
| Mobile | 3 | 98 / 99 / 99 | 100 | 100 | 100 | 2.268 / 2.255 / 2.256 ms | 0 ms | 0 |
| Desktop | 3 | 100 / 100 / 100 | 100 | 100 | 100 | 492 / 569 / 567 ms | 0 ms | 0 |

Todos os resultados ficaram dentro dos budgets. Os seis relatórios estão em
`lighthouse/`.

## Smoke final

O build exato passou em Chrome desktop:

- hero, Writing, transição térmica, Caipora e Clouds;
- Smile e shader entram progressivamente;
- 17 alvos de teclado visíveis com outline de 2 px;
- zero overflow, erro de console ou request inesperado;
- AX, canonical, robots, JSON-LD, OG e privacidade íntegros;
- 404 local com HTTP 404 e retorno à home;
- bloqueio de capa/GLB recuperado por fallback dirigido.

Evidências e screenshots estão em `browser/`.

## Pendências externas do P9

1. criar o commit imutável do release candidato;
2. autorizar push sabendo que a integração Git pode criar Preview Vercel;
3. validar esse Preview e arquivar deployment/artefato atual para rollback;
4. definir a janela de launch e critérios de aborto;
5. autorizar promoção/merge do SHA aprovado;
6. inverter o redirect para `www` → apex, se D-0021 for aprovada;
7. executar smoke no domínio final e observar.

O P9 tem candidato local verde, mas não está lançado.
