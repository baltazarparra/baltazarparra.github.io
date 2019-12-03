import React from 'react'
import { Link } from 'gatsby'
import Layout from  '../components/Layout'

const AboutPage = () => (
    <Layout>
        <h1>About page</h1>
        <ul>
            <li>
                <Link to="/" activeStyle={{border: 'solid red 1px'}}>Home</Link>
            </li>
            <li>
                <Link to="about" activeStyle={{color: "red"}}>About</Link>
            </li>
        </ul>
    </Layout>
)

export default AboutPage
