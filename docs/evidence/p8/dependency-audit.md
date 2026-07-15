# P8 — dependências, segurança e licenças

Data: 15 jul. 2026.

## Runtime da v2

O build é estático. Não há backend, API, banco, secret, sessão, autenticação ou
entrada de usuário persistida. O navegador recebe HTML/CSS/JavaScript e assets;
as únicas fronteiras externas são links de saída e a imagem lazy do Spotify.

Licenças diretas verificadas nos manifests instalados:

| Dependência | Uso | Licença |
|---|---|---|
| Astro | geração estática | MIT |
| React / React DOM | ilhas WebGL | MIT |
| React Three Fiber | integração Three/React | MIT |
| Three.js | Smile e shader | MIT |
| GSAP 3.13 | Pinned Edit | Standard License, uso atual sem cobrança |
| Instrument Sans | tipografia self-hosted | SIL Open Font License |

## Resultado do audit

`pnpm --dir v2 audit --prod --audit-level high` reportou cinco avisos no
lockfile compartilhado: três altos e dois moderados. Todos apontam para o mesmo
caminho do projeto legado da raiz:

`gh-pages > globby > glob > minimatch`

O `package.json` da raiz mantém `gh-pages@^6.1.1` como dependência e o comando
`gh-pages -d dist`. Esse caminho não é empacotado nem executado no cliente da
v2, portanto não representa uma vulnerabilidade servida pelo site estático.
Ele é, porém, risco operacional no processo de publicação.

## Decisão operacional

- não alterar a produção atual no P8;
- não usar o comando legado no launch v2;
- antes do P9, atualizar a cadeia ou adotar um workflow estático de Pages que
  publique `v2/dist` sem esse tooling;
- repetir audit e build após a mudança escolhida;
- manter a mudança de deploy fora deste gate porque ela afeta publicação e
  exige autorização específica.

O comando de listagem completa de licenças do pnpm não pôde concluir porque o
banco interno do store estava indisponível. As licenças diretas críticas foram
então verificadas nos manifests instalados; essa limitação está registrada e
não foi mascarada como uma varredura transitiva completa.

## Resolução na preparação P9

Em 15 jul. 2026, após autorização para preparar P9 localmente:

- `gh-pages` e os scripts de publicação locais foram removidos;
- o override vulnerável `js-yaml@4.1.1` foi elevado para `4.2.0`, a menor versão
  4.x corrigida disponível no registry;
- instalação com lock congelado, lint, check e build passaram;
- `pnpm audit --prod --json` terminou com zero vulnerabilidade.

Evidência final em `docs/evidence/p9/audit-production.json`.
