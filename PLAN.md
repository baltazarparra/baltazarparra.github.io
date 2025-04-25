# Plano de Reformulação: Portfolio Baltazar Parra

## Visão Geral
Este documento apresenta um plano detalhado para a reformulação do site pessoal/portfolio de Baltazar Parra. O objetivo é criar uma plataforma mais moderna, performática e acessível, mantendo os elementos visuais distintivos e aprimorando a experiência do usuário.

## Objetivos
- Melhorar a performance geral do site
- Aprimorar a acessibilidade
- Modernizar o design mantendo a identidade visual
- Otimizar a experiência 3D
- Tornar o código mais modular e de fácil manutenção
- Implementar SEO mais eficiente

## Tecnologias
- **React 18** (mantido)
- **Vite** (mantido, atualizado para última versão)
- **pnpm** (mantido, atualizado para última versão)
- **Three.js** (mantido, otimizado)
- **React Three Fiber** (mantido, otimizado)
- **Typescript** (novo, para melhor tipagem e manutenção)
- **CSS Modules** ou **Styled Components** (novo, para melhor organização dos estilos)
- **Framer Motion** (novo, para animações mais fluidas)
- **Suspense e Lazy Loading** (implementação aprimorada)

## Arquitetura do Projeto

### Estrutura de Pastas
```
/
├── public/           # Arquivos estáticos
├── src/
│   ├── assets/       # Imagens, fontes, modelos 3D
│   ├── components/   # Componentes reutilizáveis
│   │   ├── common/   # Botões, cards, etc
│   │   ├── layout/   # Header, Footer, etc
│   │   └── 3d/       # Componentes Three.js
│   ├── hooks/        # React hooks personalizados
│   ├── contexts/     # Contextos React (tema, idioma, etc)
│   ├── utils/        # Funções utilitárias
│   ├── types/        # Definições de tipos TypeScript
│   ├── pages/        # Componentes de página
│   ├── styles/       # Estilos globais
│   ├── App.tsx       # Componente App principal
│   └── main.tsx      # Entrada da aplicação
└── tests/            # Testes
```
