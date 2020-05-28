import React from 'react'
import { graphql } from 'gatsby'
import PropTypes from 'prop-types'

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
      <h1>{post.frontmatter.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </>
  )
}

BlogPost.propTypes = {
  data: PropTypes.string
}

export default BlogPost
