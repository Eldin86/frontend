import React, { useState, useEffect } from 'react'
import {useLocation, useHistory} from 'react-router-dom'

import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/FormElements/Button'
import Spinner from '../../shared/UIElements/Spinner'
import Input from '../../shared/FormElements/Input'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useHttp } from '../../shared/hooks/http-hook'

import './Recover.css'

const Reset = (props) => {
    const [message, setMessage] = useState('')
    const [status, setStatus] = useState()
    const queryParams = useLocation().search
    const history = useHistory()
    const { isLoading, error, sendRequest } = useHttp()
    const [formState, inputHandler] = useForm({
        password: {
            value: '',
            isValid: false,
        },
        repeatPassword: {
            value: '',
            isValid: false
        }
    }, false)

    const key = new URLSearchParams(queryParams).get('key');
    const email = new URLSearchParams(queryParams).get('email');

    useEffect(() => {
        let delayRedirect
        if(status){
            delayRedirect = setTimeout(() => {
                history.push('/login')
            }, 5000)
        }
        return () => clearTimeout(delayRedirect)
    }, [status, history])


    const onSubmitRecover = async (e) => {
        e.preventDefault()
        setMessage('')
        setStatus('')
        if (formState.inputs.password.value === formState.inputs.repeatPassword.value) {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_API}/reset-password/secret`,
                    'POST',
                    JSON.stringify({
                        password: formState.inputs.password.value,
                        repeatPassword: formState.inputs.repeatPassword.value,
                        key,
                        email
                    }),
                    {
                        //Content type koristimo samo kad zelimo nesto da posaljemo, odnosno kad attachiramo neke data na odlazeci request
                        'Content-Type': 'application/json'
                    }
                )
                setStatus(responseData.message)
                
            } catch (err) { }
        }else{
            setMessage('Passwords do not match')
        }
    }

    return (
        <div className="text-white">
            
            <div className="RecoverBanner"><h2>RESET PASSWORD</h2></div>
            <div className="Content Login_content p-30 mt-10">
                <div className="Login_form">
                    <form onSubmit={onSubmitRecover}>
                        <Input
                            id="password"
                            element="input"
                            type="text"
                            placeholder="Enter your password"
                            errorText="Please enter your password"
                            onInput={inputHandler}
                            initialValue={formState.inputs.password.isValid}
                            validators={[VALIDATOR_REQUIRE()]}
                        />
                        <Input
                            id="repeatPassword"
                            element="input"
                            type="text"
                            placeholder="Repeat password"
                            errorText="Please repeat your password"
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE()]}
                            initialIsValid={formState.inputs.repeatPassword.isValid} />
                        {message && <h6 style={{ color: '#93DC80', textTransform: 'uppercase', margin: '.2rem 0' }}>{message}</h6>}
                        {status && <h6 style={{ color: '#93DC80', textTransform: 'uppercase', margin: '.2rem 0' }}>{status}</h6>}
                        
                        {error && <h6 style={{ color: '#bd2f2f', textTransform: 'uppercase', margin: '.2rem 0' }}>{error}</h6>}
                        <Button type="submit" disabled={!formState.isValid}>SUBMIT{isLoading && <Spinner />}</Button>

                    </form>
                </div>

            </div>
        </div>
    )
}

export default Reset