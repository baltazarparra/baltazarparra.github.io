# Preflight P5 - The Edit

## Direção visual

- Um tema grafite explícito, aprovado em P3; sem alternância presumida.
- Instrument Sans self-hosted sob OFL, com subset compatível com a copy inglesa.
- Um acento laranja térmico; superfícies e texto permanecem neutros.
- Raio zero em UI. Círculos aparecem apenas no smile ilustrativo, não em cards.
- Sem cards repetidos, badges, numeração de seções, loader, cursor customizado ou
  hero com texto sobre gradiente.
- Assets reais aprovados: retrato, Caipora, `smile.glb`, capa oficial de Clouds.
- Hero, Caipora, transição térmica e 404 inspecionados em desktop/mobile.

## Conteúdo e acesso

- Landmarks, heading único, skip link, navegação por anchors e 404 presentes no
  HTML estático.
- Copy, links e mídia continuam disponíveis sem JavaScript.
- Texto nunca recebe `visibility:hidden` nem anima opacidade; contraste
  automatizado alcança 100 em seis relatórios.
- Touch remove pin e não importa o Smile 3D. Reduced motion não anima shader ou
  Smile. Fallbacks permanecem dirigidos.
- Foco visível usa token de contraste. Auditoria manual aprofundada de teclado,
  zoom, leitor de tela e browsers reais continua no P8.

## Motion e runtime

- Pinned Edit usa pin apenas em desktop com ponteiro fino; touch mantém fluxo.
- Cut e Settle são transições pontuais; não há animação de entrada no primeiro
  viewport nem loop 3D permanente.
- Smile 3D usa `frameloop="demand"` e carrega somente após mouse/caneta.
- Shader é importado por `IntersectionObserver` apenas em desktop sem touch;
  mobile, reduced motion e sem JavaScript usam o fallback térmico CSS.
- Não há listener global de scroll/mouse implementado à mão; ScrollTrigger e
  R3F controlam scheduling.
- p95 de frames abaixo de 20 ms e zero long tasks nas sete execuções P5.

## Build e isolamento

- `v2/dist/` é separado do `dist/` publicado pela raiz.
- ESLint, Astro check e build limpos; CI executa lint, check, build e Lighthouse.
- JS externo inicial gzip: 46.710 bytes. JS compartilhado/WebGL adicional:
  aproximadamente 307 kB gzip. `smile.glb`: 216.936 bytes.
- Canonical aponta para `https://baltz.dev/`; nenhum workflow de deploy foi
  criado e nenhuma configuração de produção atual foi modificada.
