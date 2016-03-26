---
layout: post
title:  "Entendendo Flexbox CSS: Parte 04 - Alinhando Conteúdo"
date:   2016-03-25 07:28:31 -0200
categories: css flexbox frontend baltazar front end
---

## \{ align-content \}

O 'align-content' é uma propriedade que depende de certos contextos, no exemplo a seguir,
vamos setar nosso 'flex-wrap' com o valor 'wrap' e vamos dar uma altura ao nosso container.
O valor default de 'align-content' é 'stretch'. Ele preenche todo o espaço do nosso container.

<p data-height="700" data-theme-id="22766" data-slug-hash="YqVOXm" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/YqVOXm/">flexbox-1.14</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Essa propriedade é muito simples, então vou passar rapidão pelos valores, demoro?

Ai temos o 'flex-start' que posiciona o conteúdo no começo do nosso container, e diferente do 'stretch',
ele não preenche todo nosso container, ele se limita ao nosso conteúdo.

<p data-height="600" data-theme-id="22766" data-slug-hash="oxwgYR" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/oxwgYR/">flexbox-1.16</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Temos o já conhecido 'flex-end' que posiciona nosso conteúdo ao final do container.

<p data-height="600" data-theme-id="22766" data-slug-hash="rewajK" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/rewajK/">flexbox-1.17</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Logicamente, temos o 'center' que eu não preciso dizer o que faz...

<p data-height="600" data-theme-id="22766" data-slug-hash="jqwEBL" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/jqwEBL/">flexbox-1.18</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

E ainda temos o 'space-between'

<p data-height="600" data-theme-id="22766" data-slug-hash="remZLK" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/remZLK/">flexbox-1.15</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

e o 'space-around'.

<p data-height="600" data-theme-id="22766" data-slug-hash="aNwJwQ" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/aNwJwQ/">flexbox-1.19</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Tudo isso, vem para nos dar uma gama enorme de poder, que até então só tinhamos atraves de hacks's e gambis.

##### Fortemente inspirado no site [flexbox.io](http://flexbox.io) de [Wes Bos](http://wesbos.com/).
