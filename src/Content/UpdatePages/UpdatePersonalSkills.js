import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Card from '../../shared/UIElements/Card'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useForm } from '../../shared/hooks/form-hook'
import Spinner from '../../shared/UIElements/Spinner'
import { useHttp } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import ErrorModal from '../../shared/UIElements/ErrorModal'

const UpdateProffesionalSkills = () => {
    const skillID = useParams().id
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [data, setData] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()

    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler, setFormData] = useForm({
        level: {
            value: '',
            isValid: false
        },
        skillTitle: {
            value: '',
            isValid: false
        }
    }, false)

    useEffect(() => {
        const getSkill = async () => {
            try {
                const response = await sendRequest(`${process.env.REACT_APP_API}/resume/skill/${skillID}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token,
                    })
                setData(response)

                setFormData({
                    level: {
                        value: response.level,
                        isValid: true
                    },
                    skillTitle: {
                        value: response.skillTitle,
                        isValid: true
                    }
                }, true)
            } catch (e) { }
        }
        getSkill()
    }, [setFormData, sendRequest, skillID, auth])

    const skillSubmitHanlder = async event => {
        event.preventDefault()

        try {
            await sendRequest(`${process.env.REACT_APP_API}/resume/update/skill/${skillID}`, 'PATCH',
                JSON.stringify({
                    level: formState.inputs.level.value,
                    skillTitle: formState.inputs.skillTitle.value,
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
        <Card margin="10px">
            {
                !isLoading && data && <form onSubmit={skillSubmitHanlder}>
                    <Input
                        id="level"
                        element="input"
                        type="text"
                        label="Update your skill level (max: 100%)"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter your skill level"
                        onInput={inputHandler}
                        initialValue={data.level}
                        initialIsValid={true} />

                    <Input
                        id="skillTitle"
                        element="input"
                        type="text"
                        label="Update your personal skill name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter your personal skill level"
                        onInput={inputHandler}
                        initialValue={data.skillTitle}
                        initialIsValid={true} />

                    <Button type="submit" disabled={!formState.isValid}>UPDATE INFO {isLoading && <Spinner />}</Button>
                </form>
            }
        </Card>
        </>
    )
}

export default UpdateProffesionalSkills