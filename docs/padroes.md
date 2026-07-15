# Padrões e antirrepertório — baltz.dev v2

> **Estado:** catálogo e gate P1 concluídos em 15 jul. 2026.
> **Curadoria:** S1 e S8 preferidas; S3, S4, S5, S6 e S7 rejeitadas; S2 neutra.
> **Escopo:** princípios para a one-page. Nenhuma referência autoriza copiar
> composição, identidade, assets, texto ou código sem licença.

## Como ler

Cada padrão responde a cinco perguntas: qual é a fonte verificável, qual
princípio ela demonstra, como poderia servir ao conteúdo do Baltz, qual o risco
e qual o custo provável. Os códigos de custo são:

- **B:** baixo — DOM/CSS/SVG simples;
- **M:** médio — timeline, vídeo otimizado ou canvas restrito;
- **A:** alto — WebGL contínuo, áudio, física, múltiplas cenas ou pré-carga.

Licença **Ref.** significa referência visual/conceitual apenas. Demos do Codrops
são MIT salvo indicação específica, mas artigos, imagens e design continuam
protegidos. GSAP 3.13+ e seus plugins estão disponíveis no pacote oficial; a
licença vigente ainda deve ser revisada no gate de stack. `p5.brush` é MIT.

## Verificação e durabilidade

As fontes essenciais abaixo são páginas públicas dos criadores, Awwwards,
Codrops, GSAP ou 14islands. Nenhuma depende do artifact autenticado citado no
roadmap.

O Chrome headless confirmou um risco que o catálogo não deve esconder:

- a versão HTML de Bruno Simon carregou e preservou conteúdo/contato sem 3D;
- MONOLOG permaneceu no fundo preto do loader;
- Elliott Mangham permaneceu em 60% do loader;
- Julien Calot permaneceu em 0% do loader;
- Pacôme Pertant exibiu uma página 500 com retorno para a home.

Esses resultados são do ambiente WSL/headless em 15 jul. 2026 e não provam que
o mesmo ocorre em browsers comuns. Provam, porém, que loader e WebGL não podem
ser a única porta de entrada da v2. O executável `agent-browser` continuou
ausente mesmo após a instalação do Bubblewrap; a verificação visual usou Chrome
headless e a validação estrutural usou as páginas públicas indexadas.

## Cobertura

| Área | Padrões | Estado |
|---|---:|---|
| Hero | 3 | Coberto |
| About | 3 | Coberto |
| Writing | 2 | Coberto |
| Projects | 3 | Coberto |
| Caipora | 3 | Coberto |
| Clouds | 3 | Coberto |
| Connect | 3 | Coberto |
| Footer | 2 | Coberto |
| Entrada/loading | 3 | Coberto |
| Arco de scroll | 3 | Coberto |
| Transições internas | 3 | Coberto |
| Cursor | 3 | Coberto |
| 404 | 3 | Coberto |

## Seções

### Hero

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [Julien Calot][R01] | O trabalho autoral ocupa o palco; identidade e acervo formam uma única superfície. Para Baltz, fogo/smile podem apresentar a pessoa sem virar decoração atrás de um slogan genérico. | Excesso visual pode esconder cargo e CTA; loader observado não concluiu. **A** | Expressão visual Ref.; composição própria obrigatória. |
| [Elliott Mangham][R02] | Nome, função e credenciais aparecem imediatamente; prova profissional é interface, não rodapé. Serve para combinar “AI-native engineer” com marcas/resultados verificáveis. | Pode parecer dashboard/currículo e envelhecer rápido; loader observado não concluiu. **M** | DOM/CSS próprio; Ref. |
| [Pacôme Pertant][R03] | Entrada declara disciplina e oferece som opt-in antes da experiência. Para Clouds, antecipa que música é parte autoral sem autoplay. | Uma “enter screen” cria fricção e a home retornou 500 no teste. **A** | Ref.; não depender da entrada para acessar conteúdo. |

**Síntese para o hero:** conteúdo e prova precisam existir no primeiro frame;
fogo/smile podem ser a assinatura, mas nunca o mecanismo exclusivo de acesso.

