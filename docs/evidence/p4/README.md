# Evidência P4 - motion concept

Coleta feita em 15 jul. 2026 pelo runner CDP de
`docs/prototypes/p4/measure.mjs`.

## Ambiente

- WSL2 Linux 6.18.33.2, Microsoft hypervisor;
- AMD Ryzen 5 5600X, 6 vCPUs expostas, 19 GiB de memória;
- Node 24.5.0;
- Chrome 149.0.7827.200 headless;
- Vite 8.0.16, GSAP 3.13.0 e Three.js r184;
- sem CPU ou network throttling;
- cache HTTP desativado em cada navegação;
- SwiftShader habilitado para o frame estático do Smile;
- desktop 1440 x 1000, `touch=0`;
- mobile emulado 390 x 844, `touch=1`.

Cada variante normal possui três execuções desktop e três mobile. Reduced motion
possui uma execução por perfil, usada como verificação funcional, não como
distribuição estatística. O autoplay percorre o documento inteiro em 5 s e
coleta frame deltas durante o percurso e 350 ms de estabilização.

## Arquivos

- `metrics-raw.json`: 20 execuções individuais com ambiente e erros de console.
- `metrics-summary.json`: mediana e intervalo mínimo-máximo por cenário.
- `cut-*.png`, `pin-*.png`, `words-*.png`: frames representativos.
- `cut-*-reduced.png`: estados estáticos desktop/mobile.

## Resultado

- 60 fps aproximados em todas as medianas;
- frame time p50 de 16,7 ms e p95 de 16,7-16,8 ms;
- zero long tasks e zero erros de console;
- heap delta mediano de 0,38-0,43 MiB em Cut/Pin e 0,59-0,71 MiB em Words;
- motion-ready mediano entre 837,7 e 1.034,9 ms no harness sem bundle.

## Limitações

Mobile é emulação de viewport e touch, não aparelho real. Headless/SwiftShader
não representa GPU de produção. A capa de Clouds é remota e o harness importa
módulos sem bundle; portanto inicialização serve para comparar alternativas,
não para prever o build P5. Device real, Safari e Firefox continuam no P8.
