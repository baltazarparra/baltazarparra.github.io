# Preflight P9 — candidato de launch

## Concluído

- [x] P8 concluído com riscos aceitos por escrito.
- [x] `gh-pages` e scripts locais de publicação removidos.
- [x] Hosting real, domínios, DNS e deployment atual inspecionados em modo leitura.
- [x] GitHub Pages identificado como legado, fora do caminho de `baltz.dev`.
- [x] `vercel.json` limita build e output a `v2/dist`.
- [x] Lockfile atualizado e instalação congelada reproduzida.
- [x] Audit de produção: zero vulnerabilidade.
- [x] Lint, Astro check, build e artifact check passaram.
- [x] `vercel build --yes` passou sem criar deployment.
- [x] `.vercel/output/static` e `v2/dist` são idênticos.
- [x] Lighthouse 3× mobile + 3× desktop passou.
- [x] Smoke exato do build, teclado, AX, privacidade, 404 e fallbacks passou.
- [x] Nenhuma mudança em produção, domínio, DNS ou configuração remota ocorreu.

## Pendente antes de autorizar produção

- [ ] Commit SHA imutável do release candidato.
- [ ] Push/Preview Vercel autorizados e Preview validado.
- [ ] Deployment atual arquivado como rollback e restauração ensaiada.
- [ ] Redirect atual `baltz.dev` → `www` alinhado ao canonical aprovado.
- [ ] Janela e critérios de abortar aprovados pelo Baltz.
- [ ] Promoção/merge autorizados explicitamente para o SHA final.
- [ ] Smoke e observação no domínio de produção.

## Gate

O candidato local está verde. P9 continua em execução porque Preview, rollback,
redirect e produção dependem de autorização externa explícita.
