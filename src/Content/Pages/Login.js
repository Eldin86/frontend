import React, { useContext } from 'react'
import { NavLink, useHistory } from 'react-router-dom'

import { useForm } from '../../shared/hooks/form-hook'
import { useHttp } from '../../shared/hooks/http-hook'

import Button from '../../shared/FormElements/Button'
import Spinner from '../../shared/UIElements/Spinner'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import Input from '../../shared/FormElements/Input'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { AuthContext } from '../../shared/context/auth-context'

import './Login.css'

const Login = () => {
    const auth = useContext(AuthContext)
    const [formState, inputHandler] = useForm({
        username: {
            value: '',
            isValid: false,
        },
        password: {
            value: '',
            isValid: false
        }
    }, false)
    const history = useHistory()

    const { isLoading, error, sendRequest, clearError } = useHttp()

    const onLogin = async (e) => {
        e.preventDefault()

        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_API}/login`,
                'POST',
                JSON.stringify({
                    username: formState.inputs.username.value,
                    password: formState.inputs.password.value
                }),
                {
                    //Content type koristimo samo kad zelimo nesto da posaljemo, odnosno kad attachiramo neke data na odlazeci request
                    'Content-Type': 'application/json'
                }
            )
            history.push('/')
            //Originalno je bez new Date(), ovo je prvo prepravljeno, nakon sto se ovo ukloni onda je na starom sve
            auth.login(responseData.token)
        } catch (err) { }
    }

    return (
        <div className="text-white">
            <ErrorModal error={error} onClear={clearError}/>
            <div className="LoginBanner"><h2>LOGIN</h2></div>
            <div className="Content Login_content p-20 mt-10">
                <div className="Login_form">
                    <form onSubmit={onLogin}>
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
                            id="password"
                            element="input"
                            type="text"
                            placeholder="Password"
                            errorText="Incorrect password"
                            onInput={inputHandler}
                            validators={[VALIDATOR_REQUIRE()]}
                            initialIsValid={formState.inputs.password.isValid} />

                        <div className="login_signup_wrapper">
                            <Button type="submit" disabled={!formState.isValid}>LOGIN {isLoading && <Spinner />}</Button>
                            <Button className="signup" to="/signup">SIGN UP</Button>
                        </div>
                        <p className="recover_password"><NavLink to="/recover">Forgot password?</NavLink></p>

                    </form>
                </div>

            </div>
        </div>
    )
}

export default Login