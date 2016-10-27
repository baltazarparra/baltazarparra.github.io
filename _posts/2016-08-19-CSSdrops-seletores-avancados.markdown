---
layout: post
title: CSSdrops - Seletores de Atributos
date: '2016-08-27 10:15:31 -0200'
categories: CSS
---

Vamos começar pelo básico:

```sass

input[type="text"]
```

Desta forma vamos selecionar todos nossos 'inputs' com o atributo 'type' e o valor 'text',

também podemos selecionar apenas os atributos independetemente do valor.

```sass

input[type]
```

Desta forma, estamos selecionando todos 'inputs' com o atributo 'type' independente do valor.

Começando a ser mais específico, e se quisermos selecionar todos nossos links que começam com 'http'?

```sass

a[href^="http"]
```

Podemos especificar muito nossos seletores usando os valores de atributos:

^ : captura o começo da string.

$ : captura o final da string

- : captura um trecho da string

```sass

a[href^="http"]
a[href$=".com"]
a[href*=".com"]
```

Lembrando que, esses seletores são Case Sensitive, se precisarmos selecionar ignorando o Case, vamos precisar usar a flag 'i':

```sass
a[href^="http" i]
```

Desta forma, vamos selecionar todos valores que começam com http, independente do Case.
