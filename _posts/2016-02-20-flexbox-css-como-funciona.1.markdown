---
layout: post
title:  "PostCSS - NPM scripts"
date:   2016-10-11 09:12:31 -0200
categories: Javascript
---

Recentemente tive algumas dores de cabeça, relacionado a taskrunners,
arquivos herdados, incompactibilidade de plugins e por ai vai.

Resolvi dar uma lida sobre npm scripts e tive uma ótima impressão,
vou mostrar um exemplo simples, automatizando algumas tasks de PostCSS.

[Aqui está o resultado](https://github.com/baltazarparra/npm-scripts)

Agora, mãos a obra

## Passo 1

* Primeiro vamos criar nosso package.json com **npm init**

## Passo 2

* Instalar algumas dependências com **npm install postcss precss cssnano --save-dev**
* E instalar globalmente o PostCSS no sistema com **npm install postcss-cli**

## Passo 3

* Agora vamos criar nosso arquivo css **touch style.css**

## Passo 4

* Vamos criar um postcss-options.json e dentro dele passar alguns parâmetros

```
{
"use": ["precss", "cssnano"],
"input": "style.css",
"output": "final.css",
"local-plugins": true
}
``` 

Agora vamos criar as tasks dentro do nosso package.json

```
"scripts": {
"start: "npm run css",
"css": "postcss -c postcss-options.json"
}

```

E pronto, é só rodar um **npm start** e a mágica vai acontecer,
qualquer dúvida deixa nos comentários.

##### Fortemente Inspirado no artigo [Handle PostCSS (with plugins) with NPM scripts](http://www.competa.com/blog/2016/06/handle-postcss-with-plugins-with-npm-scripts/).
