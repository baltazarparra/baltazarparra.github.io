---
layout: post
title:  "JavaScript de Baunilha - Percorrendo o documento."
date:   2016-04-25 06:24:31 -0200
categories: Javascript
---

Vimos [aqui](http://baltazarparra.github.io/js/vanilla/baunilha/javascript/baltazar/parra/2016/04/21/javascript-de-baunilha.html) algumas técnicas para selecionar nossos elementos quando precisarmos manipular o DOM,
mas isso as vezes ainda não é o suficiente, e se precisarmos além de selecionar nosso elemento, extender isso para o filho dele? ou o elemento irmão mais próximo? o 'Document' e o 'Element' tem API's próprias para isso.

O 'Document' entende seus objetos, os objetos de 'Element' e os objetos 'Text' como nós da sua árvore, dito isso, seguem as propriedades mais importantes dessa API:

- *parentNode* - O nó que é pai do nó selecionado
- *childNode* - Um objeto parecido com um array, mas funciona somente para leitura, representa uma lista dinâmica com os nós filhos, do nó selecionado
- *firstChild*, *lastChild* - Primeiro e Último nó filho, do nó selecionado
- *nextSibling*, *previousSibling* - O nó irmão, próximo e anterior ao nó selecionado

O problema em trabalhar com essa API é que ela é uma sensível a conteúdo, se você adicionar algo ao documento, pode alterar toda estrutura da árvore de nós, bagunçando sua lógica.

Portanto, a API de 'Elements' é mais interessante para nós, já que ela só olha os elementos e ignora nós de texto por exemplo.
Suas principais propriedades são:

- *children* - É como a *childNode* mas retorna somente os elementos
- *firstElementChild*, *lastElementChild* - Parecidos com *firstChild* e *lastChild*, mas somente para elementos
- *nextElementSibling*, *previousElementSibling* - Parecidos com... ah, vocês já sacaram né?

Próximo post vou falar um pouco sobre os atributos ;) até lá!

<!--```javascript-->

<!--var familia = document.querySelectorAll('.irmaos');-->
<!--var irmaoProximo = familia.nextSibling;-->

<!--```-->
