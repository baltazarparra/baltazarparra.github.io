---
layout: post
title:  "JavaScript de Baunilha - Criando, Inserindo e Excluindo Nós."
date:   2016-05-19 06:03:31 -0200
categories: Javascript, VanillaJs
---

## criandoInserindoExcluindoNos

Você sabe criar e inserir nós em seus documentos?

Não? Então se liga:

```javascript

var box = document.getElementsByTagName('section')[0];
// Selecionei o primeiro elemento Section do meu documentos
var dinamic = document.createTextNode('texto dinamico');
// Criei um nó de texto
box.appendChild(dinamic);
// Inseri o nó de texto criado, logo abaixo da section que selecionamos

```

Selecionei o primeiro elemento com a tag *Section* dentro do meu documento para poder referenciar ele,
na hora de inserir meu conteúdo, depois criei um nó de texto e logo abaixo, inseri nosso novo nó,
dentro da section que selecionamos lá no começo.

Vou explicar um pouco de cada parte separado agora.

## criandoNós

Para criar novos nós Element, usamos o método createElement, passando o elemento como argumento, exemplo:

```javascript
var novoTexto = document.createTextNode('Conteúdo do nó de texto');
var novoP = document.createElement('p');
```

Além de criar nós, podemos também clonar os existentes com o método *cloneNode*, e digo mais, além de clonar o nó, você pode passar o argumento booleano *true* para copiar todos descendentes recursivamente, ou *false* para copiar apenas o nó.

```html
<div>
  <p>
    Texto a ser copiado
  </p>
    <p>
    Texto
  </p>
</div>
```

```javascript

var div = document.getElementsByTagName('div')[0];
// Selecionamos a primeira div do documento
var p = document.getElementsByTagName('p')[0];
// Selecionamos o nó que queremos clonar
var dup = p.cloneNode(true);
// Clonamos o nó e seu conteúdo recursivamente
div.appendChild(dup);
// inseriomos o nó clonado, na div que selecionamos

```

```html
<div>
  <p>
    Texto a ser copiado
  </p>
    <p>
    Texto
  </p>
  <p>
    Texto a ser copiado
  </p>
</div>
```

## inserindoNos

Temos dois métodos para inserir nós dentro do documento, *appendChild()* e *insertBefore()*.

- *appendChild* é chamado no elemento, e o nó criado se torna o *lastChild* desse dele.

```javascript
// Cria um novo elemento de parágrafo e adiciona-o ao final do documento
var p = document.createElement("p");
document.body.appendChild(p);
```


- *insertBefore* é parecido com o *appendChild* mas ele recebe dois argumentos, o primeiro é o nó onde você quer inserir,
o segundo é o nó antes do qual o nó vai ser inserido, ou seja, esse método deve ser chamado no nó pai com o segundo argumento sendo o filho desse nó pai.

```html
<section>
  <div>
    <p>
      Texto a ser copiado
    </p>
      <p>
      Texto
    </p>
  </div>
</section>
```

```javascript
var div = document.getElementsByTagName('div')[0];
// Selecionamos nossa... ah, você já cansou dessa parte né
var sec = document.getElementsByTagName('section')[0];
// mimimi
var p = document.createTextNode('Novo nó de texto');
// blablabla
sec.insertBefore(p, div);
// aqui o bang fica interessante e complicado,
// primeiro eu falo quem é o pai da criança
// no nosso caso *sec*, depois passo os parametro,
// o primeiro parametro é o elemento que eu quero inserir
// ele precisa ser filho do pai selecionado
// depois disso, eu passo o segundo parametro, que é
// antes de qual nó que eu vou inserir nosso novo nó
```

```html
<section>
  <div>
    <p>
      Novo nó de texto
    </p>
    <p>
      Texto a ser copiado
    </p>
      <p>
      Texto
    </p>
  </div>
</section>
```

## removendoNos

Para remover nós, usamos o método *removeChild()*, mas preste atenção, esse método não deve ser chamado no nó que vai ser removido, como seu nome implica, ele deve ser chamado no nó pai do nó que você deseja remover.
Exemplo:

```html
<section>
  <div>
    <p>
      Nó de texto
    </p>
    <p>
      Texto
    </p>
  </div>
</section>
```

```javascript
var div = document.getElementsByTagName('div')[0];

var sec = document.getElementsByTagName('section')[0];

var p = document.getElementsByTagName('p')[0];

div.removeChild(p);
```

```html
<section>
  <div>
    <p>
      Texto
    </p>
  </div>
</section>
```

Podemos também substituir nós com o método *replaceChild()*, seu funcionamento é parecido com o *removeChild()* e é bem intuitivo.
Exemplo:

```html
<section>
  <div>
    <p>
      Nó de texto
    </p>
  </div>
</section>
```

```javascript
var div = document.getElementsByTagName('div')[0];

var sec = document.getElementsByTagName('section')[0];

var p = document.getElementsByTagName('p')[0];

var rep = document.createTextNode("Novo nó substituido");

div.replaceChild(rep, p);
```

```html
<section>
  <div>
    <p>
      Novo nó substituido
    </p>
  </div>
</section>
```
