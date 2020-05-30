import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import Seo from '../components/seo'
import Menu from '../components/Menu'
import Avatar from '../components/Avatar'
import Hero from '../components/Hero'
import Posts from '../components/Posts'
import Background from '../components/Background'
import Footer from '../components/Footer'
import AnimatedCursor from 'react-animated-cursor'

const IndexPage = () => {
  const [ready, isReady] = useState(false)

  useEffect(() => {
    isReady(true)
  }, [])

  return (
    <>
      {ready &&
        <AnimatedCursor
          color='122, 167, 172'
          outlineAlpha={0.1}
          dotSize={8}
          outlineSize={20}
          dotScale={0.8}
          outlineScale={4}
        />}
      <Menu />
      <Layout>
        <Seo title='stay creative' />
        <Avatar />
        <Hero />
        <Background />
      </Layout>
      <Posts />
      <Footer />
    </>
  )
}

export default IndexPage
