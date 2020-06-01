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
  animation-delay: 2s;
  margin-top: 4em;

  a {
    display: flex;
    text-decoration: none;
  }
`

const Post = styled.li`
  text-align: left;
  padding: 1em;
  opacity: 0;
  position: relative;
  animation: ${slide} 1s cubic-bezier(.12,.58,0,1.61) forwards;
  animation-delay: 2.4s;
  :hover {
    box-shadow: 10px -20px 50px 4px rgba(0,0,0,0.12);
  }
  @media (min-width: 640px) {
    margin-bottom: 2em;
  }
  @media (min-width: 1024px) {
    margin-bottom: 4em;
  }
`

const LinkTitle = styled.h2`
  font-size: 24px;
  padding-bottom: .4em;
`

const LinkResume = styled.span`
  display: block;
  width: 240px;
  margin-right: 1em;
  font-size: 16px;

  @media (min-width: 720px) {
    width: 440px;
    margin-right: 1em;
  }

  @media (min-width: 1024px) {
    width: 540px;
    margin-right: 2em;
  }
`

const PostTitle = styled.h1`
  font-size: 30px;
  letter-spacing: 2px;
  line-height: 3;
  position: relative;

  :before {
    content: '';
    position: absolute;
    top: 44px;
    left: -54px;
    height: 2px;
    width: 28px;
    background-color: #7AA7AC;
  }

  @media (min-width: 720px) {
    font-size: 32px;
    text-transform: uppercase;
    line-height: 4;

    :before {
      content: '';
      position: absolute;
      top: 64px;
      left: -54px;
      height: 1px;
      width: 28px;
      background-color: #7AA7AC;
    }
  }
`

const ImageWrap = styled.div`
  display: none;

  @media (min-width: 720px) {
    display: block;
    height: 100%;
  }
  img {
    box-shadow: 6px 6px 1px 1px #E2FFF7;
    margin-right: 1em;
  }
`

const Posts = () => {
  const { allMarkdownRemark } = useStaticQuery(graphql`
    query PostList {
      allMarkdownRemark
      (sort: { fields: [frontmatter___date] })
      {
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
          <Post key={slug}>
            <Tilt options={{ max: 2, scale: 1.02 }}>
              <AniLink cover to={slug} duration={3} bg='#0D2834'>
                <div>
                  <LinkTitle>{title}</LinkTitle>
                  <small>{date}</small>
                  <LinkResume>{resume}</LinkResume>
                </div>
                <ImageWrap>
                  <Unsplash width='100' height='100' keywords={`background, ${tags}`} img />
                </ImageWrap>
              </AniLink>
            </Tilt>
          </Post>
        ))}
      </ul>
    </PostList>
  )
}

export default Posts
