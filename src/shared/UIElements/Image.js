import React from 'react'

const Image = (props) => {
    return(
        <>
            <img style={{padding: props.padding, margin: props.margin}} src={props.src} alt={props.alt} width={props.width}/>
        </>
    )
}

export default Image