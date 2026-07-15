# Evidência P7 - polish e costuras

Coleta final feita em 15 jul. 2026 sobre `v2/dist/`. A implementação e o
walkthrough foram aprovados explicitamente pelo Baltz nesta data. Não houve
preview externo, deploy ou alteração da aplicação atual.

## Decisões de costura

- nenhum loader: HTML, copy e navegação já aparecem no primeiro frame;
- nenhum embed do Spotify: a capa carrega sob proximidade e o player abre por
  ação explícita, sem iframe, cookies ou JavaScript do Spotify;
- nenhum som: permanece fora do sistema conforme P4;
- GSAP entra em idle, não no caminho crítico, e não é importado em reduced
  motion;
- Smile e shader mantêm posters e abandonam importações após 8 s;
- portrait, Caipora e Clouds têm estados dirigidos de loading, erro e timeout;
- a 404 usa a copy aprovada, retorna HTTP 404 e oferece retorno real à home.

## Walkthrough automatizado

| Perfil | Smile | Transição térmica | Clouds | Console/request |
|---|---|---|---|---|
| Desktop 1440 x 1000 | Canvas após intenção | Canvas por proximidade | Capa pronta | 0 / 0 |
| Mobile 390 x 844 | Poster | Fallback | Capa pronta | 0 / 0 |
| Reduced motion | Poster | Fallback | Capa pronta | 0 / 0 |
| Sem JavaScript | Poster | Fallback | Capa pronta | 0 / 0 |

O desktop repetiu 17 Tabs reais; todos os alvos permaneceram visíveis com
outline de 2 px. Screenshots cobrem hero, Writing, transição, Caipora e Clouds
nos quatro perfis.

## Falhas deliberadas

O percurso adicional bloqueou a capa remota do Spotify e `smile.glb`:

- Clouds entrou em `error`, ocultou a imagem quebrada e preservou o campo
  tipográfico `CLOUDS`;
- Smile removeu o canvas e manteve o poster CSS visível;
- copy, navegação e links continuaram funcionais.

A rota `/missing-p7/` respondeu HTTP 404, renderizou `This page does not
exist.`, publicou canonical `https://baltz.dev/404.html` e o link retornou para
a home.

## Performance após o polish

| Execução | Performance | A11y | Best Practices | SEO | LCP | TBT | CLS |
|---|---:|---:|---:|---:|---:|---:|---:|
| 1 | 98 | 100 | 100 | 100 | 2.271 ms | 0 ms | 0 |
| 2 | 97 | 100 | 100 | 100 | 2.570 ms | 0 ms | 0 |
| 3 | 99 | 100 | 100 | 100 | 2.262 ms | 0 ms | 0 |
| Mediana | 98 | 100 | 100 | 100 | 2.271 ms | 0 ms | 0 |

A primeira versão do polish teve mediana de LCP de 2,558 s. A investigação
identificou motion não essencial no caminho inicial; mover GSAP para idle
reduziu a mediana em 287 ms. A execução de 2,570 s permanece registrada como
dispersão para revalidação em device real no P8.

## Arquivos

- `browser-verification.json`: quatro walkthroughs e percurso de teclado;
- `polish-verification.json`: 404, retorno e falhas deliberadas de asset;
- `lighthouse-mobile-*.report.json`: três medições finais;
- `404.png` e `asset-failure-clouds.png`: estados críticos;
- `desktop-*`, `mobile-*`, `reduced-*` e `no-js-*`: frames do walkthrough;
- `preflight.md`: inspeção final de interface e direção.

## Limites

O walkthrough automatizado usa Chrome headless; a revisão perceptiva foi aceita
pelo Baltz. Browser visível, cross-browser, leitor de tela, device real e
status 404 no hosting final pertencem ao P8/P9.
