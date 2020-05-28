import React from 'react'
import PropTypes from 'prop-types'

import styled from 'styled-components'
import GlobalStyles from '../../styles/global'

const Wrapper = styled.main`
  display: flex;
  height: 80vh;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
