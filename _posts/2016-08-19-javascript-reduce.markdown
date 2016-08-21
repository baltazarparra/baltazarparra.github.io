---
layout: post
title: JavaScript Entendendo o Básico - reduce.
date: '2016-08-21 11:09:31 -0200'
categories: Javascript
---

Continuando a abordagem funcional, vamos conversar sobre o reduce.

Vamos usar ele quando for preciso encontrar um valor cumulativo ou concatenado com base em elementos de todo o array. Nosso callback vai passar por todos índices, ele aceita quatro argumentos:

- O valor inicial, que pode ser passado opcionalmente ao nosso método, ou será o valor retornado na última invocação do callback
- o valor atual, que será o valor que está sendo processado neste momento
- o índice, que é simplesmente o index do valor atual
- o próprio array.

```javascript
var sum = [1, 2, 3].reduce(function(total, num) {
    return total + num;
});
// total == 6
```

Como não passamos um valor inicial para nosso callback, neste momento ele é igual a '0', nosso método vai somar o 'total' com o 'num' que é o valor processado atualmente, nesse momento nosso 'num' é '1', então ('total' = 0 + 'num' = 1) = 1.

Como já foi invocado uma vez, nosso callback passa a ter o valor inicial igual seu o último retorno, então nosso 'total' agora é igual a '1', ai seguimos com o método, 'total' que agora vale '1' + 'num' que nesse momento é o segundo índice do array, então ('total' = 1 + 'num' = 2) = 3.

E finalizamos passando pelo último valor do array que é igual a '3', ou seja 'total' que agora vale 3 + 'num' que agora tem o valor '3', ('total' = 3 + 'num' = 3) = 6.

Se tivessemos passado um valor inicial para nosso método, o resultado seria diferente, vou dar um último exemplo:

```javascript
var sum = [1, 2, 3].reduce(function(total, num) {
    return total + num;
}, 1);
// total == 7
```

Nosso total final agora é igual a '7' por começamos nosso callback passando o valor inicial '1'.

Espero que tenha ficado claro, qualquer dúvida, deixa nos comentários.
