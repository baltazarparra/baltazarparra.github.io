# Storyboard P3 - The Edit

Protótipo estático e isolado para julgar direção de arte. Não importa código do
site atual, não é preview de produção e não decide a stack da v2.

## Visualizar

Na raiz do repositório:

```bash
python3 -m http.server 4173
```

Abrir `http://127.0.0.1:4173/docs/prototypes/p3/` e
`http://127.0.0.1:4173/docs/prototypes/p3/404.html`.

Para capturas determinísticas, usar `?frame=hero`, `?frame=work`,
`?frame=writing`, `?frame=projects`, `?frame=caipora`, `?frame=clouds` ou
`?frame=elsewhere`.

O modelo `public/smile.glb` e Three.js são carregados localmente. A capa de
Clouds usa o CDN oficial retornado pelo Spotify oEmbed e possui fallback
tipográfico quando a rede falha.

Instrument Sans é distribuída sob SIL Open Font License 1.1. Fonte:
<https://github.com/Instrument/instrument-sans>.