### About

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [MONOLOG][R04] | About começa com uma tensão concreta e liga origem, princípios, processo e resultado. Para Baltz: explicar como engenharia, agentes e criação autoral coexistem. | Copy grandiosa sem evidência soa autopromocional; modal/loader pode bloquear leitura. **B–M** | DOM/CSS próprio; Ref. |
| [Elliott Mangham][R02] | Credenciais são progressivamente reveladas: posição, reconhecimento, marcas, disponibilidade. Permite um About curto com prova expansível. | Listas de logos/prêmios podem dominar personalidade. **B** | `details`/disclosure acessível; Ref. |
| [Julien Calot — About][R05] | Uma linha do tempo conecta prática, disciplinas e trajetória sem parágrafo biográfico longo. Pode transformar os +10 anos em marcos selecionados. | Timeline extensa vira arquivo e quebra a one-page. **B–M** | Grid/linha SVG; Ref. |

### Writing

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [Personal Project Platform][R06] | Escrita, experimentos, recursos e processo formam um sistema vivo. Os dois posts do Baltz podem aparecer como “ideias que alimentam o trabalho”, não cards de blog. | Expandir para CMS ou arquivo contradiz escopo. **B–M** | Case study Ref.; implementar índice estático próprio. |
| [Federico Pian Portfolio][R07] | O portfolio recupera um espaço pessoal para ideias e projetos; escrita explica motivação e processo. Serve para dar contexto editorial aos links externos do dev.to. | Resumir demais vira teaser vazio; incorporar conteúdo de terceiros pode duplicar SEO. **B** | Link externo com título, data, tese e fonte; Ref. |

**Direção recomendada:** dois ensaios como pares editoriais assimétricos, cada
um com uma frase-tese legível sem hover. Nada de duas cards idênticas.

### Projects

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [Stefan Vitasović 2025][R08] | Grid de vídeo WebGL, tipografia e transições compõem um sistema, mas uma seleção pequena continua legível. Aplicável aos três projetos com previews distintos. | Vídeo/WebGL pode competir com Caipora e repetir o peso do hero. **A** | Case Ref.; técnicas próprias e mídia comprimida. |
| [Gianluca Gradogna 2025][R09] | Design e fotografia são tratados como uma narrativa conjunta, não como disciplinas isoladas. Para Baltz, cada projeto pode revelar um aspecto diferente da prática. | Direção fotográfica genérica não combina com projetos de engenharia. **M** | DOM/mídia; Ref. |
| [Podium][R10] | Ritmo, movimento e contenção preservam o caráter do trabalho em uma sequência contínua. Os três projetos podem ser beats do arco, não um grid utilitário. | Uma sequência cinematográfica pode dificultar comparação e links rápidos. **M–A** | Next/GSAP/Lenis/R3F descritos no case; Ref. |

### Caipora

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [14islands — GOALS][R11] | O movimento nasce da cultura e da ação do jogo; personagens e assets contam o produto. Caipora deve parecer um mundo jogável brasileiro, não um banner do itch.io. | Recriar um microsite inteiro dentro da one-page; vídeo pesado. **M–A** | React/Next/WebGL/R3F descritos; visual Ref. |
| [Bruno Simon][R12] + [fallback HTML][R13] | A mecânica é a apresentação da competência, mas há opções, qualidade, controles e uma rota HTML. Para Caipora: uma interação curta com saída clara, não uma navegação obrigatória. | Física/3D domina tempo e acessibilidade. **A** | Site informa código MIT e música CC0; assets próprios continuam obrigatórios. |
| [Sketching the Impossible][R14] | Limitação técnica vira linguagem: geometrias simples + texturas desenhadas, mecânica antes do acabamento. Pode aproximar folk horror, pixel art e shader sem realismo genérico. | Copiar corredor, sketch ou pintura no hover seria cópia distintiva. **M–A** | Case aponta código-fonte; licença precisa ser confirmada antes de reutilizar código. |

### Clouds

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [Pacôme Pertant][R03] | Som é escolha explícita e organiza a experiência. Clouds pode ter escuta opt-in e visual reativo apenas depois do gesto. | Tela de entrada e áudio global são desproporcionais para um EP secundário. **M–A** | Web Audio/Spotify após consentimento; Ref. |
| [Arts Corporation][R15] | Áudio pode reforçar identidade se pausa com tab inativa/vídeo e nunca inicia intrusivamente. Define comportamento, não apenas estética. | Estado de áudio complexo; conflito com leitor de tela e mídia do sistema. **M** | Case Ref.; APIs nativas e controles semânticos. |
| [Aether 1][R16] | Fluxos de partículas e shaders reativos traduzem som em matéria visual; técnicas GPU e controllers preservam performance. Para Clouds, usar uma única resposta visual pequena. | Produto inteiro é experimento WebGL; copiar escala seria excessivo. **A** | Case Ref.; mecanismos próprios, budget obrigatório. |

