import React from 'react'
import PropTypes from 'prop-types'

const Posts = ({ title }) => <li>{title}</li>

Posts.propTypes = {
  title: PropTypes.string
}

export default Posts
