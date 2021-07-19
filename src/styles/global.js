import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  pre {
    font-size: 14px !important;
    line-height: 1.6 !important;
    position: relative !important;
    padding-top: 50px !important;
    border-radius: 10px !important;
    box-shadow: 0 3px 6px rgba(0,0,0,0.06), 0 3px 6px rgba(0,0,0,0.10) !important;
    background-color: #151718 !important;
    text-shadow: none !important;
  }
  @media (min-width: 720px) {
    pre {
      font-size: 16px !important;
      line-height: 1.4 !important;
    }
  }

  pre:before {
    content: '';
    position: absolute;
    top: 18px;
    left: 13px;
    width: 12px;
    height: 12px;
    background-color: #e85c53;
    display: block;
    border-radius: 100%;
  }

  code:before {
    content: '';
    position: absolute;
    top: 18px;
    left: 53px;
    width: 12px;
    height: 12px;
    background-color: #61ca41;
    display: block;
    border-radius: 100%;
  }

  pre:after {
    content: '';
    position: absolute;
    top: 18px;
    left: 33px;
    width: 12px;
    height: 12px;
    background-color: #f2bc2a;
    display: block;
    border-radius: 100%;
  }

  /* Box sizing rules */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body::-webkit-scrollbar {
    width: .5em;
  }

  body::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  body::-webkit-scrollbar-thumb {
    background-color: #7AA7AC;
    outline: 1px solid #0D2834;
  }

  a {
    cursor: none !important;
  }

  /* Remove default padding */
  ul[class],
  ol[class] {
    padding: 0;
  }

  /* Remove default margin */
  body,
  h1,
  h2,
  h3,
  h4,
  p,
  ul[class],
  ol[class],
  li,
  figure,
  figcaption,
  blockquote,
  dl,
  dd {
    margin: 0;
  }

  /* Set core body defaults */
  body {
    min-height: 100vh;
    scroll-behavior: smooth;
    text-rendering: optimizeSpeed;
    line-height: 1.5;
    font-family: 'Open Sans';
    background-color: #0D2834;
    color: #E2FFF7;
  }

  /* Remove list styles on ul, ol elements with a class attribute */
  ul[class],
  ol[class] {
    list-style: none;
  }

  /* A elements that don't have a class get default styles */
  a:not([class]) {
    text-decoration-skip-ink: auto;
  }

  /* Make images easier to work with */
  img {
    max-width: 100%;
    display: block;
  }

  /* Natural flow and rhythm in articles by default */
  article > * + * {
    margin-top: 1em;
  }

  /* Inherit fonts for inputs and buttons */
  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  a,
  a:visited {
    color: #eee;
  }

  li {
    list-style: none;
  }

  .twitter-tweet {
    display: initial !important;
  }

  video {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }

  /* Remove all animations and transitions for people that prefer not to see them */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`

export default GlobalStyles
