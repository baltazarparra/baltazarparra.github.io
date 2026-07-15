# Direção de arte - C2 The Edit

> **Estado:** aprovada no gate P3 em 15 jul. 2026, incluindo frames responsivos,
> copy inicial e tokens. Produção permanece intocada.

## Design read

Portfolio autoral para o próprio Baltz, com linguagem
editorial-cinematográfica e acabamento imediatamente perceptível. O objetivo
não é converter nem programar uma lembrança, mas fazer cada corte parecer
necessário.

- **Design variance:** 8/10.
- **Motion intensity:** 7/10, a validar apenas na P4.
- **Visual density:** 3/10.
- **Modo:** redesign completo com IA e conteúdo preservados.
- **Fundação:** linguagem própria. Nenhum design system de produto será usado.

## Decisões da direção

### Tema e cor

Um único tema grafite, sem inversão entre seções. O fundo deixa de ser fogo
contínuo. O laranja térmico aparece em foco, link ativo, um corte entre Caipora
e Clouds e pequenos reflexos no smile. Nenhum glow externo.

| Papel | Valor | Uso |
|---|---|---|
| Canvas | `#0C0D0F` | Fundo único |
| Superfície | `#15171A` | Planos de mídia e navegação |
| Texto | `#F2F0EA` | Títulos e corpo principal |
| Texto secundário | `#AAA9A4` | Metadados e apoio |
| Linha | `#34363B` | Separação funcional esparsa |
| Acento | `#E65B2F` | Corte térmico, foco e estado ativo |

O tema escuro foi aprovado nos frames; não é uma preferência presumida do
Baltz. A implementação deve manter contraste mesmo sem transparência, shader
ou imagem.

### Tipografia

**Instrument Sans variável** em toda a página. Width, peso e escala criam
contraste sem introduzir uma serifa decorativa ou uma segunda voz tipográfica.
A família é open source sob SIL Open Font License 1.1 e oferece eixos de peso e
largura, além de variações estilísticas.

- Display: 600-700, largura 90-95%, tracking negativo.
- Corpo: 400-500, largura normal, máximo de 65 caracteres por linha.
- Metadados: 500, tamanho pequeno e tracking moderado; nunca usados para numerar
  seções.
- Fonte self-hosted com `font-display: swap` e fallback Arial no protótipo.
- Fonte primária: <https://github.com/Instrument/instrument-sans>.

### Forma e composição

- Sistema inteiramente reto, raio zero.
- Grid de 12 colunas no desktop; cada seção usa uma composição diferente.
- Hero assimétrico e inteiro no viewport.
- Sem cards equivalentes, bento, pills, numeração, scroll cue ou cursor próprio.
- Imagens são os objetos: portrait, smile 3D, Caipora e capa de Clouds.
- Uma única faixa térmica faz o corte entre os dois showcases autorais.

### Hierarquia das seções

1. **Hero:** nome, frase autoral e smile em plano curto.
2. **About:** portrait + declaração; marcas aparecem como evidência textual.
3. **Writing:** dois ensaios em linhas editoriais assimétricas.
4. **Projects:** uma obra principal e duas notas menores, sem fingir equivalência.
5. **Caipora:** imagem real em plano largo com copy sobre a cena.
6. **Clouds:** capa oficial e créditos em composição de duas massas.
7. **Connect/footer:** links tipográficos, sem CTA comercial.
8. **404:** mensagem funcional, retorno e marca estática; nenhum canvas exigido.

## Copy inicial em inglês

### Hero

- **Name:** `baltz.`
- **Statement:** `Software, systems and small worlds.`
- **Supporting line:** `I design software with code agents, then write, make
  games and record music.`

### About

`I design software with code agents as architectural components. The rest is a
decade of shipping difficult things with teams.`

Evidência factual: Nike, Thoughtworks, XP Investimentos, Serasa, Dasa, MRV,
CVC, GFT e CI&T. A lista não será chamada de "trusted by" e não simulará logos
sem arquivos oficiais.

### Writing

- `Sharing skills with NPX`
- `What is Harness Design and why does it matter?`

### Projects

- **AI-Native Engineering:** `An interactive field guide to engineering
  software with AI at the center of the workflow.`
- **Crypto Transfer DApp:** `A browser experiment for transferring
  cryptocurrency.`
- **Subtitle Scraping:** `A Puppeteer and Node.js utility for extracting
  subtitle data.`

Essas descrições são rascunhos editoriais. Elas devem ser confirmadas contra os
projetos antes do congelamento da copy na P6.

### Caipora

`Brazilian folk horror, built one hard-earned hit at a time.`

### Clouds

`Clouds. An EP by Baltz.`

### Connect

`Elsewhere.` seguido de LinkedIn, GitHub, dev.to, Spotify e itch.io.

### 404

`This page does not exist.` e `Back to baltz.dev`.

## Assets e direitos

- `public/smile.glb`, `avatar.jpg`, `baltz-portrait.jpg` e `caipora.jpeg` são
  assets existentes do repositório.
- A capa de Clouds é carregada no protótipo pelo CDN oficial informado pelo
  endpoint oEmbed do Spotify. Ela não foi copiada para o repositório.
- Antes da implementação final, obter o arquivo-mestre da capa e confirmar
  autorização de publicação fora do embed do Spotify.
- O protótipo inclui Instrument Sans e sua licença OFL somente para avaliação.

## Responsividade e acesso

- Abaixo de 768 px, toda assimetria vira uma coluna linear; ordem visual e DOM
  permanecem iguais.
- Hero usa `min-height: 100dvh`; nome, frase e smile cabem na primeira tela.
- Navegação fica em uma linha no desktop e reduz a três anchors no mobile.
- Todo link possui foco visível de 2 px no acento.
- Reduced motion remove cortes, pin e transformações; nenhuma informação depende
  de hover ou canvas.
- Imagens têm alt funcional; o smile decorativo fica fora da árvore acessível.
- Clouds mantém ação externa e nunca inicia áudio automaticamente.

## Motion como token, não como efeito

A P3 define somente o vocabulário. A P4 deve prototipar e medir:

1. **Cut:** reveal rápido de máscara ou clip que troca hierarquia.
2. **Settle:** entrada de texto por opacity + transform curto.
3. **Thermal cut:** único gesto de fogo entre Caipora e Clouds.

Qualquer animação que não comunique hierarquia, narrativa, feedback ou mudança
de estado deve ser removida. Sem loader por padrão.

## Frames

O storyboard isolado fica em `docs/prototypes/p3/`. As capturas validadas estão
em `docs/evidence/p3/` para hero, conteúdo, showcases, connect/footer, 404 e
mobile. O preflight registra contraste, Lighthouse e limitações.

## Gate P3

Gate concluído em 15 jul. 2026 por aprovação explícita do Baltz. Direção, copy
inicial, frames responsivos, tokens, contraste e checklist anti-template estão
registrados neste documento e em `docs/evidence/p3/`.
