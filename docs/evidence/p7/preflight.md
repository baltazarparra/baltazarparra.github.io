# Preflight P7 - polish e costuras

## Entrada e carregamento

- [x] Conteúdo útil é o primeiro frame; loader não se justifica pela medição.
- [x] Mídia entra progressivamente sem cobrir copy ou navegação.
- [x] Não há flash de estado invisível quando JavaScript está desativado.

## Interação

- [x] Links de navegação têm resposta de hover, foco e press.
- [x] Links externos recebem seta e deslocamento curto motivado pela saída.
- [x] Perfis respondem com deslocamento lateral e seta, sem depender de hover
  para compreensão.
- [x] Outline de 2 px permanece íntegro em 17 alvos de teclado.
- [x] Touch mantém alvos e ações sem gesto oculto ou cursor customizado.
- [x] Microinterações usam transform e cor, sem animar layout pesado.

## Motion e redução

- [x] Pinned Edit continua a única espinha de scroll.
- [x] Mobile/touch usa settle curto, sem pin.
- [x] Nenhuma copy depende de opacidade animada para ficar legível.

## Resiliência

- [x] Smile tem poster inicial, catch de import, timeout de 8 s e boundary para
  modelo/WebGL.
- [x] Shader tem fallback inicial, catch de import, timeout de 8 s e boundary
  para WebGL.
- [x] Portrait, Caipora e Clouds têm loading, ready, error e timeout.
- [x] Imagem quebrada é ocultada; composição e copy permanecem.
- [x] Bloqueio deliberado de `smile.glb` removeu o canvas e manteve o poster.
- [x] Bloqueio deliberado da capa preservou o fallback dirigido de Clouds.

## Spotify, som e terceiros

- [x] Player incorporado foi descartado; áudio continua opt-in no destino.
- [x] Não há iframe, SDK, cookie ou script do Spotify.
- [x] A capa remota usa lazy loading e `referrerpolicy="no-referrer"`.
- [x] A dependência remota tem fallback visual testado.
- [x] Som ambiente permanece fora conforme aprovação P4.

## 404

- [x] Copy e retorno são os aprovados no P3.
- [x] Página funciona sem WebGL e sem JavaScript.
- [x] Rota inexistente local respondeu HTTP 404.
- [x] Link retornou para a home.
- [x] Canonical aponta para `/404.html` no domínio final.

## Qualidade

- [x] Lint, Astro check e build passaram sem warning, erro ou hint.
- [x] Lighthouse final teve medianas 98 / 100 / 100 / 100.
- [x] LCP mediano 2,271 s, TBT 0 ms e CLS 0.
- [x] Zero erro de console ou request inesperado nos quatro perfis normais.
- [x] `git diff --check` passou.
- [x] Inspeção visual confirmou desktop, mobile, reduced, fallback e 404.
- [x] Walkthrough aprovado pelo Baltz.
