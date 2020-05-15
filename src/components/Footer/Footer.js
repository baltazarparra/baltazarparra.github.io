import React from 'react'
import styled, { keyframes } from 'styled-components'

const slide = keyframes`
  0% {
    opacity: 0;
    transform: translateX(-100%);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  position: fixed;
  bottom: 1em;
  right: 1em;
  opacity: 0;
  animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards;
  animation-delay: 1.8s;

  span {
    font-size: 12px;
    margin: .5em 1em 0 0;
  }
`

const Footer = () => {
  return (
    <Info>
      <span>
        <a href='https://wa.me/5514998248021' rel='noopener noreferrer' target='_blank'>
          +55 14 99824 8021
        </a>
      </span>
      <span>
        <a href='mailto:baltazarparra@outlook.com' rel='noopener noreferrer' target='_blank'>
          baltazarparra@outlook.com
        </a>
      </span>
    </Info>
  )
}

export default Footer
