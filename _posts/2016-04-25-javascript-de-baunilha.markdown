---
layout: post
title:  "JavaScript de Baunilha - Percorrendo o documento."
date:   2016-04-25 06:24:31 -0200
categories: js vanilla baunilha javascript baltazar parra
---

Vimos [aqui](http://baltazarparra.github.io/js/vanilla/baunilha/javascript/baltazar/parra/2016/04/21/javascript-de-baunilha.html) algumas técnicas para selecionar nossos elementos quando precisarmos manipular o DOM,
mas isso as vezes ainda não é o suficiente, e se precisarmos além de selecionar nosso elemento, extender isso para o filho dele? ou o elemento irmão mais próximo? o 'Document' e o 'Element' tem API's próprias para isso.

O 'Document' entende seus objetos, os objetos de 'Element' e os objetos 'Text' como nós da sua árvore, dito isso, seguem as propriedades mais importantes dessa API:
 
- *parentNode* - O nó que é pai do nó selecionado
- *childNode* - Um objeto parecido com um array, mas funciona somente para leitura, representa uma lista dinâmica com os nós filhos, do nó selecionado
- *firstChild*, *lastChild* - Primeiro e Último nó filho, do nó selecionado
- *nextSibling*, *previousSibling* - O nó irmão, próximo e anterior ao nó selecionado



```javascript

var familia = document.querySelectorAll('.irmaos');
var irmaoProximo = familia.nextSibling;

```

