import React from 'react'
import Layout from '../components/Layout'
import Seo from '../components/seo'
import Menu from '../components/Menu'
import Avatar from '../components/Avatar'
import Hero from '../components/Hero'
import Background from '../components/Background'

const IndexPage = () => (
  <Layout>
    <Seo title='stay creative' />
    <Menu />
    <Avatar />
    <Hero />
    <Background />
  </Layout>
)

export default IndexPage
