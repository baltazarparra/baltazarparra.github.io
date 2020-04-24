import React from "react"
import styled from 'styled-components'
import Tilt from "react-tilt"

import AvatarImg from '../../images/avatar-min.jpg'

const Wrapper = styled(Tilt)`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  transform-style: preserve-3d;
`

const Image = styled.img`
  display: block;
  height: 400px;
  box-shadow: 12px 12px 8px #00000029;
`

const Avatar = () => {
  return (
    <Wrapper
      options={{
        max: 25
      }}
      style={{
        height: 400,
        width: 400
      }}
    >
      <Image src={AvatarImg} alt="Avatar" />
    </Wrapper>
  )
}

export default Avatar
