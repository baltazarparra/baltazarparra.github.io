# Baseline técnico — site atual

> **Estado:** baseline P0 concluído em 15 jul. 2026.
> **Escopo:** repositório local e preview do build de produção. Nenhum deploy ou
> alteração no site publicado foi realizado.

## Identificação

| Item | Valor |
|---|---|
| Commit de referência | `491571cc6cf3aa92a00f182379c4233a741b18bb` |
| Branch | `main`, acompanhando `origin/main` |
| Sistema | Ubuntu em WSL2, kernel `6.18.33.2-microsoft-standard-WSL2`, x86_64 |
| Node.js | `24.14.0` |
| Corepack | `0.34.6` |
| pnpm | `11.8.0` |
| Chrome | `149.0.7827.200`, headless nas medições |
| Lighthouse | `13.4.0`, axe-core `4.12.1` |
| Data/hora dos relatórios | 15 jul. 2026, entre 11:19 e 11:24 UTC |

O shell do WSL não possuía Node.js Linux no `PATH`. Para não alterar o
ambiente global nem as dependências do projeto, o baseline usou a distribuição
oficial do Node.js 24.14.0 em `/tmp` e o pnpm declarado em `package.json` via
Corepack. A automação `agent-browser` descrita no skill não estava instalada;
as verificações visuais foram feitas com o Google Chrome headless disponível e
os relatórios Lighthouse registram a configuração efetivamente usada.

## Arquitetura observada

O site é uma SPA React 19/Vite 8. A página usa GSAP/ScrollTrigger e Lenis para
motion e scroll, React Three Fiber/Three.js para o hero 3D e o fundo em shader,
além de tiers adaptativos em `src/config/qualityConfig.js`. O build divide
React, Three.js e `Hero3D`, mas o fundo WebGL continua no caminho inicial.

Pontos positivos que devem ser preservados ou reavaliados conscientemente na
v2:

- suporte a `prefers-reduced-motion` e desativação de motion pesado em mobile;
- quality tiers e DPR adaptativo;
- lazy load do `Hero3D`;
- pausa ou redução de trabalho quando a página está oculta/offscreen;
- listeners passivos e agendamento de input/scroll com `requestAnimationFrame`;
- conteúdo semântico básico com um `main`, um `h1`, headings de seção e títulos
  no iframe.

## Saúde do projeto

| Verificação | Resultado |
|---|---|
| `pnpm lint` | Passou, zero warnings |
| `pnpm build` | Passou, 612 módulos transformados em 4,56 s |
| Saída total de `dist/` | 2.007.622 bytes |
| Console no Lighthouse | Sem erros |
| Inspector issues | Sem ocorrências |

O build emite um alerta de chunk acima de 500 kB. Maiores artefatos antes de
compressão:

| Artefato | Tamanho | Gzip registrado pelo Vite |
|---|---:|---:|
| `three.*.js` | 892,88 kB | 234,96 kB |
| `react.*.js` | 188,98 kB | 59,90 kB |
| `index.*.js` | 168,98 kB | 60,96 kB |
| `Hero3D.*.js` | 134,85 kB | 37,78 kB |
| CSS | 22,60 kB | 5,44 kB |

O payload total observado pelo Lighthouse foi 708.321–708.322 bytes. Os dois
maiores recursos transferidos foram o bundle Three.js (~233,6 kB) e
`smile.glb` (~217,2 kB).

## Lighthouse: três execuções por perfil

As tabelas usam a mediana; o intervalo entre parênteses é mínimo–máximo. Os
relatórios JSON completos ficam em `docs/evidence/p0/`.

| Perfil | Performance | Acessibilidade | Boas práticas | SEO |
|---|---:|---:|---:|---:|
| Mobile simulado | 52 (52–54) | 100 | 100 | 100 |
| Desktop simulado | 63 (63–63) | 100 | 100 | 100 |

