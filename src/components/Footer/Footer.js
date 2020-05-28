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

const bg = keyframes`
  50% {
    background-color: transparent;
  }
  100% {
    background-color: rgba(0,0,0,0.7);
  }
`

const Info = styled.div`
  display: flex;
  justify-content: flex-end;
  opacity: 0;
  animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards,
  ${bg} 3s cubic-bezier(.12,.58,0,1.61) forwards;
  animation-delay: 1.8s, 1.8s;
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
  }

  a {
    color: #7AA7AC;
  }
`

const Footer = () => {
  return (
    <Info>
      <span>
        <a href='mailto:baltazarparra@outlook.com' rel='noopener noreferrer' target='_blank'>
          baltazarparra@outlook.com
        </a>
      </span>
    </Info>
  )
}

export default Footer
