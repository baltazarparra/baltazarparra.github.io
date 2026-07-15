# Preflight P3 - The Edit

> **Resultado:** direção candidata pronta para o gate. O checklist valida o
> storyboard, não substitui motion P4, implementação P5 ou QA final P8.

## Automatizado

| Check | Desktop | Mobile | Estado |
|---|---:|---:|---|
| Lighthouse acessibilidade | 100 | 100 | Passou |
| Lighthouse boas práticas | 100 | 100 | Passou |
| Erros de console | 0 | 0 | Passou |
| JSON de tokens | Válido | Válido | Passou |
| `git diff --check` | Limpo | Limpo | Passou |

O audit não ponderado `valid-source-maps` sinaliza os módulos grandes de
Three.js importados diretamente pelo storyboard. A build final não usará essa
forma de importação; o diagnóstico não reduziu a categoria de boas práticas.

## Contraste

| Par | Razão | Requisito | Estado |
|---|---:|---:|---|
| Texto `#F2F0EA` / canvas `#0C0D0F` | 17,06:1 | 4,5:1 | Passou |
| Muted `#AAA9A4` / canvas `#0C0D0F` | 8,26:1 | 4,5:1 | Passou |
| Accent `#E65B2F` / canvas `#0C0D0F` | 5,46:1 | 4,5:1 | Passou |
| Canvas `#0C0D0F` / accent `#E65B2F` | 5,46:1 | 4,5:1 | Passou |

## Checklist visual e anti-template

- [x] Design read, dials e modo de redesign explícitos.
- [x] Tema único, uma cor de acento e sistema de raio zero.
- [x] Instrument Sans auditada sob OFL 1.1 e self-hosted no storyboard.
- [x] Hero desktop e mobile cabem no viewport; H1 tem uma linha e statement tem
  duas.
- [x] Navegação permanece em uma linha e oferece área de toque mínima de 44 px.
- [x] Uma única eyebrow uppercase no hero; nenhuma numeração de seção.
- [x] Nenhum card grid equivalente, bento, scroll cue, cursor customizado, pill,
  glow externo ou marquee.
- [x] Seções usam composições distintas: split hero, portrait + manifesto,
  editorial rows, primary + notes, full-bleed media, cover split e links soltos.
- [x] Assets reais no hero, About, Caipora e Clouds; nenhum screenshot falso.
- [x] Fogo aparece como acento e corte, não como background contínuo.
- [x] Mobile reordena DOM em uma coluna; Caipora foi recomposta em mídia + copy,
  não recortada do desktop.
- [x] Sem em dash ou en dash na copy visível.
- [x] Imagens possuem alt; smile decorativo fica fora da árvore acessível.
- [x] Focus visible e skip link presentes.
- [x] Reduced-motion tem captura e não oculta conteúdo.
- [x] 404 funciona sem WebGL e oferece retorno real.

## Evidência visual

### Desktop

- `hero-desktop-1440x1000.png`
- `about-desktop-1440x1000.png`
- `projects-desktop-1440x1000.png`
- `caipora-desktop-1440x1000.png`
- `clouds-desktop-1440x1000.png`
- `elsewhere-desktop-1440x1000.png`
- `404-desktop-1440x1000.png`
- `hero-reduced-motion-1440x1000.png`

### Mobile

- `hero-mobile-390x844.png`
- `about-mobile-390x844.png`
- `projects-mobile-390x844.png`
- `caipora-mobile-390x844.png`
- `clouds-mobile-390x844.png`
- `elsewhere-mobile-390x844.png`
- `404-mobile-390x844.png`

## Limitações abertas

1. Os frames foram renderizados em Chrome headless/WSL; Safari, Firefox,
   teclado, screen reader e devices reais pertencem aos gates posteriores.
2. O Chrome usou o WebGL disponível no WSL e registrou avisos de software
   fallback/readback; a P4/P5 deve medir o smile em condições reproduzíveis.
3. A capa de Clouds veio do CDN oficial em 300 x 300. Produção exige o
   arquivo-mestre e confirmação de direitos.
4. Copy de Projects é rascunho inferido dos títulos e descrições atuais; deve
   ser confirmada contra os repositórios antes do congelamento.
5. Frames são estáticos. Motion intensity 7 só pode ser afirmado depois dos
   protótipos medidos da P4.
