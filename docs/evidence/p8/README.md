# Evidência P8 — hardening e QA

Coleta final feita em 15 jul. 2026 sobre o build estático de `v2/`. O site de
produção não foi alterado e nenhum deploy ou preview externo foi criado.

## Resultado executivo

A implementação passou no laboratório em Chrome 149, Firefox 151 e WebKit
26.5, incluindo desktop, viewport mobile, ausência de
JavaScript, 320 CSS px e equivalentes de zoom a 200%/400%. SEO, privacidade,
resiliência, 404 local, teclado e budgets também passaram.

Três verificações exigem hardware ou
interação humana indisponíveis neste ambiente: Safari em macOS/iOS real,
Android intermediário real e leitor de tela manual. WebKit Linux aumenta a
cobertura do motor, mas não é evidência de Safari físico. Esses limites exigem
teste externo ou aceite de risco escrito antes de P9. Baltz aceitou os três
riscos por escrito em 15 jul. 2026; por isso, o gate P8 foi concluído sem
transformar cobertura emulada em evidência física.

## Build e qualidade estática

- ESLint passou sem warnings;
- Astro check avaliou 22 arquivos com zero erro, warning ou hint;
- build gerou duas páginas estáticas (`/` e `/404.html`);
- artefato final tem 2.087.472 bytes, incluindo OG de 329.835 bytes, modelo GLB
  de 216.936 bytes e chunks WebGL carregados progressivamente;
- `git diff --check` passou;
- nenhum arquivo da aplicação de produção em `src/`, `public/`, `dist/`,
  `index.html`, `vite.config.js` ou `package.json` foi modificado.

## Lighthouse final

| Perfil | Execuções | Performance | A11y | Best Practices | SEO | LCP mediano | TBT mediano | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Mobile | 3 | 99 | 100 | 100 | 100 | 2.267 ms | 0 ms | 0 |
| Desktop | 3 | 100 | 100 | 100 | 100 | 489 ms | 0 ms | 0 |

No mobile, as três notas de performance foram 99, 98 e 99; os LCPs foram
2.268, 2.267 e 2.259 ms. No desktop, todas as categorias ficaram em 100 e os
LCPs foram 509, 489 e 488 ms. Nenhuma execução final excedeu os budgets.

## Runtime

| Perfil | Execuções | FPS mediano | Frame p95 | Long tasks | Memória final mediana | Delta mediano |
|---|---:|---:|---:|---:|---:|---:|
| Desktop 1440 × 1000 | 3 | 60 | 16,7 ms | 0 | 8,84 MiB | 2,04 MiB |
| Mobile 390 × 844 | 3 | 60 | 16,7 ms | 0 | 2,33 MiB | 0,40 MiB |

São métricas de Chrome headless com SwiftShader; não substituem frame pacing
em GPU e aparelho físicos.

## Compatibilidade e interação

| Ambiente | Resultado |
|---|---|
| Chrome desktop | Hero a Clouds, WebGL progressivo, 17 Tabs, 404 e falhas de asset passaram |
| Chrome mobile emulado | Conteúdo/touch/fallbacks passaram sem overflow |
| Firefox desktop/mobile | HTTP 200, 17 links, âncora Caipora, teclado desktop, 404 e zero falhas passaram |
| WebKit desktop/mobile/reduced | Layout, âncora, teclado desktop, 404 e fallback passaram |
| 320 CSS px | Zero overflow horizontal |
| Equivalente a zoom 200% | Zero overflow horizontal |
| Equivalente a zoom 400% | Zero overflow; 17 alvos de teclado visíveis com outline de 2 px |
| Sem JavaScript | Copy, navegação, mídia e links permanecem utilizáveis |

O WebKit do laboratório não conseguiu resolver a capa remota do Spotify por
falha de proxy. O teste comprovou a recuperação: `data-media-state="error"`,
imagem em opacidade zero e fallback `CLOUDS` visível. Firefox e Chrome
carregaram a mesma imagem normalmente. O erro de console da navegação à rota
404 é separado no relatório e corresponde ao status HTTP deliberado.

