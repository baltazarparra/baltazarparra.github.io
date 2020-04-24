import React from "react"
import styled from 'styled-components'

const Container = styled.section`
  margin: 280px 0 0 -60px;
  z-index: 9;
`

const Title = styled.h1`
  font-family: 'Sedgwick Ave Display';
  font-size: 6rem;
  font-weight: normal;
  line-height: 1;
  color: #E2FFF7;
  margin-bottom: 30px;

  span {
    display: block;
  }
`

const Subtitle = styled.h2`
  font-family: 'Sedgwick Ave Display';
  font-size: 4rem;
  font-weight: normal;
  line-height: 1;
  color: #7AA7AC;
  margin-left: -40px;
  text-align: right;

  span {
    display: block;
  }
`
const Hero = () => {
  return (
    <Container>
      <Title>
        Creative
        <span>developer</span>
      </Title>
      <Subtitle>
        Hi, im Baltz.
        <span>...just dive right in</span>
      </Subtitle>
    </Container>
  )
}

export default Hero
