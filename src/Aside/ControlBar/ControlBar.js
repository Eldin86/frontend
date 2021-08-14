import React from 'react'

import './ControlBar.css'

const ControlBar = (props) => {
    return(
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
    )
}
export default ControlBar