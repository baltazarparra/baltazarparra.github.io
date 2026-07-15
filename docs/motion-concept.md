# Motion concept - The Edit

> **Estado:** aprovado no gate P4 em 15 jul. 2026, incluindo Pinned Edit,
> Cut/Settle limitados, Words fora do sistema global, som fora, budgets e
> fallbacks. O site atual permanece intocado.

## Resultado primeiro

Recomendo **B - Pinned Edit** como coreografia. O título de Projects permanece
fixo no desktop enquanto cada prova editorial avança; Cut e Settle entram como
vocabulário de transição, não como uma máscara repetida em toda seção. Touch
remove o pin sem remover conteúdo. Reduced motion mostra o estado final
estático.

Não recomendo Words como sistema global. Ele reforça a voz de S8, mas faz a
leitura depender do scroll, transforma cada heading em dezenas de nós e teve o
maior delta de heap. Uma frase específica ainda pode receber tratamento verbal
na P6 se resolver uma necessidade concreta, sem importar o padrão inteiro.

Também recomendo **som fora do conceito**. Não existe requisito narrativo para
áudio, Clouds já possui ação externa sob gesto e um controle sonoro criaria
estado, acessibilidade e polish sem melhorar a frase-mãe.

## As três hipóteses

| Código | Mecânica | Função narrativa | Resultado crítico |
|---|---|---|---|
| A - Cut | Clip vertical de mídia, copy em settle, faixa térmica scrubbed | Faz cada mudança parecer um corte de edição | Coerente e barato, mas repetido em toda seção vira truque de template |
| B - Pin | Tese de Projects fixada; provas avançam em scrub; demais cenas usam settle | Mantém a tese visível enquanto o trabalho a comprova | Melhor síntese de S1 + S8; exige fallback touch deliberado |
| C - Words | Palavras ganham opacidade/posição pelo scroll; mídia escala | Dá força verbal e transforma leitura em ritmo | Mais invasivo para leitura e maior custo de DOM/memória |

As três variantes percorrem Hero, About, Writing, Projects, Caipora, Clouds e
Elsewhere. O Smile real é um frame estático; fundo reativo, loop 3D e tiers não
foram misturados neste teste.

## Arco recomendado

1. **Hero:** header em 560 ms; copy em settle de 720 ms com stagger de 70 ms;
   Smile revelado por um único cut de 920 ms. Nada acompanha o scroll.
2. **About e Writing:** entrada curta por opacity + 32 px; leitura permanece
   livre, sem palavra bloqueada.
3. **Projects:** título fixado somente em desktop com ponteiro não touch. Cada
   prova passa de 0,22 para 1 de opacity, 56 px para 0 e scale 0,965 para 1 com
   scrub de 450 ms.
4. **Caipora:** mídia entra como plano, copy assenta depois; nenhum parallax
   contínuo.
5. **Thermal cut:** uma única faixa progride entre Caipora e Clouds.
6. **Clouds:** plano mais silencioso, sem autoplay de áudio.
7. **Elsewhere:** settle final; links permanecem interativos durante todo o
   percurso.

## Fallbacks

| Perfil | Coreografia |
|---|---|
| Desktop, fine pointer, motion permitido | Pin em Projects, settle nas demais cenas, cut de mídia e faixa térmica |
| Touch ou até 768 px | Sem pin; mesma ordem de DOM, settle curto e cut one-shot |
| Baixa capacidade | Opacity + translate curto; mídia e Smile estáticos; sem clip-path scrubbed |
| `prefers-reduced-motion` | Estados finais instantâneos; sem pin, scrub, clip-path, scale ou parallax |
| JS/GSAP indisponível | CSS inicial não oculta conteúdo; página permanece navegável |

## Budgets P4 propostos

Estes budgets valem para o harness de motion e serão endurecidos/redefinidos na
vertical slice P5 quando bundle, tiers e assets finais existirem.

| Métrica | Budget | Resultado P4 |
|---|---:|---:|
| FPS aproximado mediano | >= 55 | 60 em todos os cenários |
| Frame time p50 | <= 16,8 ms | 16,7 ms |
| Frame time p95 | <= 20 ms | 16,7-16,8 ms |
| Frames acima de 20 ms | <= 1% | 0% nas medianas |
| Long tasks >= 50 ms durante scroll | 0 | 0 |
| Delta de heap durante scroll | <= 1 MiB | 0,38-0,71 MiB |
| Motion-ready sem bundle, mediana | <= 1.200 ms | 837,7-1.034,9 ms |
| Motion-ready sem bundle, pior execução | <= 1.500 ms | 1.118,4 ms |
| Erros de console | 0 | 0 |

## Medições

Mediana de três execuções; intervalo mínimo-máximo entre parênteses. Reduced
motion teve uma execução funcional por perfil.

| Variante | Perfil | Motion-ready ms | FPS | p95 ms | Long tasks | Delta heap MiB |
|---|---|---:|---:|---:|---:|---:|
| Cut | Desktop | 1.034,9 (1.016,0-1.098,0) | 60 | 16,7 (16,7-16,8) | 0 | 0,38 (0,37-0,38) |
| Cut | Mobile emulado | 881,7 (814,5-920,6) | 60 | 16,8 (16,7-16,8) | 0 | 0,40 (0,40-0,59) |
| Pin | Desktop | 914,0 (730,9-957,5) | 60 | 16,7 (16,7-16,8) | 0 | 0,43 |
| Pin fallback | Mobile emulado | 957,2 (715,8-1.118,4) | 60 | 16,8 (16,7-16,8) | 0 | 0,42 (0,42-0,60) |
| Words | Desktop | 873,9 (857,0-1.039,8) | 60 | 16,7 | 0 | 0,59 (0,59-0,61) |
| Words | Mobile emulado | 837,7 (836,9-912,1) | 60 | 16,7 (16,7-16,8) | 0 | 0,71 (0,66-0,72) |
| Reduced Cut | Desktop | 970,3 | 60 | 16,7 | 0 | 0,14 |
| Reduced Cut | Mobile emulado | 758,2 | 60 | 16,7 | 0 | 0,15 |

Ambiente, método, JSON bruto e capturas estão em `docs/evidence/p4/`. A coleta
usa Chrome 149 headless no WSL2, sem throttling, com cache desativado e percurso
automático de 5 s. O perfil desktop força `touch=0` porque Chrome headless se
identifica como touch; o perfil mobile força `touch=1`.

## Tokens candidatos

Os valores canônicos estão em `docs/design-tokens.json`:

- `power3.out` para settle;
- `power4.inOut` para máscara;
- linear para scrub;
- 560/720/920 ms no hero;
- 780 ms no settle, 950 ms no media cut e 650 ms no thermal cut;
- 70 ms de stagger de copy;
- smoothing de 350/450/500 ms para thermal, projects e mídia.

## Gate P4

Gate concluído em 15 jul. 2026 por aprovação explícita do Baltz:

1. B - Pinned Edit como espinha, com Cut/Settle limitados;
2. Words fora do sistema global;
3. som fora do conceito;
4. budgets e fallbacks acima.

P5 compara stack e modelo de isolamento antes de qualquer fundação da v2 ou
preview externo.
