import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

const Profile = () => {
  const {
    site: {
      siteMetadata: { title, author, description }
    }
  } = useStaticQuery(graphql`
    query MySiteMetadata {
        site {
        siteMetadata {
            title
            author
            description
        }
      }
    }
  `)
  return (
    <h1>{title}, {description}, {author}</h1>
  )
}

export default Profile
