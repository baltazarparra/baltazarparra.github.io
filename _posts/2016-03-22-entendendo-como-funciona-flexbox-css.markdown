---
layout: post
title:  "Entendendo Flexbox CSS: Parte 02 - Justificando Conteúdo"
date:   2016-03-22 06:05:31 -0200
categories: css flexbox frontend baltazar
---

## \{ justify-content \}

O valor default de 'justify-content' é 'flex-start', onde o conteúdo segue o fluxo do seu container,

Exemplo, se sua 'flex-direction' for row, o conteúdo segue da esquerda pra direita, se for 'column',
segue de cima para baixo, e assim por diante.

Agora vem a glória... E se você quiser colocar esse conteúdo todo a direita da sua página?
Com o flexbox isso é bem simples, vamos usar o valor 'flex-end' da propriedade 'justify-content',
e ver como o conteúdo se comporta.

<p data-height="168" data-theme-id="22766" data-slug-hash="PNpvpa" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/PNpvpa/">flexbox-1.6</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

É lindo de se ver, certo? Mas calma, tem mais, quer alinhar ao centro?

<p data-height="168" data-theme-id="22766" data-slug-hash="jqBovN" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/jqBovN/">flexbox-1.7</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

'justify-content: center;' Simples assim. Também podemos declarar diferentes tipos de espaçamentos,
com 'space-between' e 'space-around'.

<p data-height="220" data-theme-id="22766" data-slug-hash="MypdPK" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/MypdPK/">flexbox-1.8</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

A diferença entre os dois é que 'space-between' começa colado com o seu container, 'space-around' não.

## \{ flex-direction: column; \}

Apenas lembrando que o comportamento pode ser um pouco diferente, quando você altera a 'flex-direction'.
Mudando o fluxo do container para 'column' ou seja, de cima para baixo, pode ser que o resultado não seja como você imaginou,
Provavelmente você não definiu uma altura para seu container, então feito isso, o comportamento será como esperado,
para todos valores citados acima.

<p data-height="400" data-theme-id="22766" data-slug-hash="mPWYaG" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/mPWYaG/">flexbox-1.9</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

##### Fortemente inspirado no site [flexbox.io](http://flexbox.io) de [Wes Bos](http://wesbos.com/).

Próximo artigo: [Alinhando Items](http://baltazarparra.github.io/css/flexbox/frontend/baltazar/front/end/2016/03/23/entendendo-como-funciona-flexbox-css.html)
