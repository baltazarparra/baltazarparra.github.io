import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import GlobalStyles from '../../styles/global'

const Wrapper = styled.main`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media (min-width: 720px) {
    height: 80vh;
  }

  @media (min-width: 1024px) {
    height: 60vh;
  }

  @media (min-width: 1366px) {
    height: 80vh;
  }
`

const Layout = ({ children }) => {
  return (
    <Wrapper>
      <GlobalStyles />
      {children}
    </Wrapper>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
}

export default Layout