| Métrica | Mobile simulado | Desktop simulado |
|---|---:|---:|
| FCP | 3.063 ms (3.058–3.070) | 644 ms (639–647) |
| LCP | 3.571 ms (3.562–3.582) | 720 ms (715–726) |
| Speed Index | 4.573 ms (3.802–4.828) | 2.846 ms (2.672–2.849) |
| TBT | 11.736 ms (10.425–13.844) | 6.567 ms (6.525–6.683) |
| TTI | 19.788 ms (18.268–23.488) | 9.294 ms (9.242–9.499) |
| CLS | 0,0156 (0,0126–0,0156) | 0,0015 (0,0011–0,0017) |

### Interpretação

Os 100 pontos de acessibilidade, boas práticas e SEO significam que os checks
automatizados selecionados não encontraram falhas; não substituem teclado,
screen reader, browser/device real ou validação editorial de metadados.

Performance é o débito dominante. No perfil mobile mediano, o Lighthouse
registrou 17,3 s de trabalho na main thread, 20 long tasks e estimou 175 kB de
JavaScript não usado. O avatar de 400×400 é exibido com aproximadamente 63×63
e oferece economia estimada de 42 kB com formato/tamanho responsivo.

O desktop recebeu o aviso de que a página demorou demais para concluir dentro
do limite. A primeira tentativa sem `maxWaitForLoad=10000` expirou porque a
animação contínua impede o estado de CPU quiet esperado. Por isso, TBT/TTI são
um sinal de risco forte e reproduzível, mas não uma medição de FPS em hardware
real. O Chrome headless também usou renderização WebGL do ambiente WSL, que não
representa uma GPU de usuário.

## Acessibilidade e conteúdo

O axe/Lighthouse não encontrou falhas de contraste, ordem de headings,
landmarks ou nomes acessíveis. Links externos usam `rel="noreferrer"`, a imagem
do hero tem `alt` e o iframe Spotify tem `title`.

Débitos não anulados pelo score automatizado:

1. `html lang="pt-BR"` contradiz o conteúdo predominantemente em inglês.
2. Não há skip link; a necessidade e o desenho da navegação serão validados na
   v2, e teclado/screen reader permanecem pendentes para QA manual.
3. A copy mistura inglês com `Brasil` e o `alt` atual está em português.
4. O reduced-motion tem evidência visual em emulação, não em device/browser
   real.
5. O design atual depende visualmente de WebGL; o fallback sem WebGL ainda não
   foi comprovado.

## SEO, metadados e terceiros

O Lighthouse deu SEO 100 por validade técnica, mas há dívida editorial e de
domínio:

- canonical, `og:url`, `robots.txt` e `sitemap.xml` apontam para
  `baltazarparra.github.io`, enquanto o roadmap define `baltz.dev` como domínio
  final;
- `og:image` e `twitter:image` usam caminho relativo, não URL absoluta;
- o sitemap informa `lastmod` de 25 abr. 2025;
- a tipografia é carregada do Google Fonts;
- o sprite da Caipora é solicitado da publicação GitHub Pages;
- o iframe do Spotify é carregado diretamente quando sua seção entra em cena.

Esses itens entram no backlog da v2. Corrigi-los no site atual é uma trilha
independente e exige autorização específica, conforme o plano.

## Evidência visual

- [Desktop 1440×1000](evidence/p0/desktop-1440x1000.png)
- [Mobile 390×844 em DPR 2](evidence/p0/mobile-390x844@2x.png)
- [Reduced motion 1440×1000](evidence/p0/reduced-motion-1440x1000.png)

As três capturas carregaram conteúdo significativo, shader e hero sem tela em
branco ou overlay de erro. A captura mobile é emulação de viewport, não teste
em aparelho físico.

## Conclusão do P0

O baseline é reproduzível, lint/build estão limpos e as limitações do ambiente
estão registradas. O gate P0 está concluído. Isso autoriza iniciar o catálogo de
padrões (P1), mas não autoriza deploy, redesign do site atual nem considerar os
budgets finais atendidos.
