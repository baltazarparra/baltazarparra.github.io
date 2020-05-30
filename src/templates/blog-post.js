import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'

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
  font-size: 20px;
  line-height: 32px;
  text-align: left;

  @media (min-width: 720px) {
    max-width: 700px;
  }

  h1 {
    margin: 1em 0;
  }

  p {
    font-size: 20px;
    line-height: 32px;
  }
  `

const ImageWrap = styled.div`
  position: relative;
  display: block;
  height: 300px;
  width: 90%;
  overflow: hidden;
  margin-top: 3em;
  margin-bottom: 3em;
  box-shadow: 0 14px 28px rgba(0,0,0,0.05), 0 10px 10px rgba(0,0,0,0.02);

  @media (min-width: 720px) {
    display: block;
    margin: 14px auto;
    height: 400px;
    width: 100%;
  }
`

const Wrapper = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  margin: 32px auto;
  padding: 0 .8em;

  h1 {
    margin: 0;
    font-size: 38px;
    text-align: center;
    line-height: 1.2;
  }

  h3 {
    font-size: 20px;
    font-wight: 400;
    margin-top: 1em;
    text-align: center;
  }

  small {
    font-size: 12px;
    margin-top: 1em;
  }

  @media (min-width: 720px) {
    max-width: 700px;

    h1 {
      font-size: 56px;
    }

    h3 {
      font-size: 20px;
    }

    small {
      font-size: 12px;
    }
  }
`

const Back = styled(AniLink)`
  display: block;
  padding: 1em;
  text-align: right;
`

export const query = graphql`
  query Post($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      frontmatter {
        title
        resume
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

  const translate = `translateY(-${scrollPosition / 10}px)`

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
      <Back paintDrip to='/' duration={1} hex='#0D2834'>Back to home</Back>
      <Wrapper>
        <h1>{post.frontmatter.title}</h1>
        <h3>{post.frontmatter.resume}</h3>
        <small>{post.frontmatter.date}</small>
        <ImageWrap style={{ transform: translate }}>
          <Tilt key={post.frontmatter.slug} options={{ max: 16, scale: 1 }}>
            <Unsplash keywords={post.frontmatter.tags} />
          </Tilt>
        </ImageWrap>
        <Seo title={`${post.frontmatter.title}`} />
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
