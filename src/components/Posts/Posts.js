import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import styled, { keyframes } from 'styled-components'

const slide = keyframes`
  0% {
    opacity: 0;
    transform: translateY(2%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);

  }
`

const PostList = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
  animation: ${slide} 1.2s cubic-bezier(.12,.58,0,1.61) forwards;
  animation-delay: 3.8s;

  li {
    text-align: left;
    padding-right: 1em;
    opacity: 0;
    position: relative;
    margin-bottom: 4em;
    animation: ${slide} 1s cubic-bezier(.12,.58,0,1.61) forwards;
    animation-delay: 4.4s;
  }

  h2 {
    :before {
      content: '';
      position: absolute;
      top: 18px;
      left: -36px;
      height: 1px;
      width: 24px;
      background-color: #7AA7AC;
    }
  }
`

const PostTitle = styled.h1`
  font-size: 32px;
  text-decoration: overline wavy;
  letter-spacing: 6px;
  line-height: 3;

  @media (min-width: 720px) {
    line-height: 2;
  }
`

const Posts = () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query PostList {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              title
              resume
            }
          }
        }
      }
    }
  `)

  const postList = allMarkdownRemark.edges

  return (
    <PostList>
      <PostTitle>Escritas</PostTitle>
      <ul>
        {postList.map(({
          node: {
            frontmatter: { title, resume }
          }
        }) => (
          <li key={title}>
            <h2>{title}</h2>
            <span>{resume}</span>
          </li>
        ))}
      </ul>
    </PostList>
  )
}

export default Posts
