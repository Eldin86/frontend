import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { useHttp } from '../../shared/hooks/http-hook'

import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/FormElements/Button'
import Spinner from '../../shared/UIElements/Spinner'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import Input from '../../shared/FormElements/Input'
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL } from '../../shared/utils/validators'
import { AuthContext } from '../../shared/context/auth-context'

import './Signup.css'

function Signup() {
    const auth = useContext(AuthContext)
    const [formState, inputHandler] = useForm({
        username: {
            value: '',
            isValid: false,
        },
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        },
        secret: {
            value: '',
            isValid: false
        }
    }, false)
    const history = useHistory()

    const { isLoading, error, sendRequest, clearError } = useHttp()

    const onSubmitSignup = async (e) => {
        e.preventDefault()
        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_API}/signup`,
                'POST',
                JSON.stringify({
                    username: formState.inputs.username.value,
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value,
                    secret: formState.inputs.secret.value
                }),
                {
                    'Content-Type': 'application/json'
                })
            history.push('/')
            auth.login(responseData.token)
        } catch (err) {
        }
    }


    return (
        <div className="text-white">
            <ErrorModal error={error} onClear={clearError} />
            <div className="SignupBanner"><h2>SIGNUP</h2></div>
            <div className="Content Login_content p-30 mt-10">
                <div className="Login_form">
                    <form onSubmit={onSubmitSignup}>
                        <Input
                            id="username"
                            element="input"
                            type="text"
                            placeholder="Username"
                            errorText="Please enter your username"
                            onInput={inputHandler}
                            initialValue={formState.inputs.username.isValid}
                            validators={[VALIDATOR_REQUIRE()]}
                        />
                        <Input
                            id="email"
                            element="input"
                            type="text"
                            placeholder="Email"
                            errorText="Incorrect email"
                            onInput={inputHandler}
                            validators={[VALIDATOR_EMAIL()]}
                            initialIsValid={formState.inputs.email.isValid} />

                        <Input
                            id="password"
                            element="input"
                            type="text"
                            placeholder="Password"
                            errorText="Enter your password"
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE()]}
                            initialIsValid={formState.inputs.password.isValid} />

                        <Input
                            id="secret"
                            element="input"
                            type="text"
                            placeholder="Your secret"
                            errorText="Enter your secret"
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE()]}
                            initialIsValid={formState.inputs.secret.isValid} />

                        <Button type="submit" disabled={!formState.isValid}>SIGNUP {isLoading && <Spinner />}</Button>


                    </form>
                </div>

            </div>
        </div>
    )
}

export default Signup
