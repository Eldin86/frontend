import React from 'react'

import Image from '../../../shared/UIElements/Image'
import Button from '../../../shared/FormElements/Button'

import './UserInfo.css'

const UserInfo = (props) => {
    return (
        <div className="UserInfo">
            <div className="Social mb-3 mt-10">
                {
                    props.socials.map(social => {
                        return (
                            <Button key={social.name} href={social.url}><Image src={social.icon} alt={social.name} width="20px" /></Button>
                        )
                    })
                }
            </div>
            <div className="Avatar_Container">
                <div className="Avatar_box">
                    <Image src={props.avatar} width='175px' alt="avatar" />
                </div>
            </div>
        </div>
    )
}

export default UserInfo