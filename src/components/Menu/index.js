import React from "react"
import styled from 'styled-components'
import { Link } from 'gatsby'

const List = styled.ul`
  display: flex;
  position: fixed;
  top: 10px;
  right: 10px;

  :before {
    content: '';
    position: absolute;
    top: 10px;
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
    text-decoration: none;
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
        <a href='https://github.com/baltazarparra' target="_blank">
          Github
        </a>
      </li>
      <li>
      <a href='https://codepen.io/baltazarparra' target="_blank">
          Codepen
        </a>
      </li>
      <li>
        <a href='https://www.linkedin.com/in/baltazarparra/' target="_blank">
          LinkedIn
        </a>
      </li>
    </List>
  )
}

export default Menu
