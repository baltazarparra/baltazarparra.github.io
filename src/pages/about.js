import React from 'react'
import { Link } from 'gatsby'
import Profile from  '../components/Profile'

const AboutPage = () => (
    <>
        <h1>About page</h1>
        <Profile />
        <ul>
            <li>
                <Link to="/" activeStyle={{border: 'solid red 1px'}}>Home</Link>
            </li>
            <li>
                <Link to="about" activeStyle={{color: "red"}}>About</Link>
            </li>
        </ul>
    </>
)

export default AboutPage