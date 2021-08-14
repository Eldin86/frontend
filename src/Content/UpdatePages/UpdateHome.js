import React, { useState, useEffect, useContext } from 'react'
import {useHistory} from 'react-router-dom'

import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttp } from '../../shared/hooks/http-hook'
import Card from '../../shared/UIElements/Card'
import Spinner from '../../shared/UIElements/Spinner'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import {AuthContext} from '../../shared/context/auth-context'

const UpdateTitle = (props) => {
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [title, setTitle] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()


    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        }
    }, false)

    useEffect(() => {
        const fetchTitle = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_API}`, 'GET', null, { Authorization: 'Bearer ' + auth.token })
                setTitle(responseData.home)

                setFormData({
                    title: {
                        value: responseData.home.title,
                        isValid: true
                    }
                }, true)
            } catch (e) { }
        }
        fetchTitle()
    }, [sendRequest, setFormData, history, auth.token])

    const homeUpdateSubmitHanlder = async event => {
        event.preventDefault()
        try {
            await sendRequest(`${process.env.REACT_APP_API}/update`, 'PATCH',
                JSON.stringify({
                    title: formState.inputs.title.value
                }),
                {
                    'Content-Type': 'application/json', 
                    Authorization: 'Bearer ' + auth.token
                }
            )
            history.push('/')
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
           
            <Card>
                {!isLoading && title && <form onSubmit={homeUpdateSubmitHanlder}>
                    <h3>Update {formState.inputs.title.value}</h3>
                    <Input
                        id="title"
                        element="input"
                        type="text"
                        label="Title"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a valid title"
                        onInput={inputHandler}
                        initialValue={title.title}
                        initialIsValid={true} />
                    <Button type="submit" disabled={!formState.isValid}>UPDATE TITLE</Button>
                </form>
                }
            </Card>
        </>
    )
}

export default UpdateTitle