import React, { useState, useEffect } from 'react'

import Layout from '../components/Layout'
import Seo from '../components/seo'
import Background from '../components/Background'

import styled from 'styled-components'
import AniLink from 'gatsby-plugin-transition-link/AniLink'

import AnimatedCursor from 'react-animated-cursor'

const Back = styled(AniLink)`
  display: block;
  padding: 1em;
  text-align: right;
`

const NotFoundPage = () => {
  const [ready, isReady] = useState(false)

  useEffect(() => {
    isReady(true)
  }, [])

  return (
    <Layout>
      {ready &&
        <AnimatedCursor
          color='122, 167, 172'
          outlineAlpha={0.1}
          dotSize={8}
          outlineSize={20}
          dotScale={0.8}
          outlineScale={4}
        />}
      <Back paintDrip to='/' duration={1} hex='#0D2834'>Back to home</Back>
      <Seo title='404: Not found' />
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      <Background />
    </Layout>
  )
}

export default NotFoundPage
