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

const Button = styled.button`
  margin-left: 1em;
  border: 0;
  position: relative;
  background-color: transparent;
  transition: all .2s ease-in-out;
  color: white;
  border: solid 1px;
  border-radius: 4px;

  &:active, &:focus {
    background-color: green;
    border-color: transparent;
    &:after {
      content: '✓';
      position: absolute;
      bottom: -5px;
      right: -20px;
      font-size: 1.6em;
      color: white;
    }
  }
`

const Footer = () => {
  return (
    <Info>
      <span onClick={() => navigator.clipboard.writeText('baltazarparra@outlook.com')}>
        baltazarparra@outlook.com
        <Button>Copy email</Button>
      </span>
    </Info>
  )
}

export default Footer
