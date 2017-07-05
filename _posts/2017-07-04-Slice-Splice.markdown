---
layout: post
title: Slice e Splite
date: '2017-07-04 21:46:31 -0200'
categories: Javascript
---

Slice - É um metódo não destrutivo, ele não modifica o array principal e nos retorna um novo array.

Seu primeiro parâmetro deve ser o primeiro índice que você quer no corte,
se queremos cortar a partir do 3º índice, o valor a ser passado será o 2,
já que array's tem base zero. (0, 1, 2)

Se passarmos apenas um parametro,
ele vai nos retornar todos índices do primeiro argumento até o final do array.

~~~javascript
let array = [1,2,3,4,5,6]
let newArray = array.slice(2)

newArr [3,4,5,6]
~~~

O último parâmetro deve ser um índice após o último índice que queremos,
se vamos cortar até o índice 14, o valor a ser passado é o 15,
pois o slice vai cortar antes do valor do argumento. (... 12, 13, 14, "slice" 15)

Então, se queremos um corte do 3º índice até o 14º índice:
array.slice(2,15)

Splice - É um método destrutivo, ele modifica o array principal,
então muito cuidado quando for usar este método.

Seu primeiro argumento é o índice onde quer começar a dividir o array.

~~~javascript
let array = [1,2,3,4,5]
let newArray = array.splice(3)
newArray[4,5]
array[1,2,3]
~~~

Como citei ali em cima, ele é um metodo destrutivo,
portanto ele modifica o array original.

O splice também pode receber um segundo parametro,
o segundo parametro do método splice deve ser a quantidade de índices que queremos remover do array.

~~~javascript
let array = [1,2,3,4,5,6,7]
let newArray = array.splice(1,3)
newArray[2,3,4]
array[1,5,6,7]
~~~

E diferente do método slice, o splite ainda pode receber mais parametros,
depois do segundo parametro, voce pode colocar um ou mais valores que deseja adicionar ao array original.
