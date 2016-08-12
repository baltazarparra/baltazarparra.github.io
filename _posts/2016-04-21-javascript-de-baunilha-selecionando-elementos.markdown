---
layout: post
title:  "JavaScript de Baunilha - Selecionando elementos do documento."
date:   2016-04-21 09:44:31 -0200
categories: Javascript
---

Manipulação de DOM, talvez umas das skills mais importante para um desenvolvedor Js. Você precisa de alguma forma, selecionar os elementos que quer manipular.
Dominando isso, você vai passar a 'ter o DOM' de fato! =D

Infâmias a parte, podemos selecionar elementos de várias formas, as principais são: pela **Id**, pelo atributo '**name**', pela **tag** HTML, pela **classe** CSS  e pelo **seletor**.

### Selecionando elementos pela ID

Vale lembrar sempre que, o atributo **Id** deve ser único em todo documento, não podemos ter dois elementos com a mesma identificação em nossa página.
Para selecionar um elemento por esse atributo, fazemos assim:

~~~javascript

document.getElementById('pokebola');

// Melhor ainda, você pode jogar isso em uma variável.

var euEscolhoVoce = document.getElementById('mewtwo');

~~~

### Selecionando elementos pelo atributo Name

O atributo 'name', atribui um nome ao elemento HTML, diferente da ID, podemos ter mais de um elemento com o mesmo nome no nosso documento, isso é comum para botões e caixas de seleção.

~~~javascript

var meusBotoes = document.getElementsByName('botoes_envio');

~~~

### Selecionando elementos pela tag

Vamos deixa as coisas um pouco mais interessantes... E se você quiser pegar o terceiro elemento 'span' dentro do seu documento? Simples:

~~~javascript

var pegaSpan = document.getElementsByTagName('span')[2];

~~~

Yeah, isso mesmo, quando usamos o 'getElementByTagName' ele nos retorna um objeto parecido com um array, mas só para leitura.
Dentro desse objeto vão vir todos elementos com a tag que você pediu.
Isso nos dá muito poder, por exemplo, e se você quiser encontrar o primeiro o 'h1' da primeira 'section' do seu documento? podemos fazer isso desta forma:

~~~javascript

var primeiraSessao = document.getElementsByTagName('section')[0];
var primeiroTitulo = primeiraSessao.getElementsByTagName('h1');

~~~

Legal né?

Outra forma de selecionar elementos, é direto pela classe CSS:

~~~javascript

document.getElementsByClassName('minhaClasse');

~~~

Podemos usar isso de muitas formas, um interessante para o 'getElementByClassName':

~~~javascript

var aviso = document.getElementById('aviso');
var erro = aviso.getElementsByClassName('erro');

~~~

Isso vai selecionar a classe CSS '.erro' do elemento HTML com a ID '#aviso'.

Podemos ir além, selecionando não só a classe, mas o seletor inteiro quando necessário, com a bela, recatada e do lar **querySelectorAll**:

~~~javascript

var pegaId = document.querySelectorAll('#meuId');
var pegaAtt = document.querySelectorAll('*[name="meuAtt"]');
var minhaClass = document.querySelectorAll('.class');
var meuSeletor = document.querySelectorAll('h1.titulo');

~~~

Com essa belezinha, podemos selecionar elementos usando todas outras formas que vimos até aqui.
Inclusive, para os jQueryDevelopers de plantão (nada contra o jQuery, mas falando assim, dá impressão que eu sei mais de Js do que eu realmente sei), sabe oque roda por tras do maravilhoso **$()**?
EXATAMENTE! **querySelectorAll();**

Próximo post, vou resenhar um pouco sobre 'Estrutura de documentos' e como percorrê-las. Até lá!
