import React from 'react'

import './Card.css'

const Card = (props) => {
    return(
        <div className="Card_wrapper">
            <div style={{maxWidth: props.width || '450px', padding: props.padding}} className="Card">
            {props.children}
            </div>
        </div>
    )
}

export default Card