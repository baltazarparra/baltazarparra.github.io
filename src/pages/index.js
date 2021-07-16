import React, { useEffect, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import Seo from '../components/seo'
import Menu from '../components/Menu'
import Avatar from '../components/Avatar'
import Hero from '../components/Hero'
import Posts from '../components/Posts'
import Background from '../components/Background'
import Footer from '../components/Footer'
import AnimatedCursor from 'react-animated-cursor'
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader'

deckDeckGoHighlightElement()

const IndexPage = () => {
  const [ready, isReady] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = useCallback(() => {
    const position = window.pageYOffset
    setScrollPosition(position)
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    isReady(true)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const translateAvatar = `translateY(-${scrollPosition / 2}px)`

  const translateHero = `translateY(-${scrollPosition / 4}px)`

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
        <Avatar style={{ transform: translateAvatar }} />
        <Hero style={{ transform: translateHero }} />
        <Background />
      </Layout>
      <Posts />
      <Footer />
    </>
  )
}

export default IndexPage
