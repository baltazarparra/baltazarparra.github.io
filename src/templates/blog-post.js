import React, { useEffect, useState } from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

import Seo from '../components/seo'
import Background from '../components/Background'

import styled from 'styled-components'
import Tilt from 'react-tilt'
import Unsplash from 'react-unsplash-wrapper'

import AniLink from 'gatsby-plugin-transition-link/AniLink'
import GlobalStyles from '../../src/styles/global'

import AnimatedCursor from 'react-animated-cursor'

const Post = styled.main`
  padding: 1em 1em;

  @media (min-width: 720px) {
    max-width: 700px;
  }

  h1 {
    margin: 1em 0;
  }

  p {
    line-height: 1.8;
    letter-spacing: .01em;
  }
  `

const ImageWrap = styled.div`
  width: fit-content;
  padding: 0;
  margin: 0;
  display: flex;
  margin: 90px auto 20px;

  img {
    box-shadow: 12px 12px 1px 1px #E2FFF7;
    margin: 0;
  }
`

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin-bottom: 90px;
`

export const query = graphql`
  query Post($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      frontmatter {
        title
        date
        tags
      }
      html
    }
  }
`

const BlogPost = ({ data }) => {
  const post = data?.markdownRemark
  const [ready, isReady] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  const handleScroll = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })

    isReady(true)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const translate = `translateY(-${scrollPosition / 3}px)`

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
      <GlobalStyles />
      <AniLink style={{ position: 'fixed', top: '10px', right: '10px' }} paintDrip to='/' duration={1} hex='#0D2834'>Back to home</AniLink>
      <Wrapper>
        <ImageWrap style={{ transform: translate }}>
          <Tilt key={post.frontmatter.slug} options={{ max: 16, scale: 1 }}>
            <Unsplash width='300' height='300' keywords={post.frontmatter.tags} img />
          </Tilt>
        </ImageWrap>
        <Seo title={`${post.frontmatter.title}`} />
        <small>{post.frontmatter.date}</small>
        <Post dangerouslySetInnerHTML={{ __html: post.html }} />
        <Background />
      </Wrapper>
    </>
  )
}

BlogPost.propTypes = {
  data: PropTypes.object
}

export default BlogPost
