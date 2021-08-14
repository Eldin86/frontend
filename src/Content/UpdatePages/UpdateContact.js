import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Card from '../../shared/UIElements/Card'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useForm } from '../../shared/hooks/form-hook'
import Spinner from '../../shared/UIElements/Spinner'
import { useHttp } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import ErrorModal from '../../shared/UIElements/ErrorModal'

const UpdateEmail = () => {
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [data, setData] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()

    const [formState, inputHandler, setFormData] = useForm({
        email: {
            value: '',
            isValid: false
        },
        phone: {
            value: '',
            isValid: false
        },
        location: {
            value: '',
            isValid: false
        }
    }, false)

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_API}/contact`)
                setData(responseData)

                setFormData({
                    email: {
                        value: responseData.email,
                        isValid: true
                    },
                    phone: {
                        value: responseData.phone,
                        isValid: true
                    },
                    location: {
                        value: responseData.location,
                        isValid: true
                    }
                }, true)
            } catch (e) { }
        }
        fetchAbout()

    }, [setFormData, sendRequest])

    const updateContactSubmitHanlder = async (e) => {
        e.preventDefault()

        try {
            await sendRequest(`${process.env.REACT_APP_API}/contact/update`, 'PATCH',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    location: formState.inputs.location.value,
                    phone: formState.inputs.phone.value,
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            )
            history.push('/contact')
        } catch (e) { }
    }

    if (isLoading) {
        return (
            <div className="text-center m-30"><Spinner /></div>
        )
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
            <Card margin="10px">
                {
                    !isLoading && data && auth.token && <form onSubmit={updateContactSubmitHanlder}>
                        <Input
                            id="email"
                            element="input"
                            type="text"
                            label="Update your email"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your email"
                            onInput={inputHandler}
                            initialValue={data.email}
                            initialIsValid={true} />
                        <Input
                            id="phone"
                            element="input"
                            type="text"
                            label="Update your phone number"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your phone number"
                            onInput={inputHandler}
                            initialValue={data.phone}
                            initialIsValid={true} />
                        <Input
                            id="location"
                            element="input"
                            type="text"
                            label="Update your address"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter your address"
                            onInput={inputHandler}
                            initialValue={data.location}
                            initialIsValid={true} />
                        {!isLoading && error && <h6 className="error-message">Something went wrong, please try later</h6>}
                        <Button type="submit" disabled={!formState.isValid}>UPDATE INFO {isLoading && <Spinner />}</Button>
                    </form>
                }
            </Card>
        </>
    )
}

export default UpdateEmail
