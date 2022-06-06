import React from 'react'
import PropTypes from 'prop-types'
import img from '../../images/bg.png'

import styled, { keyframes } from 'styled-components'

const comeUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(50px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
`

const side = keyframes`
  from { background-position: 0px 0; }
  to { background-position: 1077px 0; }
`

const Container = styled.section`
  z-index: 9;

  @media (min-width: 720px) {
    margin: 280px 0 0 -60px;
  }
`

const Title = styled.h1`
  font-family: 'Sedgwick Ave Display';
  color: #E2FFF7;
  font-weight: normal;
  font-size: 3.8em;
  line-height: 1;
  margin-left: -60px;
  margin-top: 180px;
  opacity: 0;
  animation: ${comeUp} .8s ease forwards;
  animation-delay: .4s;

  span {
    display: block;
  }

  @media (min-width: 720px) {
    line-height: 1;
    font-size: 6rem;
    margin-bottom: 30px;
    margin-left: 0;
    margin-top: 0;
  }
`

const Subtitle = styled.h2`
  font-family: 'Sedgwick Ave Display';
  font-weight: normal;
  color: #7AA7AC;
  font-size: 3.4em;
  text-align: right;
  margin-left: -120px;
  margin-top: 20px;
  opacity: 0;
  animation: ${comeUp} .4s ease forwards;
  animation-delay: .4s;

  span {
    display: none;
  }

  @media (min-width: 720px) {
    font-size: 4rem;
    line-height: 1;
    margin-left: -40px;
    span {
      display: block;
    }

  }
`

const Background = styled.div`
  background-image: url(${img});
  background-repeat-y: no-repeat;
  position: absolute;
  width: 100%;
  height: 50px;
  top: 70px;
  left: 0;
  background-size: auto 26px;
  animation: ${side} 60s linear infinite;
  
  &:after {
    content: 'Worked with:';
    position: absolute;
    font-size: 10px;
    top: -18px;
    left: 6px;
  }

  @media (min-width: 720px) {
    background-image: url(${img});
    background-repeat-y: no-repeat;
    position: fixed;
    width: 100%;
    height: 50px;
    top: -50px;
    left: 0;
    animation: ${side} 60s linear infinite;
    transform: rotate(90deg);
    transform-origin: left bottom;
    background-size: auto 48px;

    &:after {
      content: 'Worked with:';
      position: absolute;
      top: -30px;
      left: 20px;
      font-size: 16px;
    }
  }
`

const Hero = ({ style }) => (
  <>
    <Container>
      <div
        style={{
          transform: style?.transform
        }}
      >
        <Title>
          Creative
          <span>developer</span>
        </Title>
        <Subtitle>
          i'm Baltz, Hi!
        </Subtitle>
      </div>
      <Background />
    </Container>
  </>
)

Hero.propTypes = {
  style: PropTypes.object
}

export default Hero
