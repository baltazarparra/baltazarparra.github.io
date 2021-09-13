---
title: Tipos de aplicações web
tags: Galaxy
resume: Static Site, Single Page Application, Server Side Rendering... Quando usar cada um e suas vantagens e desvantagens
date: 19 de Setembro de 2021
---

<h2>Static Site Generator - SSG</h2><br><br>

O Servidor fica responsável somente por fazer o primeiro render e jogar para uma CDN,
depois disso, o cliente passa a consumir a aplicação direto da CDN.<br><br>

Vantagens: Quase não usa server, Melhor cachê com CDN, Performance<br><br>
Desvantagens: Build longo, baixa escalabilidade, sites pouco dinâmico<br><br>
Uso: Site simples pouco dinâmico<br><br>

<h2>Single Page Application - SPA</h2><br><br>

O client pede os arquivos inicias para o servidor, depois bate na API para trazer os dados e então renderiza a aplicação no client.<br><br>

Vantagens: Mais interações sem necessidade de Refresh, Depois do primeiro render fica bem performático.<br><br>
Desvantagens: Primeiro render mais lento, SEO pobre<br><br>
Uso: Aplicações que não dependem de SEO, Aplicações com muitas iterações (Spotify, Twitter)<br><br>

<h2>Server Side Rendering - SSR</h2><br><br>

O servidor fica responsável por pegar os dados da API e montar a página, deixando para o client fazer apenas o render.<br><br>

Vantagens: SEO rico, Melhor performance para o usuário, Integração direta com backend(node), Client menos carregado<br><br>
Uso: Aplicações com muitas interações e que pedem além de uma boa performance, um SEO mais rico
