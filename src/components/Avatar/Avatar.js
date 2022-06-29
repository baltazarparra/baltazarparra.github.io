import React from 'react'
import PropTypes from 'prop-types'

import ShadertoyReact from 'shadertoy-react'
import styled, { keyframes } from 'styled-components'
import Tilt from 'react-tilt'

import img from '../../images/avatar-min.jpg'
import NoiseImg from '../../images/noise.jpg'

const fragmentShader = `
void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float noise = texture(iChannel0, uv + iTime * 0.2).r * 0.02;
    float r = texture(iChannel1, uv).r; // shift r channel
    vec2 gb = texture(iChannel1, uv + noise).gb;
    fragColor = vec4(r, gb, 40);
  }
`

const comeDown = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const Wrapper = styled(Tilt)`
  margin-left: -110px;
  height: 220px;
  width: 220px;
  opacity: 0;
  animation: ${comeDown} 1.8s ease forwards;
  animation-deplay: 2.8s;
  border-radius: 2% 2% 40% 2%;

  canvas {
    border-radius: 2% 2% 40% 2%;
  }

  @media (min-width: 720px) {
    height: 400px;
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform-style: preserve-3d;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
`

const Avatar = ({ style }) => {
  return (
    <Wrapper
      style={{
        transform: style?.transform
      }}
      options={{
        max: 25
      }}
    >
      <ShadertoyReact
        fs={fragmentShader}
        textures={[{ url: NoiseImg }, { url: img }]}
      />
    </Wrapper>
  )
}

Avatar.propTypes = {
  style: PropTypes.object
}

export default Avatar
