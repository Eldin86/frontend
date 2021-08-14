import React from 'react'

import './Spinner.css'

const Spinner = (props) => {
    return(
        <div className="lds-dual-ring" width={props.width}></div>
    )
}

export default Spinner