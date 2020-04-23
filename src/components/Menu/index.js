import React from "react"
import styled from 'styled-components'

const List = styled.ul`
  display: flex;
  position: fixed;
  top: 10px;
  right: 10px;

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
    color: #7AA7AC;
    cursor: pointer;
    transform: translateY(0px);
    transition: .3s;
    will-change: transform;
  }

  a:hover {
    transform: translateY(-2px);
  }
`

const Menu = () => {
  return (
    <List>
      <li>
        <a>
          Github
        </a>
      </li>
      <li>
        <a>
          Codepen
        </a>
      </li>
      <li>
        <a>
          LinkedIn
        </a>
      </li>
      <li>
        <a>
          CV
        </a>
      </li>
    </List>
  )
}

export default Menu
