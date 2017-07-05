---
layout: post
title: Entendendo Slice e Splice
date: 2017-07-04 21:46:31 -0200
categories: Javascript
---

**Slice**, metódo não destrutivo, não modifica o array principal e nos retorna um novo array.
Você pode usar ele de boas, que não vai estragar nada,
já que ele não vai modificar nosso array original.

Seu 1º parâmetro deve ser o 1º índice que você quer no corte do array,
se queremos cortar a partir do 3º índice, o valor a ser passado será o 2,
já que array's tem base zero (0, 1, 2),
eu sei, dá um nó na cabeça, então respira e lê mais uma vez com calma.

Se passarmos apenas um parâmetro,
ele vai nos retornar todos índices do 1º argumento até o final do array.

~~~javascript
let array = [1,2,3,4,5,6]
let newArray = array.slice(2)
newArr [3,4,5,6]
~~~

O último parâmetro deve ser um índice após o último índice que queremos,
se vamos cortar até o 14º índice, o valor a ser passado será 15,
pois o slice vai cortar antes do valor do último argumento (... 12, 13, 14, "corte" 15),
respira de novo, e leia com calma.

Então, se queremos um corte do 3 ao 14:

~~~javascript
let array = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
let newArray = array.slice(2,15)
newArr [3,4,5,6,7,8,9,10,11,12,13,14]
~~~

**Splice**, método destrutivo, modifica o array principal.
Entendeu? Destrutivo, então cuidado com essa porra,
você pode zua o array original, ai vai dá merda.

Seu 1º argumento é o índice onde quer começar a dividir o array.

~~~javascript
let array = [1,2,3,4,5]
let newArray = array.splice(3)
newArray[4,5]
array[1,2,3]
~~~

Como citei ali em cima, ele é um método destrutivo,
portanto ele modifica o array original.

O splice também pode receber um 2º parâmetro,
o 2º parâmetro do método splice deve ser a quantidade de índices que queremos remover do array.

~~~javascript
let array = [1,2,3,4,5,6,7]
let newArray = array.splice(1,3)
newArray[2,3,4]
array[1,5,6,7]
~~~

Diferente do método slice, o splice ainda pode receber mais parâmetros,
podemos colocar um ou mais valores,
e eles serão inseridos após o índice que passarmos como 1º argumento.

~~~javascript
let array = [1,2,3,4,5,6,7]
array.splice(1,0,'a')
array[1,'a',2,3,4,5,6,7]
~~~

Como nosso segundo parâmetro é zero, não houve corte,
e nosso último parâmetro 'a', foi inserido no índice do 1º parâmetro.
Lembrando que, ele pode receber um ou mais valores.

~~~javascript
let array = [1,2,3,4,5,6,7]
array.splice(1,0,'a','b','c','d')
array[1,'a','b','c','d',2,3,4,5,6,7]
~~~

Um bom uso para essa funcionalidade, seria trocar valores dentro de um array.

~~~javascript
let array = [1,'a','b','c','d',5,6,7]
array.splice(1,4,2,3,4)
array[1,2,3,4,5,6,7]
~~~

O 1º parâmetro declara onde vamos começar a dividir o array,
no 2º passamos a quantidade de itens que vamos remover,
e nos demais, os itens que vamos inserir após o índice declarado no 1º parâmetro.

Apesar de fazer parte da base da linguagem,
o método splice é bem complicado no começo,
mas com certeza, após dominar ele, será uma ótima ferramenta na sua caixa de desenvolvimento.
