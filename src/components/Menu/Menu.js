import React from 'react'
import styled, { keyframes } from 'styled-components'

const slide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`

const List = styled.ul`
  display: flex;
  opacity: 0;
  padding: 1em;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 36px;
  animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards;
  animation-delay: 1.4s;
  z-index: 11;

  @media (min-width: 720px) {
    animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards;
    animation-delay: 1.4s;
  }

  :before {
    content: '';
    position: absolute;
    top: 18px;
    right: 280px;
    height: 1px;
    width: 30px;
    background-color: #7AA7AC;
  }

  li {
    margin-right: 1rem;
  }

  a {
    display: block;
    cursor: pointer;
    transform: translateY(0px);
    transition: .3s;
    will-change: transform;
    color: #7AA7AC;
  }

  a:hover {
    transform: translateY(-2px);
  }

  a:visited {
    color: #7AA7AC;
  }
`

const Menu = () => {
  return (
    <List>
      <li>
        <a href='https://github.com/baltazarparra' rel='noopener noreferrer' target='_blank'>
          Github
        </a>
      </li>
      <li>
        <a href='https://codepen.io/baltazarparra' rel='noopener noreferrer' target='_blank'>
          Codepen
        </a>
      </li>
      <li>
        <a href='https://www.linkedin.com/in/baltazarparra/' rel='noopener noreferrer' target='_blank'>
          LinkedIn
        </a>
      </li>
    </List>
  )
}

export default Menu
