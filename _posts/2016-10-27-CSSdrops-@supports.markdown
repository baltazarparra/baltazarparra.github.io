---
layout: post
title:  CSSdrops - @supports
date:   2016-10-27 09:56:31 -0200
categories: CSS
---

Para validar propriedades hoje, usamos os prefixos,
repetindo a mesma propriedade várias vezes, mas isso está prestes a mudar,
recentemente os 3 principais navegadores (Firefox, Chrome e Opera) adicionaram suporte para a diretiva **@supports**

A sintaxe é a mesma que já usamos na diretiva @midia

```css
@supports ( propriedade : valor ) {
    /* estilos */
}
```

Um dos usos mais interessante a nova diretiva seria combinando ela com a keyword **not** como uma espécie de callback.

```css
@supports not (display: flex) {
	div { float: left; } /* callback */
}
```
Ela também pode ser usada em código herdado, para trazer novas funcionalidades sem quebrar oque já está em produção.
```css
section {
	float: left;
}

@supports (display: -webkit-flex) or
          (display: -moz-flex) or
          (display: flex) {

    section {
      display: -webkit-flex;
      display: -moz-flex;
    	display: flex;
    	float: none;
    }
}
```

Você já pode testar essa nova diretiva se tiver instalado o Canary, Firefox Nightly ou Opera Next.

##### Fortemente Inspirado no artigo [@supports CSS](https://davidwalsh.name/css-supports).
