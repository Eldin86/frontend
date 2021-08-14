import React, { useContext } from 'react'

import Button from '../../../shared/FormElements/Button'
import Image from '../../../shared/UIElements/Image'

import Home from '../../../assets/home.svg'
import About from '../../../assets/person.svg'
import Portfolio from '../../../assets/computer.svg'
import Resume from '../../../assets/resume.svg'
import Contact from '../../../assets/support.svg'
import Login from '../../../assets/login.svg'
import { AuthContext } from '../../../shared/context/auth-context'

import './Navigation.css'

const Navigation = (props) => {
    const auth = useContext(AuthContext)
    const logoutHandler = () => {
        auth.logout()
    }
    return (
        <ul className="Nav" onClick={props.removeSidebar}>
            <li>
                <Button exact to="/">
                    <Image src={Home} width="30px" /><span>HOME</span>
                </Button>
            </li>
            <li>
                <Button to="/about">
                    <Image src={About} width="30px" /><span>ABOUT</span>
                </Button>
            </li>
            <li>
                <Button to="/portfolio">
                    <Image src={Portfolio} width="30px" /><span>PORTFOLIO</span>
                </Button>
            </li>
            <li>
                <Button to="/resume">
                    <Image src={Resume} width="30px" /><span>RESUME</span>
                </Button>
            </li>
            <li>
                <Button to="/contact">
                    <Image src={Contact} width="30px" /><span>CONTACT</span>
                </Button>
            </li>
            <li>
                <Button to="/login">
                    <Image src={Login} width="30px" />{ auth.isLoggedIn ? <span onClick={logoutHandler}>LOGOUT</span> : <span>LOGIN</span>}
                </Button>
            </li>
        </ul>
    )
}

export default Navigation