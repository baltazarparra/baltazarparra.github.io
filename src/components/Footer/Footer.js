import React from 'react'
import styled, { keyframes } from 'styled-components'

const slide = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const Info = styled.div`
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards;
  animation-delay: 1.8s;
  width: 100%;
  z-index: 9;

  @media (min-width: 720px) {
    align-items: flex-end;
    display: flex;
    flex-direction: column;
    padding: 1em;
    animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards;
    animation-delay: 1.8s;
  }

  span {
    font-size: 12px;
    margin: .8em .5em;
    text-align: left;
    display: block;
    width: 100%;
  }

  a {
    display: block;
    line-height: 4;
    color: #E2FFF7;
  }

  small {
    color: #7AA7AC;
    position: relative;
    display: flex;

    em {
      display: block;
      transform: rotate(135deg);
      transform-origin: center;
      margin: 0 .6em 0 .8em;
    }
  }
`

const Footer = () => {
  return (
    <Info>
      <span>
        <a href='mailto:baltazarparra@outlook.com' rel='noopener noreferrer' target='_blank'>
          baltazarparra@outlook.com
        </a>
        <small>de periferia <em>⇶</em></small>
      </span>
    </Info>
  )
}

export default Footer
