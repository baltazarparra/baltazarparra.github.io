# Preflight P8 — hardening e QA

## Build e integridade

- [x] ESLint, Astro check e build passaram.
- [x] `git diff --check` passou.
- [x] O build contém home, 404, sitemap, robots e OG.
- [x] A aplicação de produção atual permanece intocada.
- [x] Chunks WebGL permanecem fora do caminho inicial e sob intenção/capacidade.

## Browsers, viewports e capacidade

- [x] Chrome desktop e mobile emulado.
- [x] Firefox desktop e mobile emulado.
- [x] WebKit desktop, mobile emulado e reduced motion.
- [x] 320 CSS px, equivalentes a zoom 200% e 400% sem overflow.
- [x] Fallback sem JavaScript, sem WebGL e com falha de asset.
- [ ] Safari macOS/iOS real — indisponível no laboratório.
- [ ] Android intermediário real — indisponível no laboratório.

## Acessibilidade

- [x] Um `h1`, hierarquia de headings e landmarks coerentes.
- [x] Alt text das imagens editoriais.
- [x] 17 alvos de teclado visíveis e com foco de 2 px.
- [x] Skip link e ativação de âncoras.
- [x] Lighthouse Accessibility 100 em seis execuções.
- [x] Árvore AX sem controle interativo sem nome.
- [x] Contraste automatizado e tokens P3 aprovados.
- [ ] Leitor de tela manual — inspeção AX não substitui NVDA/VoiceOver.

## Performance

- [x] Lighthouse mobile 3×: performance mediana 99, LCP 2.267 ms.
- [x] Lighthouse desktop 3×: performance 100, LCP mediano 489 ms.
- [x] TBT mediano 0 ms e CLS 0 nos dois perfis.
- [x] Runtime desktop/mobile com 60 fps, p95 até 16,8 ms e zero long task.
- [ ] Fluidez em GPU/device real — depende do Android/iOS físico.
- [ ] Web Vitals de campo — só existem após publicação e amostra suficiente.

## SEO, conteúdo e privacidade

- [x] Canonical e URLs sociais absolutas em `baltz.dev`.
- [x] OG/Twitter 1200 × 630 dirigido para The Edit.
- [x] `robots.txt`, `sitemap.xml` e JSON-LD verificados.
- [x] 404 local retorna HTTP 404, `noindex, follow` e link para a home.
- [x] Zero script externo, iframe, cookie ou storage.
- [x] Capa remota é lazy, sem referrer e com fallback testado.
- [x] Copy, links, alt text e inventário estão congelados.
- [ ] Status, DNS, TLS, headers e social preview no hosting final — P9.

## Segurança e operação

- [x] Dependências diretas e licenças revisadas.
- [x] Avisos do audit isolados no tooling legado de deploy, fora do runtime v2.
- [ ] Atualizar ou substituir `gh-pages` legado antes do primeiro launch v2.
- [x] Checklist de launch preparado.
- [x] Plano de rollback preparado.
- [ ] Backup, SHA e DNS reais capturados imediatamente antes do P9.
- [x] Revisores externos não estão disponíveis, conforme resposta do Baltz.

## Gate

O trabalho automatizado do P8 está concluído. Em 15 jul. 2026, Baltz aceitou
por escrito os riscos de Safari/iOS real, Android intermediário real e leitor
de tela manual não executados. O gate P8 está concluído; esse aceite autoriza
somente a preparação local do P9, não publicação.
