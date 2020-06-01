---
title: Deno substitui o Node?
tags: dark
resume: O novo runtime idealizado por Ryan Dahl também foi feito em cima da engine V8, prometendo foco total em segurança
date: 07 de Julho de 2020
---

<a href='https://en.wikipedia.org/wiki/Ryan_Dahl'>Ryan Dahl</a> anunciou em 2012 que se afastaria do projeto Node, que vinha trabalhando desde 2009,
reaparecendo em 2018 com o anuncio do <a href='https://deno.land/' target='_blank'>Deno</a>,
seu novo runtime para JavaScript e TypeScript.
<br><br>
Focado em __segurança__, Ryan escolheu Rust para escrever todo o core da nova ferramenta. Dia 13 de Maio rolou o <a href='https://deno.land/v1' target='_blank'>anuncio</a> da sua versão __1.0__.
<br><br>
Ryan promete suportar por padrão, todas API's do navegador que façam sentido no backend, seguindo a especificação da W3C, como o __fetch__ por exemplo.
<br><br>
O Deno também conta com suporte nativo a TypeScript, dispensando o uso de Babel ou qualquer outro parser de Typescript.
<br><br>
O controle de dependências do Deno também se mostra mais maduro, ao inves de termos uma "node modules" por projeto, teremos uma espécie de "node modules" global na nossa máquina de onde todos projetos poderão consumir as dependências.
<br><br>
O fato é, Node já é um padrão sólido de mercado e isso não vai mudar da noite pro dia, mas o Deno promete ser uma alternativa bastante interessante a longo prazo.
