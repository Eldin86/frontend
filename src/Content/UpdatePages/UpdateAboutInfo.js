import React, { useState, useEffect, useContext } from 'react'
import {useHistory} from 'react-router-dom'

import Card from '../../shared/UIElements/Card'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useForm } from '../../shared/hooks/form-hook'
import Spinner from '../../shared/UIElements/Spinner'
import { useHttp } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import {AuthContext} from '../../shared/context/auth-context'

const UpdateAbout = () => {
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [about, setAbout] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()

    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler, setFormData] = useForm({
        greetings: {
            value: '',
            isValid: false
        },
        textInfo: {
            value: '',
            isValid: false
        }
    }, false)


    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_API}/about`)
                setAbout(responseData.about)
                setFormData({
                    greetings: {
                        value: responseData.about.greetings,
                        isValid: true
                    },
                    textInfo: {
                        value: responseData.about.textInfo,
                        isValid: true
                    }
                }, true)
            } catch (e) { }
        }
        fetchAbout()
    }, [sendRequest, setFormData])

    const aboutUpdateSubmitHanlder = async event => {
        event.preventDefault()
        try{
            await sendRequest(`${process.env.REACT_APP_API}/about/update/info`, 'PATCH', 
                JSON.stringify({
                    greetings: formState.inputs.greetings.value,
                    textInfo: formState.inputs.textInfo.value,
                }),
                {
                    'Content-Type': 'application/json', 
                    Authorization: 'Bearer ' + auth.token
                }  
            )
            history.push('/about')
        }catch(e){}
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
                {!isLoading && about && <form onSubmit={aboutUpdateSubmitHanlder}>
                    <Input
                        id="greetings"
                        element="input"
                        type="text"
                        label="Update greetings"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a greeting"
                        onInput={inputHandler}
                        initialValue={about.greetings}
                        initialIsValid={true} />
                    <Input
                        id="textInfo"
                        rows="6"
                        type="text"
                        label="Update personal information"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a short info about you"
                        onInput={inputHandler}
                        initialValue={about.textInfo}
                        initialIsValid={true} />
                    <Button type="submit" disabled={!formState.isValid}>UPDATE INFO {isLoading && <Spinner />}</Button>
                </form>}
            </Card>
        </>
    )
}

export default UpdateAbout