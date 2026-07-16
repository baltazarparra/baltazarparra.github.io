# Preflight P6 - direção e interface

## Direção

- [x] Conceito preservado: The Edit continua legível sem explicação externa.
- [x] Tema grafite único, aprovado no P3, mantido como decisão deliberada.
- [x] Laranja térmico permanece o único acento cromático.
- [x] Instrument Sans, superfícies retas e grid assimétrico permanecem
  consistentes.
- [x] Writing recebeu composição própria, sem cards equivalentes ou repetição
  do layout de Projects.
- [x] Caipora e Clouds continuam como showcases de maior escala.
- [x] Imagens reais substituem placeholders e fake screenshots.

## Conteúdo

- [x] Zero lorem ipsum, TODO, FIXME ou placeholder.
- [x] Dois posts, três projetos, dois showcases e cinco perfis conferidos com o
  inventário aprovado.
- [x] Datas dos posts usam `time` e `datetime`.
- [x] Uma ação por post; não há título e CTA duplicando a mesma intenção.
- [x] Nenhum travessão longo aparece na interface.
- [x] Há apenas um eyebrow em caixa alta, no hero.
- [x] A copy permanece em inglês, conforme direção aprovada.

## Estrutura e responsividade

- [x] Sete famílias de seção têm hierarquia e composição próprias.
- [x] Hero cabe no primeiro viewport desktop e mobile.
- [x] Mobile reorganiza Writing em fluxo linear e remove o offset editorial.
- [x] Não há `h-screen`, largura fixa problemática, scroll horizontal ou pista
  de scroll decorativa.
- [x] Raios circulares aparecem apenas na ilustração geométrica do smile; a UI
  permanece reta.
- [x] Não há bento grid, mural de logos, depoimentos, marquee ou serifa
  ornamental. Itens não aplicáveis ao conteúdo foram intencionalmente omitidos.

## Interação e acesso

- [x] Skip link e landmarks preservados.
- [x] Ordem de foco segue a leitura; 17 alvos percorridos com Tab.
- [x] Todos os alvos do percurso ficaram visíveis com outline de 2 px.
- [x] Links externos têm texto ou nome acessível descritivo.
- [x] Touch não depende de hover.
  estados finais dirigidos.
- [x] Sem JavaScript preserva todo o conteúdo e todos os links.
- [x] Sem WebGL preserva posters de Smile e transição térmica.
- [x] Não há formulário; validação, erro e submit de formulário não se aplicam.

## Performance e engenharia

- [x] React e Three permanecem fora do caminho inicial e entram somente sob
  intenção ou proximidade quando o perfil permite.
- [x] Não há listener global de scroll; GSAP/ScrollTrigger controla o arco.
- [x] Lint, Astro check e build passaram sem warning, erro ou hint.
- [x] Lighthouse mobile passou no critério de mediana definido em D-0002.
- [x] Runtime manteve p95 de 16,8 ms e zero long tasks.
- [x] Console e requests ficaram limpos nos quatro perfis.
- [x] `git diff --check` passou.

## Pendências conscientemente fora do P6

- [ ] Device real e browsers não-Chromium: P8.
- [ ] Leitor de tela, zoom e reflow manual: P8.
- [ ] Timeout e erro visual de imagens remotas: P7.
- [ ] Decisão documentada sobre embed do Spotify: P7.
- [ ] Walkthrough de 404 e retorno: P7.
