---
layout: post
title:  "JavaScript de Baunilha - Visão geral do DOM"
date:   2016-04-19 21:19:31 -0200
categories: js vanilla baunilha javascript baltazar parra
---

Apesar de não ser muito complicada, a Document Object Model (aka DOM)possui muitos detalhes de arquitetura.

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