## Acessibilidade

- landmarks detectados: um `main`, um `header`, dois `nav` e um `footer`;
- árvore de acessibilidade do Chrome: 17 links nomeados, 12 headings, três
  imagens nomeadas e nenhum nome acessível vazio em controle interativo;
- hierarquia contém um único `h1` e seções em `h2`/`h3`;
- todas as três imagens editoriais têm `alt` contextual;
- 17 passos de teclado passaram em Chrome, Firefox e WebKit desktop;
- Lighthouse Accessibility: 100 nas seis execuções finais;
- contraste automatizado e foco passaram, e os contrastes da paleta foram
  comprovados no P3.

A inspeção da árvore AX não equivale a uma sessão manual em NVDA, VoiceOver ou
outro leitor de tela. Esse é um risco aberto, não um falso positivo verde.

## SEO e social

- canonical absoluto `https://baltz.dev/`;
- robots da home `index, follow`; 404 `noindex, follow`;
- `robots.txt` e `sitemap.xml` usam o domínio final;
- OG/Twitter usam `https://baltz.dev/og.png`, 1200 × 630;
- JSON-LD publica `WebSite` e `Person`;
- Lighthouse SEO: 100 nas seis execuções;
- social card foi redesenhado na linguagem de The Edit e verificado em
  1200 × 630.

Status e headers no domínio final só podem ser comprovados após o deploy P9.

## Revisão externa

Não houve rodada com devs/designers externos: o Baltz informou anteriormente
que não há revisores além dele. O item era opcional no roadmap e não foi
substituído por uma revisão fictícia.

## Privacidade e terceiros

- zero script externo, iframe, cookie, localStorage ou sessionStorage;
- a única requisição de terceiro é a capa do Spotify, lazy e com
  `referrerpolicy="no-referrer"`;
- o player permanece um link explícito, sem SDK ou embed;
- falha da capa e do modelo 3D foi injetada e recuperada sem perda de conteúdo.

## Links externos

Dez dos doze destinos responderam HTTP 200 diretamente. itch.io respondeu 429
ao primeiro cliente automatizado e 200 com user agent de browser. LinkedIn
respondeu 999 ao cliente automatizado por proteção anti-bot; o destino e o
perfil já haviam sido confirmados no P6. Todos os demais links e a capa do
Spotify responderam 200.

## Dependências e licenças

Os manifests diretos de Astro, React, React DOM, React Three Fiber e Three usam
MIT; GSAP 3.13 usa a licença Standard sem cobrança para o uso atual. A
tipografia Instrument Sans inclui OFL no artefato.

O audit do workspace encontrou cinco avisos (três altos e dois moderados),
todos no caminho do utilitário legado de deploy da raiz
`gh-pages > globby > glob > minimatch`. Esse código não entra no runtime da v2,
mas o comando legado não deve ser usado no launch até ser atualizado ou
substituído. Ver `dependency-audit.md`.

## Arquivos principais

- `final/browser-verification.json`: smoke final exato do build, AX, SEO,
  privacidade, 404 e falhas deliberadas;
- `cross-browser/cross-browser-verification.json`: Firefox/WebKit;
- `runtime-raw.json` e `runtime-summary.json`: sete percursos de runtime;
- `lighthouse-mobile-*.report.json` e `lighthouse-desktop-*.report.json`:
  seis relatórios finais;
- screenshots por perfil, zoom, 404 e falha de asset;
- `preflight.md`: gate item a item;
- `dependency-audit.md`: segurança de dependências e licenças.

## Limites aceitos e próximos controles

1. Safari macOS/iOS real não executado — risco aceito;
2. Android intermediário real não executado — risco aceito;
3. leitor de tela manual não executado — risco aceito;
4. substituir/atualizar o deploy legado vulnerável durante a preparação P9;
5. autorizar separadamente qualquer preparação externa ou publicação.
