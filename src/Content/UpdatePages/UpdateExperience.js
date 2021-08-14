import React, { useState, useContext, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Card from '../../shared/UIElements/Card'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttp } from '../../shared/hooks/http-hook'
import Spinner from '../../shared/UIElements/Spinner'
import ErrorModal from '../../shared/UIElements/ErrorModal'

const UpdateExperience = () => {
    const educationID = useParams().id
    const [data, setData] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()
    const { isLoading, error, sendRequest, clearError } = useHttp()

    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler, setFormData] = useForm({
        from: {
            value: '',
            isValid: false
        },
        to: {
            value: '',
            isValid: false
        },
        company: {
            value: '',
            isValid: false
        },
        position: {
            value: '',
            isValid: false
        }
    }, false)

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_API}/resume/experience/${educationID}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token,
                    })
                setData(responseData)
                setFormData({
                    from: {
                        value: responseData.from,
                        isValid: true
                    },
                    to: {
                        value: responseData.to,
                        isValid: true
                    },
                    position: {
                        value: responseData.position,
                        isValid: true
                    },
                    company: {
                        value: responseData.company,
                        isValid: true
                    }
                }, true)
            } catch (e) { }
        }
        fetchEducation()

    }, [setFormData, auth, educationID, sendRequest])

    const experienceSubmitHanlder = async event => {
        event.preventDefault()

        try {
            await sendRequest(`${process.env.REACT_APP_API}/resume/update/experience/${educationID}`, 'PATCH',
                JSON.stringify({
                    company: formState.inputs.company.value,
                    from: formState.inputs.from.value,
                    position: formState.inputs.position.value,
                    to: formState.inputs.to.value
                }),
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            )
            history.push('/resume')
        } catch (e) { }

    }

    /* Privremeno rjesenje pravo rjesenje ima kad budemo povezivali backend i frontend */
    /* https://www.udemy.com/course/react-nodejs-express-mongodb-the-mern-fullstack-guide/learn/lecture/16855088#notes */
    if (isLoading) {
        return (
            <div className="text-center m-30"><Spinner /></div>
        )
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />

            {
                !isLoading && data && <Card margin="10px"> <form onSubmit={experienceSubmitHanlder}>
                    <Input
                        id="from"
                        element="input"
                        type="text"
                        label="Update start period"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter starting month and year"
                        onInput={inputHandler}
                        initialValue={data.from}
                        initialIsValid={true} />

                    <Input
                        id="to"
                        element="input"
                        type="text"
                        label="Update end period"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter ending month and year"
                        onInput={inputHandler}
                        initialValue={data.to}
                        initialIsValid={true} />

                    <Input
                        id="company"
                        element="input"
                        type="text"
                        label="Update company"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter company name"
                        onInput={inputHandler}
                        initialValue={data.company}
                        initialIsValid={true} />

                    <Input
                        id="position"
                        element="textarea"
                        type="text"
                        label="Update position"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter position"
                        onInput={inputHandler}
                        initialValue={data.position}
                        initialIsValid={true} />


                    <Button type="submit" disabled={!formState.isValid}>UPDATE INFO {isLoading && <Spinner />}</Button>
                </form>
                </Card>
            }
        </>
    )
}

export default UpdateExperience