### Connect

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [Elliott Mangham][R02] | Disponibilidade, custo/contexto e CTA aparecem junto dos canais. Para Baltz: declarar intenção de contato e oferecer LinkedIn/email/GitHub sem ambiguidade. | Expor agenda ou promessa comercial sem necessidade. **B** | Links semânticos; Ref. |
| [MONOLOG][R04] | CTA é conclusão da narrativa e oferece próximo passo coerente, não uma lista de ícones. Pode fechar com uma frase curta ligada ao conceito. | Linguagem de agência não combina com site pessoal. **B–M** | DOM/CSS próprio; Ref. |
| [Self Aware][R17] | Formulário/inquiry e navegação escultórica mostram que contato também pode ter personalidade. Para a one-page, a personalidade deve envolver o CTA, não esconder o endereço. | Formulário aumenta spam, privacidade e estados de erro; 3D prejudica foco. **M–A** | Site premiado como Ref.; sem formulário no escopo atual. |

### Footer

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [Studiogusto][R18] | O logo interativo conclui a linguagem sem adicionar novo conteúdo. O smile pode voltar como epílogo de baixa intensidade. | Novo canvas no fim mantém GPU ativa desnecessariamente. **M–A** | Case inclui mecanismo WebGL; expressão Ref. |
| [14islands][R19] | Footer reduz tudo a uma frase de fechamento e email direto. Para Baltz, preservar contato e autoria após o clímax visual. | Minimalismo demais pode omitir navegação/privacidade necessária. **B** | DOM/CSS próprio; Ref. |

## Costuras

### Entrada e loading

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [Jonas Reymondin][R20] | Loader e transição compartilham o mesmo pixel-system usado pelo cursor e pelo conteúdo. Se houver espera real, o loader deve nascer da linguagem da v2. | Efeito sem progresso real mascara lentidão. **M** | Case Ref.; implementação própria. |
| [Sanni Sahil — loader][R21] | Loader, hero playground e 404 fazem parte do mesmo sistema de personalidade. A consistência entre estados importa mais que complexidade. | Awwwards mostra o elemento, não um contrato técnico ou licença. **M** | Ref. apenas. |
| [Awwwards — Need for Speed][R22] | Loader mantém continuidade quando há espera real; budget e condições de rede devem vir antes do efeito. | Loader artificial aumenta abandono e esconde regressão. **B–M** | Diretriz Ref.; progresso deve ser mensurável. |

**Regra para a v2:** sem loader por padrão. Ele só entra se a vertical slice
medir espera inevitável; conteúdo básico deve aparecer antes do WebGL.

### Arco global de scroll

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [Podium][R10] | A página é uma sequência temporal contínua; ritmo e remoção de excessos preservam a história. É a referência mais aderente à one-page. | Scroll muito dirigido limita exploração. **M–A** | Case Ref.; arquitetura descrita. |
| [More Than a Portfolio][R23] | Cada mudança de câmera responde a uma mensagem; a técnica serve uma frase honesta. Fogo/smile/Caipora/Clouds precisam ter papéis narrativos, não aparições. | Mundo 3D completo excede escopo e budget. **A** | Case Ref.; KTX2/instancing/fallback como repertório. |
| [14islands — GOALS][R11] | Motion é núcleo porque traduz o assunto, e o sistema continua flexível para o conteúdo. A energia de jogo pode aparecer só no beat Caipora. | Aplicar ritmo esportivo ao site inteiro seria incoerente. **M–A** | Ref. |

### Transições internas

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [SVG masks + ScrollTrigger][R24] | Máscara comunica mudança de cena com `viewBox` responsivo e densidade menor no mobile. Pode representar fumaça/cinza sem outro canvas. | Scrub longo cansa; máscara complexa cria gaps/CPU. **M** | Demo Codrops MIT; GSAP 3.13+; redesenhar forma. |
| [Ciel Rose][R25] | Planos WebGL e DOM compartilham geometria para expansão fullscreen e continuidade entre projetos. Útil se mídia realmente precisar atravessar seções. | Sincronização DOM/WebGL e lifecycle elevam risco. **A** | Case Ref.; técnica própria. |
| [Stefan Vitasović 2025][R08] | Um pequeno vocabulário de text reveal, grid e transição se repete com consistência. A v2 deve ter 2–3 gestos, não um efeito por seção. | Repetição excessiva vira template. **M–A** | Case Ref.; SplitText requer cuidado semântico. |

