---
layout: post
title:  "Entendendo Flexbox CSS: Parte 01 - Como Funciona?"
date:   2016-03-14 06:57:31 -0200
categories: css flexbox frontend baltazar
---

## \{ O que é flexbox?! \}

"Flexible Box of God Layout Model", também conhecida como 'flexbox', é parte da especificação CSS3. Ele provê um novo modelo de 'box' otimizado para design de interface, isso mesmo irmão, menos gambiarras com o 'float' e layouts mais concisos.

## \{ display: flex; \}

Vamos começar com uma estrutura básica, criei um container, que vai receber o novo valor Flex, para a propriedade 'display' e dentro do container coloquei algumas div's.

Automaticamente, todos elementos dentro do container com 'display:flex' se tornam flex-items, lembrando que você pode aplicar esse valor para qualquer elemento.

<p data-height="168" data-theme-id="0" data-slug-hash="jqMmOq" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/jqMmOq/">flexbox-1.1</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Veja que nosso container se extende por toda página, e os elementos dentro dele (flex-items) se comportam de uma forma totalmente nova comparado a valores usuais da propriedade display, como inline e block por exemplo.

Podemos ainda alterar o valor de display para inline-flex, dizendo ao nosso container que não queremos que ele se extenda por toda página, limitando ele aos itens.

<p data-height="168" data-theme-id="22766" data-slug-hash="KzgmNN" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/KzgmNN/">flexbox-1.2</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

## \{ flex-direction: row; \}

Outra propriedade interessante é a flex-direction, com ela podemos dizer ao nosso container flexível, qual eixo os elementos devem seguir, por padrão o valor de flex-direction é row, onde os elementos são alocados horizontalmente da esquerda para direita, mas podemor alterar isso facilmente, mudando o valor para column.

<p data-height="368" data-theme-id="22766" data-slug-hash="pyEPpw" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/pyEPpw/">flexbox-1.3</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Agora nossos elementos seguem um novo eixo, eles são alocados verticalmente de cima para baixo.

Podemos ainda, alterar o sentido dos eixos, acrescentando '-reverse' aos nossos valores, por exemplo 'flex-direction: row-reverse' mudaria a ordem dos nossos elementos que ao invés de seguirem da esquerda para direita, começariam da direita para esquerda.

<p data-height="168" data-theme-id="22766" data-slug-hash="ZWpKxv" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/ZWpKxv/">flexbox-1.4</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Logicamente o mesmo acontece ao valor column-reverse, alterando o sentido do eixo, ordenando os elementos de baixo para cima.

<p data-height="368" data-theme-id="22766" data-slug-hash="RaGVyb" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/RaGVyb/">flexbox-1.5</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

##### Fortemente Inspirado no site [flexbox.io](http://flexbox.io) de [Wes Bos](http://wesbos.com/).

Próximo artigo: [Justificando Conteúdo](http://baltazarparra.github.io/css/flexbox/frontend/baltazar/2016/03/22/entendendo-como-funciona-flexbox-css.html)
