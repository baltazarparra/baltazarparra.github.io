---
title: O que o Recoil não é
tags: city
resume: Recentemente Dan Abramov comentou sobre uma interpretação errada a cerca do novo experimento do Facebook
date: 01 de Junho de 2020
---

O Facebook abriu recentemente, mais um de seus experimentos,
dessa vez um novo gerenciador de estados, o <a href='https://github.com/facebookexperimental/Recoil'>Recoil</a>.
<br><br>
O <a href='https://recoiljs.org/docs/introduction/getting-started'>
getting started</a> já dá uma boa idéia sobre a nova proposta do Facebook.
<br><br>
Porém, algumas publicações tiveram uma má interpretação sobre a nova ferramenta, a posicionando como a nova gerenciadora de estados oficial do __React__.
<br><br>
<a href='https://github.com/gaearon'>Dan Abramov</a>, co-criador de ferramentas como __Redux__ e __Create React App__, atualmente trabalha no core do __React__, comentou sobre isso no seu twitter:
<br><br>
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I’ve seen some folks misunderstand Recoil and spread that confusion so I feel the need to clarify.<br><br>Recoil is not in any way an “official” state management library for React. And neither is (or ever was) Redux.<br><br>The only “official” state library for React is React itself.</p>&mdash; Dan Abramov (@dan_abramov) <a href="https://twitter.com/dan_abramov/status/1262143522959998977?ref_src=twsrc%5Etfw">May 17, 2020</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
<br><br>
Ou seja, nem o Recoil nem o Redux, o próprio React é a forma padrão para lidar com estados. Mas ok, dito isso então:
<br><br>
<h3>o que o Recoil é?</h3>
A maior parte dos gerenciadores de estado hoje são baseados em <a href='https://facebook.github.io/flux/'>Flux</a>, como uma alternativa a isso, o React nos trouxe a <a href='https://pt-br.reactjs.org/docs/context.html'>Context API</a>, que nos permite compartilhar dados sem passar manualmente pelas camadas de componente para componente.
<br><br>
O Recoil aparece como uma solução pra quem quer evitar as complexidades herdadas do Flux e precisa de uma solução mais robusta que a Context API.
<br><br>
Pra quem ficou interessado e quer por a mão na massa, na documentação oficial tem um <a href='https://recoiljs.org/docs/basic-tutorial/intro'>tutorial</a> bem simples para seguir.