### Cursor

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [Jonas Reymondin][R20] | Cursor amostra cor do conteúdo e deixa rastro pixelado; a resposta vem do material sob o ponteiro. A brasa pode reagir ao contexto, não só seguir o mouse. | Readback/overdraw e loop contínuo; nunca em touch/reduced-motion. **A** | Case Ref.; implementação própria. |
| [Stop-motion crayon cursor][R26] | Material e gesto coincidem; o rastro só nasce ao pressionar. Sugere uma brasa que “marca” durante uma interação intencional. | `p5.brush` avisa que alta qualidade pode não servir a real-time. **A** | Demo Codrops MIT; `p5.brush` MIT. |
| [Custom Cursor Effects][R27] | Cursor muda por contexto e mantém fallback CSS. Pode sinalizar abrir, arrastar e ouvir sem substituir foco/semântica. | Esconder cursor nativo destrói affordance; Paper.js é custo extra. **M** | Demo Codrops MIT; preferir CSS/GSAP já existente. |

### 404

| Referência | Princípio e uso possível | Risco/custo | Implementação/licença |
|---|---|---|---|
| [OPANCHUUSAGI 404][R28] | Personagem e ilustração transformam erro em continuação do universo. Smile ou Caipora podem reagir ao “desvio”. | Minigame sem retorno claro cria novo beco sem saída. **M** | Awwwards Ref. |
| [Carl Gordon — 404 interativo][R29] | Enter screen, hero 3D e 404 compartilham o mesmo objeto/sistema. Reuso coerente reduz sensação de página genérica. | 3D obrigatório no erro piora falha de asset/WebGL. **A** | Awwwards Ref. |
| [Neo Vision 404][R30] | A página de erro mantém a voz irreverente da marca e oferece recuperação. Para Baltz, humor pode existir sem “Oops”. | Gag interna pode envelhecer ou ofuscar navegação. **B–M** | Awwwards Ref. |

**Critério da v2:** mensagem direta, link de retorno real, conteúdo funcional
sem WebGL e personalidade como melhoria progressiva.

## Antirrepertório: o que evitar

1. **Seções numeradas + título uppercase gigante + cards iguais.** É o
   esqueleto atual e um padrão saturado de portfólio.
2. **Dark + neon + orb 3D sem relação com conteúdo.** O fogo só entra se decidir
   narrativa, luz, material e transições.
3. **Loader de porcentagem teatral.** Elliott/Julien ficaram presos no teste;
   progresso falso ou obrigatório está vetado.
4. **Smooth scroll como demonstração de poder.** Inércia não pode atrasar
   teclado, touch, hash links ou leitura rápida.
5. **Cursor que substitui affordance.** Brasa é melhoria para ponteiro fino;
   foco, cursor nativo e touch permanecem completos.
6. **Um efeito diferente por seção.** A v2 precisa de um vocabulário curto e
   repetível, ligado à frase-mãe.
7. **WebGL como único DOM.** Conteúdo, CTA, 404 e fallback precisam sobreviver à
   falha do canvas.
8. **Som como surpresa.** Nunca autoplay; controle persistente, opt-in e pausa
   em tab inativa.
9. **Cards para conteúdos que não são equivalentes.** Caipora, Clouds, posts e
   projetos têm pesos e mídias diferentes; o layout deve assumir isso.
10. **Referência como prova de adequação.** Prêmio valida repertório, não público,
    performance, acessibilidade ou identidade do Baltz.

## Shortlist para o gate P1

Escolher referências aqui significa escolher princípios, não combinar seus
layouts.

| Código | Referência | O que está sendo avaliado | Alerta |
|---|---|---|---|
| S1 | [Podium][R10] | Uma narrativa contínua, cinematográfica e contida | Pode dirigir demais o scroll |
| S2 | [Julien Calot][R01] | Conteúdo autoral como superfície principal | Loader falhou no headless; densidade alta |
| S3 | [Elliott Mangham][R02] | Prova profissional explícita e progressiva | Pode parecer currículo; loader falhou |
| S4 | [GOALS][R11] | O universo do jogo traduzido em motion e personagens | Escala de microsite não cabe inteira |
| S5 | [Jonas Reymondin][R20] | Um sistema gráfico único conectando loader/cursor/texto | Pixel/glitch pode não combinar com Baltz |
| S6 | [Pacôme Pertant][R03] | Som opt-in e portfolio espacial de motion | Home retornou 500 no teste; entrada cria fricção |
| S7 | [Bruno Simon][R12] | Mecânica autoral memorável com fallback real | 3D navegável é referência de princípio, não de escopo |
| S8 | [MONOLOG][R04] | Narrativa verbal forte, provas e CTA | Tom de agência e loader preto não devem ser copiados |

