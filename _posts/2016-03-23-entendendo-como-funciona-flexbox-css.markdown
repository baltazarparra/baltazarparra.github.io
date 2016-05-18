---
layout: post
title:  "Entendendo Flexbox CSS: Parte 03 - Alinhando Itens"
date:   2016-03-23 05:44:31 -0200
categories: CSS
---

Lembra quando te pediam para alinhar um conteúdo ao centro?
Lembra daqueles layouts do inferno, cheios de armadilhas do tinhoso?

Todos nós já passamos por isso, sabemos o quanto é doloroso.

Agora, pelo poder da flex-box, eu ordeno que você seja libertado dessa dor na sua vida.

## \{ align-items \}

Uma das propriedades mais espetacularmente foda do flexbox é sem dúvidas a 'align-items'.
Chega de 'transform: translate hack' toda vez que você quiser centralizar um conteúdo horizontalmente,
agora, com o poder do flexbox só precisamos recitar duas palavras mágicas: 'ALIGN-ITEMS' modafocka...

<p data-height="208" data-theme-id="22766" data-slug-hash="eZWgOd" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/eZWgOd/">flexbox-1.10</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>
XABLAU!!!

Tudo centralizadinho, bonitinho, sem hack. O valor default de 'align-items' é 'stretch', raramente vamos precisar dele.
Ainda temos os valores 'flex-end' que posiciona nosso conteúdo no final do container.

<p data-height="268" data-theme-id="22766" data-slug-hash="zqwNGw" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/zqwNGw/">flexbox-1.11</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Temos o 'flex-start' que joga no começo do container.

<p data-height="268" data-theme-id="22766" data-slug-hash="MymJae" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/MymJae/">flexbox-1.12</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

E temos ainda, um valor muito louco, o 'baseline', que centraliza tudo de acordo com a linha dos textos.

<p data-height="268" data-theme-id="22766" data-slug-hash="wGdgKV" data-default-tab="result" data-user="baltazarparra" class="codepen">See the Pen <a href="http://codepen.io/baltazarparra/pen/wGdgKV/">flexbox-1.13</a> by Baltazar Parra (<a href="http://codepen.io/baltazarparra">@baltazarparra</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="//assets.codepen.io/assets/embed/ei.js"></script>

Dahora né?

##### Fortemente inspirado no site [flexbox.io](http://flexbox.io) de [Wes Bos](http://wesbos.com/).

Próximo artigo: [Alinhando Conteúdo](http://baltazarparra.github.io/css/flexbox/frontend/baltazar/front/end/2016/03/25/entendendo-como-funciona-flexbox-css.html)
