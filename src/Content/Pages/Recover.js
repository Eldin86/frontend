import React, {useState} from 'react'

import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/FormElements/Button'
import Spinner from '../../shared/UIElements/Spinner'
import Input from '../../shared/FormElements/Input'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import { VALIDATOR_REQUIRE,VALIDATOR_EMAIL } from '../../shared/utils/validators'
import { useHttp } from '../../shared/hooks/http-hook'

import './Recover.css'

const Login = () => {
    const [message, setMessage] = useState()
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [formState, inputHandler] = useForm({
        email: {
            value: '',
            isValid: false,
        },
        secret: {
            value: '',
            isValid: false
        }
    }, false)


    const onSubmitRecover = async (e) => {
        e.preventDefault()
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_API}/recover`,
                'POST',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    secret: formState.inputs.secret.value
                }),
                {
                    //Content type koristimo samo kad zelimo nesto da posaljemo, odnosno kad attachiramo neke data na odlazeci request
                    'Content-Type': 'application/json'
                }
            )
            setMessage(responseData.message)
        } catch (err) { }
    }

    return (
        <div className="text-white">
            <ErrorModal error={error} onClear={clearError}/>
            <div className="RecoverBanner"><h2>RECOVER PASSWORD</h2></div>
            <div className="Content Login_content p-30 mt-10">
                <div className="Login_form">
                    <form onSubmit={onSubmitRecover}>
                        <Input
                            id="email"
                            element="input"
                            type="text"
                            placeholder="Email"
                            errorText="Please enter your email"
                            onInput={inputHandler}
                            initialValue={formState.inputs.email.isValid}
                            validators={[VALIDATOR_EMAIL()]}
                        />
                        <Input
                            id="secret"
                            element="input"
                            type="text"
                            placeholder="Secret answer"
                            errorText="Please enter your answer"
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE()]}
                            initialIsValid={formState.inputs.secret.isValid} />
                            {message && <h6 style={{color: '#93DC80', textTransform: 'uppercase', margin: '.2rem 0'}}>{message}</h6>}
                      
                            <Button type="submit" disabled={!formState.isValid}>SUBMIT{isLoading && <Spinner />}</Button>
           
                    </form>
                </div>

            </div>
        </div>
    )
}

export default Login