import React from "react"
import styled from 'styled-components'

import AvatarImg from '../../images/avatar-min.jpg'

const Image = styled.img`
  display: block;
  height: 400px;
  box-shadow: 6px 6px 4px #00000029;
`

const Avatar = () => {
  return <Image src={AvatarImg} alt="Avatar" />
}

export default Avatar
