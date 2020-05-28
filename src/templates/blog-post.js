import React from 'react'
import { graphql, Link } from 'gatsby'
import PropTypes from 'prop-types'

import Layout from '../components/Layout'
import Seo from '../components/seo'
import Background from '../components/Background'

import styled from 'styled-components'

const Post = styled.main`
  display: flex;
  flex-direction: column;
  max-width: 40%;

  h1 {
    margin-bottom: 2em;
  }

  p {
    line-height: 1.8;
    letter-spacing: .01em;
  }
`

export const query = graphql`
  query Post($slug: String!) {
    markdownRemark(fields: {slug: {eq: $slug}}) {
      frontmatter {
        title
      }
      html
    }
  }
`

const BlogPost = ({ data }) => {
  const post = data?.markdownRemark

  return (
    <>
      <Link to='/'>Back to home</Link>
      <Layout>
        <Seo title={`${post.frontmatter.title}`} />
        <Post dangerouslySetInnerHTML={{ __html: post.html }} />
        <Background />
      </Layout>
    </>
  )
}

BlogPost.propTypes = {
  data: PropTypes.string
}

export default BlogPost
