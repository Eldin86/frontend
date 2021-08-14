import React from 'react'
import ReactDOM from 'react-dom'
import { CSSTransition } from 'react-transition-group'

import Backdrop from './Backdrop'
import './Modal.css'

const Modal = (props) => {
    const modalElement = (
        <>
        {props.show && <Backdrop onClick={props.onCancel}/>}
        <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200} classNames="modals">
            <div className={`Modal ${props.modal}`} onClick={props.onClick}>
                <header className={`modal_header ${props.headerStyle}`}>
                    <h3 className={props.center}>{props.header}</h3>
                </header>
                <footer className={`modal_footer ${props.footerStyle}`}>
                    {props.footer}
                </footer>
            </div>
        </CSSTransition>
        </>
    )
    return ReactDOM.createPortal(modalElement, document.getElementById("modal-hook"))
}

export default Modal
