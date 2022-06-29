import React from 'react'
import PropTypes from 'prop-types'

import styled, { keyframes } from 'styled-components'

const comeUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(250px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
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
  animation-delay: 1.4s;

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
  animation: ${comeUp} 1.4s ease forwards;
  animation-delay: 2.4s;

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
    </Container>
  </>
)

Hero.propTypes = {
  style: PropTypes.object
}

export default Hero
