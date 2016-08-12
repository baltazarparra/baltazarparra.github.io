---
layout: post
title:  "JavaScript de Baunilha - Conteúdo de Elemento."
date:   2016-05-16 06:41:31 -0200
categories: Javascript
---

## conteúdoDeElementoComoHTML

innerHTML a parte, vou explicar agora um recurso introduzido pelo IE e padronizado em HTML5,
o 'insertAdjacentHTML'.
Ele nos permite inserir uma string "adjacente" dentro do nosso conteúdo HTML...

**- hnmm, como assim mano?**

Ok, vou mostrar:

~~~html

<div id="one">one</div>

~~~

Inserindo novo elemento adjacente

~~~javascript

var newDiv = document.getElementById('one');

newDiv.insertAdjacentHTML('beforeend', '<div id="two">two</div>');

~~~

Conteúdo HTML modificado

~~~html

<div id="one">one</div>

<div id="two">two</div>

~~~

Sacou?

Essa propriedade pede dois argumentos, o primeiro argumento precisa ser um desses quatro valores,
'beforebegin' (antes da primeira tag), 'afterbegin' (no final da primeira tag), 'beforeend' (antes da tag de fechamento)e 'afterend' (depois da tag de fechamento) e o segundo argumento fica por conta da marcação que você quiser inserir.
Tranquilo né?

Aproveitando o embalo, vamos conversar um pouco sobre:

## conteúdoDeElementoComoTextoPuro

Para tal, usamos a propriedade 'textContent':

~~~html

<p>
  Sou um texto triste =(
</p>

~~~

~~~javascript

var para = document.getElementsByTagName('p')[0];
var text = para.textContent;
para.textContent = 'Agora sou um textoContente =D';

~~~
~~~html

<p>
  Agora sou um textoContente =D
</p>

~~~

A mágica do textContent é concatenar todos descendentes do nó Text do elemento, bem simples certo?
Próximo artigo, quero mostrar um pouco sobre criar, inserir e excluir nós.

*Namaste!*
