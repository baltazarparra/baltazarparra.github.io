import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import Menu from '../components/Menu'
import Avatar from '../components/Avatar'
import Hero from '../components/Hero'
import Background from '../components/Background'

const IndexPage = () => (
  <Layout>
    <SEO title='Home' />
    <Menu />
    <Avatar />
    <Hero />
    <Background />
  </Layout>
)

export default IndexPage
