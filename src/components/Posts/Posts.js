import React from 'react'
import { useStaticQuery, graphql, Link } from 'gatsby'

import styled, { keyframes } from 'styled-components'

import Unsplash from 'react-unsplash-wrapper'

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

  a {
    display: flex;
    text-decoration: none;
  }

  h2 {
    padding-bottom: .4em;
  }

  span {
    display: block;
    width: 240px;
    margin-right: 1em;

    @media (min-width: 720px) {
      width: 440px;
      margin-right: 1em;
    }

    @media (min-width: 1024px) {
      width: 540px;
      margin-right: 2em;
    }
  }
`

const PostTitle = styled.h1`
  font-size: 32px;
  letter-spacing: 6px;
  line-height: 3;
  position: relative;

  :before {
    content: '';
    position: absolute;
    top: 64px;
    left: -54px;
    height: 2px;
    width: 32px;
    background-color: #7AA7AC;
  }

  @media (min-width: 720px) {
    line-height: 4;
  }
`

const ImageWrap = styled.div`
  display: none;
  box-shadow: 4px 4px 1px 1px #E2FFF7;

  @media (min-width: 720px) {
    display: block;
    height: 100%;
  }
`

const Posts = () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query PostList {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              resume
              tags
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
            frontmatter: { title, resume, tags },
            fields: { slug }
          }
        }) => (
          <li key={slug}>
            <Link to={slug}>
              <div>
                <h2>{title}</h2>
                <span>{resume}</span>
              </div>
              <ImageWrap>
                <Unsplash width='100' height='100' keywords={`${tags}`} img />
              </ImageWrap>
            </Link>
          </li>
        ))}
      </ul>
    </PostList>
  )
}

export default Posts