## Resultado do gate P1

- **Preferidas:** S1 — Podium e S8 — MONOLOG.
- **Rejeitadas:** S3 — Elliott Mangham, S4 — GOALS, S5 — Jonas Reymondin,
  S6 — Pacôme Pertant e S7 — Bruno Simon.
- **Sem seleção:** S2 — Julien Calot permanece neutra, não aprovada por
  omissão.

A P2 deve combinar o princípio de narrativa contínua e contida de S1 com a
força verbal, evidência e conclusão de S8. A seleção não autoriza copiar layout,
tom de agência ou motion distintivo. Rejeitar uma referência também não veta
cada técnica presente nela; um princípio isolado só pode retornar se resolver
um requisito do conceito e for aprovado explicitamente pelo Baltz.

## Referências

[R01]: https://www.juliencalot.com/
[R02]: https://elliott.mangham.dev/
[R03]: https://pacomepertant.com/
[R04]: https://bymonolog.com/
[R05]: https://www.juliencalot.com/about
[R06]: https://tympanus.net/codrops/2025/09/17/the-making-of-a-personal-project-platform-a-portfolio-that-grew-out-of-process-and-play/
[R07]: https://tympanus.net/codrops/2024/10/02/case-study-federico-pian-portfolio-2024/
[R08]: https://tympanus.net/codrops/2025/03/05/case-study-stefan-vitasovic-portfolio-2025/
[R09]: https://tympanus.net/codrops/2025/01/30/case-study-gianluca-gradogna-portfolio-25/
[R10]: https://tympanus.net/codrops/2026/06/23/podium-building-a-website-where-running-becomes-storytelling/
[R11]: https://www.14islands.com/work/goals
[R12]: https://bruno-simon.com/
[R13]: https://bruno-simon.com/html/
[R14]: https://tympanus.net/codrops/2026/06/11/sketching-the-impossible-a-3d-portfolio-built-without-a-single-3d-model/
[R15]: https://tympanus.net/codrops/2025/04/22/designing-for-flow-not-frustration-the-transformation-of-arts-corporation/
[R16]: https://tympanus.net/codrops/2025/08/06/building-aether-1-sound-without-boundaries/
[R17]: https://www.awwwards.com/sites/self-aware
[R18]: https://tympanus.net/codrops/2023/04/25/case-study-studiogusto/
[R19]: https://www.14islands.com/
[R20]: https://tympanus.net/codrops/2026/03/16/jonas-reymondins-portfolio-reclaiming-the-ui-eye-through-systems-code-and-pixel-motion/
[R21]: https://www.awwwards.com/inspiration/contact-section-sanni-sahil-portfolio
[R22]: https://www.awwwards.com/brainfood-mobile-performance-vol3.pdf
[R23]: https://tympanus.net/codrops/2026/04/28/more-than-a-portfolio-building-a-scroll-driven-3d-world-with-something-to-say/
[R24]: https://tympanus.net/codrops/2026/03/11/svg-mask-transitions-on-scroll-with-gsap-and-scrolltrigger/
[R25]: https://tympanus.net/codrops/2025/04/07/case-study-ciel-rose/
[R26]: https://tympanus.net/codrops/2025/02/06/building-a-playful-stop-motion-crayon-cursor-in-p5-js/
[R27]: https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/
[R28]: https://www.awwwards.com/inspiration/404-opanchuusagi-official
[R29]: https://www.awwwards.com/inspiration/enter-screen-interaction-carl-gordon-portfolio-c-2024
[R30]: https://www.awwwards.com/inspiration/404-neo-vision-no-bs-web-agency

### Licenças e documentação técnica

- [Codrops — licença dos demos](https://tympanus.net/codrops/licensing/)
- [GSAP — instalação e distribuição dos plugins](https://gsap.com/docs/v3/Installation/)
- [GSAP SplitText — acessibilidade e performance](https://gsap.com/docs/v3/Plugins/SplitText/)
- [`p5.brush` — licença MIT](https://p5-brush.cargo.site/license-1)
