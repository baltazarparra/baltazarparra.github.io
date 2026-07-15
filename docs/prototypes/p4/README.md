# P4 motion harness

Harness descartável da direção The Edit. Ele reutiliza o storyboard P3 e os
assets existentes, mas não importa nem altera a aplicação em `src/`.

## Variantes

- `?motion=cut`: máscaras rápidas em mídia, settle de copy e corte térmico
  scrubbed.
- `?motion=pin`: título de Projects fixado no desktop enquanto as provas
  avançam; touch recebe settle sem pin.
- `?motion=words`: títulos divididos em palavras e revelados pelo scroll;
  mídia usa scale + opacity.
- `&reduced=1`: estado final estático, sem pin, scrub, clip ou transform.
- `&touch=0|1`: override exclusivo do laboratório. Sem o parâmetro, a página
  usa media queries de ponteiro.
- `&autoplay=1&duration=5000`: percorre o arco e publica o resultado em
  `window.__P4_METRICS__`.
- `&capture=1`: oculta os controles do laboratório.

## Execução local

Com o servidor Vite na porta 4175:

```sh
pnpm exec vite --host 127.0.0.1 --port 4175
node docs/prototypes/p4/measure.mjs --runs=3 --duration=5000
```

O runner usa somente APIs nativas do Node e Chrome DevTools Protocol. O Chrome
fica em `/usr/bin/google-chrome` por padrão; outro executável pode ser informado
com `--chrome=/caminho`. `--base`, `--output`, `--modes`, `--profiles` e
`--reduced` permitem reproduzir subconjuntos.

## Limite intencional

O Smile real é carregado e renderizado uma vez para que seu custo de entrada
apareça na medição. Ele não possui loop contínuo neste harness: P4 compara
coreografia de scroll; animação 3D e tiers pertencem à vertical slice P5.
