import React from 'react'
import styled, { keyframes } from 'styled-components'
import whatsapp from '../../images/whatsapp.svg'

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
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  opacity: 0;
  animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards;
  animation-delay: 1.8s;
  width: 100%;
  z-index: 9;
  margin-top: 4em;

  @media (min-width: 720px) {
    margin-top: 1em;
    flex-direction: row;
    align-items: flex-end;
    display: flex;
    padding: 1em;
    animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards;
    animation-delay: 1.8s;
  }

  span {
    font-size: 12px;
    margin: .8em .5em;
    text-align: left;
    display: block;
    color: #e2fff7;
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
  color: #e2fff7;
  border: solid 1px;
  border-radius: 4px;

  &:active, &:focus {
    background-color: green;
    border-color: transparent;
  }

  a {
    text-decoration: none;
    display: flex;
    padding: 0.2em;
  }

  img {
    width: 14px;
    margin-right: 0.2em;
  }
`

const Footer = () => {
  return (
    <Info>
      <span>
        <Button>
          <a href='https://wa.me/+5514998248021' rel='noreferrer' target='_blank'>
            <img src={whatsapp} alt='Whatsapp' rel='noopener noreferrer' target='_blank' />
            WhatsApp
          </a>
        </Button>
      </span>
      <span onClick={() => navigator.clipboard.writeText('baltazarparra@outlook.com')}>
        baltazarparra@outlook.com
        <Button>Copy email</Button>
      </span>
    </Info>
  )
}

export default Footer
