import React from "react"
import PropTypes from "prop-types"
import Profile from "../Profile"

import styled from 'styled-components'
import GlobalStyles from '../../styles/global'

const Wrapper = styled.main`
  display: flex;
  padding: 1rem;
`

const Layout = ({ children }) => {
  return (
    <Wrapper>
      <GlobalStyles />
      <Profile />
      <main>{children}</main>
    </Wrapper>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
