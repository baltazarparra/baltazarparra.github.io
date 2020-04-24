import React from 'react'
import ShadertoyReact from 'shadertoy-react'
import styled from 'styled-components'
import Tilt from 'react-tilt'

import AvatarImg from '../../images/avatar-min.jpg'
import NoiseImg from '../../images/noise.jpg'

const fragmentShader = `
void mainImage( out vec4 fragColor, in vec2 fragCoord )
  {
    vec2 uv = fragCoord.xy / iResolution.xy;
    float noise = texture(iChannel0, uv + iTime * 0.1).r * 0.01;
    float r = texture(iChannel1, uv).r; // shift r channel
    vec2 gb = texture(iChannel1, uv + noise).gb;
    fragColor = vec4(r, gb, 1.);
  }
`

const Wrapper = styled(Tilt)`
  margin-left: -110px;
  height: 280px;
  width: 280px;

  @media (min-width: 1024px) {
    height: 400px;
    width: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    transform-style: preserve-3d;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
`

const Avatar = () => {
  return (
    <Wrapper
      options={{
        max: 25
      }}
    >
      <ShadertoyReact
        fs={fragmentShader}
        textures={[{ url: NoiseImg }, { url: AvatarImg }]}
      />
    </Wrapper>
  )
}

export default Avatar
