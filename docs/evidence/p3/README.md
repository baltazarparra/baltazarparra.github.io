# Evidência visual P3 - The Edit

Capturas do storyboard isolado `docs/prototypes/p3/`, feitas em Chrome 149 no
ambiente WSL em 15 jul. 2026. Elas validam composição e responsividade, não
motion, performance em device real ou a implementação final.

Perfis previstos:

- desktop: 1440 x 1000;
- mobile: 390 x 844;
- 404: desktop e mobile;
- reduced-motion: hero desktop.

A capa de Clouds é uma referência remota do CDN oficial retornado pelo Spotify
oEmbed. O arquivo-mestre ainda deve ser fornecido antes da produção.

## Resultado

- 7 frames desktop, 7 frames mobile e 1 frame reduced-motion.
- Lighthouse: acessibilidade 100 e boas práticas 100 em desktop/mobile.
- Contraste e checklist anti-template em `preflight.md`.
- Limitações: Chrome headless/WSL, capa remota em 300 x 300 e motion ainda não
  prototipado.
