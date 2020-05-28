import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'

import styled, { keyframes } from 'styled-components'
import Tilt from 'react-tilt'
import Unsplash from 'react-unsplash-wrapper'
import AniLink from 'gatsby-plugin-transition-link/AniLink'

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
  animation-delay: 3s;

  li {
    text-align: left;
    padding: 1em;
    opacity: 0;
    position: relative;
    margin-bottom: 4em;
    animation: ${slide} 1s cubic-bezier(.12,.58,0,1.61) forwards;
    animation-delay: 3.8s;
    :hover {
      box-shadow: 10px -20px 50px 4px rgba(0,0,0,0.12);
    }
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
  font-size: 38px;
  letter-spacing: 6px;
  line-height: 3;
  position: relative;

  :before {
    content: '';
    position: absolute;
    top: 76px;
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
  img {
    box-shadow: 6px 6px 1px 1px #E2FFF7;
    margin: 1em;
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
              date
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
            frontmatter: { title, resume, tags, date },
            fields: { slug }
          }
        }) => (
          <Tilt key={slug} options={{ max: 2, scale: 1.02 }}>
            <li>
              <AniLink style={{ overflow: 'hidden' }} paintDrip to={slug} duration={1} hex='#0D2834'>
                <div>
                  <h2>{title}</h2>
                  <small>{date}</small>
                  <span>{resume}</span>
                </div>
                <ImageWrap>
                  <Unsplash width='100' height='100' keywords={`${tags}`} img />
                </ImageWrap>
              </AniLink>
            </li>
          </Tilt>
        ))}
      </ul>
    </PostList>
  )
}

export default Posts
