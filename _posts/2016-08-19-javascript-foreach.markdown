---
layout: post
title: JavaScript Entendendo o Básico - forEach.
date: '2016-08-19 05:53:31 -0200'
categories: Javascript
---

Vamos passar uma pequena revisão pelo forEach.

# forEach

```javascript
var meuArray = [1, 2, 3];

meuArray.forEach(meuCallback(valorAtual, indice, array){
    console.log(valorAtual, indice, array);
}, argumentoThis);

//log

// 1 Valor Atual | 0 Indice do Array | [1, 2, 3] Array
// 2 Valor Atual | 2 Indice do Array | [1, 2, 3] Array
// 3 Valor Atual | 2 Indice do Array | [1, 2, 3] Array
```

Usamos o forEach para fazer iterações ou loops em nossos arrays de forma funcional, passamos uma função de callback dentro do loop, e ela passará por todos itens do nosso array.

Nosso callback aceita três parametros, o valor do elemento, o índice do elemento, e o array que está sendo percorrido.

Também podemos passar um argumento após o loop que será passado para nosso callback quando invocado, como o valor this, se não for passado nenhum argumento ele ficará como undefined.

Um exemplo de uso chamando o último argumento de forma funcional.

```javascript

let jedi = {
  name: 'yoda',
  height: '66cms',
  mass: '17 kgs'
};

Object.keys( jedi ).forEach(function( key ) {

  // O this agora faz referência ao 'jedi'

  console.log( this[ key ] );

}, jedi ); // Nosso último argumento referenciado nosso this
```

Simples né? Vou passar a postar esses artigos curtos, revisando aspectos mais básicos da linguagem, qualquer dúvida, deixe um comentário abaixo.
