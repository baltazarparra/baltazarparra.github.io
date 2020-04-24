import React from 'react'
import Particles from 'react-particles-js'
import styled from 'styled-components'

const Live = styled(Particles)`
  position: absolute;
  height: 100vh;
  width: 100%;
  z-index: -1;
`

const Background = () => (
  <Live
    params={{
      particles: {
        number: {
          value: 40,
          density: {
            enable: true,
            value_area: 1500
          }
        },
        line_linked: {
          enable: true,
          opacity: 0.03
        },
        move: {
          direction: 'right',
          speed: 0.1
        },
        size: {
          value: 1.3
        },
        opacity: {
          anim: {
            enable: true,
            speed: 1,
            opacity_min: 0.05
          }
        }
      },
      retina_detect: true
    }}
  />
)

export default Background
