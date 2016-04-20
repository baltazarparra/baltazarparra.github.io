---
layout: post
title:  "JavaScript de Baunilha - Visão geral do DOM"
date:   2016-04-19 21:19:31 -0200
categories: js vanilla baunilha javascript baltazar parra
---

Apesar de não ser muito complicada, a Document Object Model (aka DOM) possui muitos detalhes de arquitetura.

Os elementos HTML são representados como uma árvore de objetos, essa árvore possui dois tipos de nós, um nó para cada elemento HTML e
outro nó representando strings de texto.

Vamos ver na prática:

```html
<html>
    <head>
        <title>Documento vazio(Como a cabeça de quem admira o Bolsonaro)</title>
    </head>
    <body>
        <h1>Título do documento *vazio</h1>
        <p>*igual a cabeça de quem elogia o <i>trabalho</i> do Cunha.</p>
    </body>
</html>
```

Esse trecho seria representado na DOM como:

![DOM](http://i.imgur.com/OgfuQQY.png)

A imagem ilustra três tipos de nós, o **Document** que representa a página inteira, os **Element's** que representam os elementos HTML, e o **Text** que representam o... ah, você já entendeu o espírito da coisa.

Cada nó do documento é representado por um objeto da node, não confundam a API Node, com o NodeJs.

Todos esses objetos da árvore de documentos, formam a API node, já o NodeJs, é um interpretador JavaScript, baseado em C+ com vínculos para as APIs unix de baixo nível.
 
Voltando aqui, todos esses nós de documento formam um hierarquia de tipos, ilustrada na imagem a seguir.

![Node](http://i.imgur.com/G9aQYBD.png)

Perceberam que Document e HTMLDocument são coisas levemente distintas? igual Element e HTMLElement? A diferença entre elas é que tanto Document quanto Element, podem se referir a documentos HTML ou XML,
já HTMLDocument e HTMLElement, são específicos da HTML. Também temos muitos sub-tipos de HTMLElements, representando os elementos HTML, e ainda outros nós como comment, attr... que não são tão importantes nesse primeiro contato com a DOM.
   
Por hoje é só, no próximo post quero falar um pouco sobre como selecionar esses elementos, pelo meu pai, pela minha mãe, pela minha filha e pela filha dela, e pela democracia e por deus e pelo prefeito de Montes Claros.

<iframe width="560" height="315" src="https://www.youtube.com/embed/dPUJqieJIvU" frameborder="0" allowfullscreen></iframe>

