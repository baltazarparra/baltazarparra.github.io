# Evidência P5 - stack e vertical slice

Coleta final feita em 15 jul. 2026 sobre o build estático de produção em
`v2/dist/`. Não houve preview externo, deploy ou alteração da aplicação atual.

## Ambiente

- WSL2 Linux 6.18.33.2, AMD Ryzen 5 5600X e 19 GiB de memória;
- Node 24.14.0, pnpm 11.8.0, Astro 7.0.9;
- Chrome 149.0.7827.200 headless;
- Lighthouse 13.4.0;
- SwiftShader habilitado para os caminhos WebGL;
- cache desativado no smoke e runtime;
- desktop 1440 x 1000; mobile emulado 390 x 844, DPR 2.

## Resultado

| Métrica | Desktop, 3 execuções | Mobile, 3 execuções |
|---|---:|---:|
| Performance | 100 / 100 / 100 | 97 / 97 / 97 |
| Accessibility | 100 / 100 / 100 | 100 / 100 / 100 |
| Best Practices | 100 / 100 / 100 | 100 / 100 / 100 |
| SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| FCP, mediana | 354 ms | 1.446 ms |
| LCP, mediana | 533 ms | 2.414 ms |
| TBT, mediana | 0 ms | 0 ms |
| CLS | 0 | 0 |

O runtime percorreu a página inteira em 5 s, com três execuções desktop, três
mobile e uma reduced motion. As medianas foram 60 fps, p95 de 16,8 ms desktop e
16,7 ms mobile, nenhum frame acima de 20 ms na mediana e zero long tasks. O resultado
completo está em `runtime-summary.json` e os registros individuais em
`runtime-raw.json`.

## Arquivos

- `lighthouse-*.report.json`: três relatórios finais por perfil;
- `browser-verification.json`: DOM, canonical, hidratação, fallbacks, navegação,
  erros de console e falhas de request em quatro perfis;
- `runtime-raw.json` e `runtime-summary.json`: frame time, long tasks e heap;
- `desktop-*`, `mobile-*`, `reduced-*` e `no-js-*`: screenshots do hero,
  shader e Caipora;
- `404.png`: 404 local que também retornou status HTTP 404;
- `preflight.md`: inspeção da direção e dos requisitos de interface.

## Leitura dos limites

O Lighthouse mobile usa o modelo de laboratório padrão e desktop usa o preset
desktop. O runner não aplica throttling adicional ao percurso de runtime.
Viewport mobile, headless e SwiftShader não representam Android intermediário
ou GPU real. Safari/iOS, Firefox, teclado e leitor de tela em browser visível
continuam no P8. A capa de Clouds é um asset remoto do Spotify e será
reavaliada junto com privacidade e falha de terceiros no P7/P8.
