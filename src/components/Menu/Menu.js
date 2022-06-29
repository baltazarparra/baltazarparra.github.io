import React from 'react'
import PropTypes from 'prop-types'
import styled, { keyframes } from 'styled-components'
import AniLink from 'gatsby-plugin-transition-link/AniLink'
import github from '../../images/github.svg'
import codepen from '../../images/codepen.svg'
import linkedin from '../../images/linkedin.svg'
import home from '../../images/home.svg'

const slide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(200px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`

const List = styled.ul`
  display: flex;
  padding: 1em;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 36px;
  z-index: 11;

  li:first-child {
    opacity: 0;
    position: relative;
    animation: ${slide} 1.8s cubic-bezier(.12,.58,0,1.61) forwards;
  }

  li:nth-child(2) {
    opacity: 0;
    animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards;
    animation-delay: 1;
  }

  li:nth-child(3) {
    opacity: 0;
    animation: ${slide} .6s cubic-bezier(.12,.58,0,1.61) forwards;
    animation-delay: 2;
  }

  @media (min-width: 360px) {
    li:first-child:before {
      content: '';
      position: absolute;
      top:12px;
      left: -60px;
      height: 1px;
      width: 30px;
      background-color: #7AA7AC;
    }
  }
`

const Item = styled.li`
  margin-right: 1.4rem;

  &:last-child {
    position: absolute;
    top: 10px;
    left: 10px;
    img {
      width: 24px;
    }
  }
`

const Link = styled.a`
  display: flex;
  cursor: pointer;
  transform: translateY(0px);
  transition: .3s;
  will-change: transform;
  color: #7AA7AC;
  text-decoration: none;
  font-size: 0.8em;

  @media (min-width: 720px) {
    font-size: 1em;
  }

  :hover {
    transform: translateY(2px);
  }

  :visited {
    color: #7AA7AC;
  }

  img {
    margin-right: 0.2em;
    height: 14px;
    width: 14px;

    @media (min-width: 720px) {
      margin-right: 0.2em;
      height: 20px;
      width: 20px;
    }
  }
`

const Menu = ({ postPage }) => {
  return (
    <List>
      <Item>
        <Link href='https://github.com/baltazarparra' rel='noopener noreferrer' target='_blank'>
          <img src={github} alt='Github Logo' /> Github
        </Link>
      </Item>
      <Item>
        <Link href='https://codepen.io/baltazarparra' rel='noopener noreferrer' target='_blank'>
          <img src={codepen} alt='Codepen Logo' /> Codepen
        </Link>
      </Item>
      <Item>
        <Link href='https://www.linkedin.com/in/baltazarparra/' rel='noopener noreferrer' target='_blank'>
          <img src={linkedin} alt='Linkedin Logo' /> LinkedIn
        </Link>
      </Item>
      <Item>
        {postPage &&
          <AniLink paintDrip to='/' duration={1} hex='#0D2834'>
            <img src={home} alt='Home Logo' />
          </AniLink>}
      </Item>
    </List>
  )
}

Menu.propTypes = {
  postPage: PropTypes.bool
}

export default Menu
