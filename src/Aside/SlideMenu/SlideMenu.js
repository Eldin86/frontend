import React, { useState } from 'react'

import UserInfo from './UserInfo/UserInfo'
import Navigation from './Navigation/Navigation'

import Facebook from '../../assets/facebook.svg'
import Linkedin from '../../assets/linkedin.svg'
import Github from '../../assets/github.svg'
import Avatar from '../../assets/profile.jpg'
import Backdrop from '../../shared/UIElements/Backdrop'

import './SlideMenu.css'

const SlideMenu = (props) => {
    const [social] = useState([
        {
            name: 'Facebook',
            icon: Facebook,
            url: 'https://www.facebook.com/eldin.maslesa'
        },
        {
            name: 'Linkedin',
            icon: Linkedin,
            url: 'https://www.linkedin.com/in/eldin-m-763894175/'
        },
        {
            name: 'Github',
            icon: Github,
            url: 'https://github.com/Eldin86'
        }
    ])
    const [avatar] = useState(Avatar)

    const removeSidebar = () => {
        props.closeNavHandler()
    }

    return (
        <>
        <div className="ControlBar">
            <div onClick={props.closeNavHandler} className="Menu_toggle">
                <span>
                    <i></i>
                    <i></i>
                    <i></i>
                </span>
            </div>
            <div className="Copyright">
                <p>MADE BY ME <i className="fa fa-copyright"></i></p>
            </div>
        </div>
        { props.isClosedNav && <Backdrop onClick={removeSidebar}/>}
        <div className={`SlideMenu ${props.isClosedNav ? 'Menuopen' : 'Menuclose'}`}>
                        <UserInfo socials={social} avatar={avatar} />
                        <Navigation removeSidebar={removeSidebar}/>
                    </div>
        </>
    )
}

export default SlideMenu
