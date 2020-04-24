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
  position: fixed;
  top: 10px;
  right: 10px;
  opacity: 0;
  animation: ${slide} .8s cubic-bezier(.22,.68,0,1.71) forwards;
  animation-delay: 1.4s;

  :before {
    content: '';
    position: absolute;
    top: 12px;
    left: -50px;
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
