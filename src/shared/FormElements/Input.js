import React, { useReducer, useEffect } from 'react'

import { validate } from '../utils/validators'
import './Input.css'

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            }
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            }
        default:
            return state;
    }
}

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '',
        isValid: props.initialIsValid || false,
        isTouched: false
    })
    
    const { id, onInput, name } = props
    const { value, isValid } = inputState

    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput])

    const changeHandler = event => {
        dispatch({
            type: 'CHANGE',
            val: event.target.value,
            validators: props.validators
        })
    }
    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        })
    }
    const element = props.element === 'input' ? (<input
        id={props.id}
        type={props.type}
        name={name}
        placeholder={props.placeholder}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value} />
    ) : (
            <textarea
                id={props.id}
                name={name}
                rows={props.rows || 3}
                onChange={changeHandler}
                onBlur={touchHandler}
                placeholder={props.placeholder}
                value={inputState.value} />
        )

    return (
        <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
            <label htmlFor={props.id}><small>{props.label}</small></label>
            {element}
            {!inputState.isValid && inputState.isTouched && <p className="Error_text"><small>{props.errorText}</small></p>}
        </div>
    )
}

export default Input