# Evidência P6 - produção da one-page

Coleta final feita em 15 jul. 2026 sobre o build estático de produção em
`v2/dist/`. O inventário editorial foi confirmado pelo Baltz nesta data: os
dois posts, os três projetos e a copy atual permanecem. Não houve preview
externo, deploy ou alteração da aplicação atual.

## Conteúdo congelado

- Writing: *Sharing skills with NPX* e *What is 'Harness Design' and why does
  it matter*;
- Projects: AI-Native Engineering, Crypto Transfer DApp e Subtitle Scraping;
- showcases: Caipora e Clouds;
- perfis: LinkedIn, GitHub, dev.to, Spotify e itch.io.

A seção Writing foi integrada entre About e Projects com data semântica,
tempo de leitura e uma única ação descritiva por texto. O inventário canônico
está em `v2/src/data/site.ts`.

## Ambiente

- WSL2 Linux 6.18.33.2, AMD Ryzen 5 5600X e 19 GiB de memória;
- Node 24.14.0, pnpm 11.8.0, Astro 7.0.9;
- Chrome 149.0.7827.200 headless;
- Lighthouse 13.4.0;
- SwiftShader habilitado para os caminhos WebGL;
- cache desativado no smoke e runtime;
- desktop 1440 x 1000; mobile emulado 390 x 844, DPR 2.

## Lighthouse mobile

| Execução | Performance | A11y | Best Practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | 97 | 100 | 100 | 100 | 2.418 ms | 0 ms | 0 |
| 2 | 97 | 100 | 100 | 100 | 2.448 ms | 22 ms | 0 |
| 3 | 96 | 100 | 100 | 100 | 2.569 ms | 0 ms | 0 |
| Mediana | 97 | 100 | 100 | 100 | 2.448 ms | 0 ms | 0 |

A mediana cumpre o budget. A terceira execução ultrapassou 2,5 s em 69 ms;
essa dispersão permanece visível para revalidação em device real no P8.

## Percursos e fallbacks

Os perfis desktop, mobile/touch, reduced-motion e sem JavaScript mantiveram
copy, navegação, datas e links corretos. O perfil desktop ativou Smile e campo
térmico interativos; os demais preservaram os posters dirigidos. Os quatro
perfis tiveram zero erro de console e zero request com falha.

O percurso de teclado desktop executou 17 pressões reais de Tab. Skip link,
marca, navegação, dois textos, três projetos, showcases e cinco perfis ficaram
visíveis e exibiram outline de 2 px. A âncora de Caipora respeitou o cabeçalho
fixo.

## Runtime

| Perfil | Execuções | FPS mediano | Frame p95 | Frames >20 ms | Long tasks |
|---|---:|---:|---:|---:|---:|
| Desktop | 3 | 58,8 | 16,8 ms | 1,69% | 0 |
| Mobile emulado | 3 | 60 | 16,8 ms | 0% | 0 |

No desktop, o heap final mediano foi 8,8 MiB, com delta de 2 MiB. No mobile,
2,33 MiB e delta de 0,4 MiB. O resultado integral está em
`runtime-summary.json` e `runtime-raw.json`.

## Links externos

Onze destinos responderam HTTP 200 na checagem direta. O LinkedIn respondeu
999 ao cliente de linha de comando por proteção anti-bot, mas o perfil com o
slug exato apareceu no índice atual do próprio LinkedIn. A verificação manual
em browser visível continua no P8.

## Arquivos

- `lighthouse-mobile-*.report.json`: três relatórios finais mobile;
- `browser-verification.json`: DOM, conteúdo, links, foco, hidratação,
  fallbacks, erros de console e falhas de request;
- `runtime-raw.json` e `runtime-summary.json`: frame time, long tasks e heap;
- `desktop-*`, `mobile-*`, `reduced-*` e `no-js-*`: screenshots de hero,
  Writing, transição térmica e Caipora;
- `preflight.md`: inspeção editorial, visual e de interface.

## Limites da evidência

Chrome headless, mobile emulado e SwiftShader não substituem Android real,
Safari/iOS, Firefox ou GPU real. Leitor de tela, zoom, reflow a 320 CSS px e
compatibilidade cross-browser permanecem no P8. O P6 comprova a página
completa e seus fallbacks, não o aceite final de produção.
