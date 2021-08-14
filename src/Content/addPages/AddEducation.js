import React, { useContext } from 'react'
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


const UpdateHobbie = () => {
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const auth = useContext(AuthContext)
    const history = useHistory()

    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler] = useForm({
        from: {
            value: '',
            isValid: false
        },
        to: {
            value: '',
            isValid: false
        },
        institution: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false)


    const addEducationSubmitHanlder = async event => {
        event.preventDefault()

        try {
            await sendRequest(`${process.env.REACT_APP_API}/resume/add/education`, 'POST',
                JSON.stringify({
                    description: formState.inputs.description.value,
                    from: formState.inputs.from.value,
                    institution: formState.inputs.institution.value,
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
            <Card margin="10px">
                <form onSubmit={addEducationSubmitHanlder}>
                    <Input
                        id="from"
                        element="input"
                        type="text"
                        label="Add start date"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a starting date"
                        onInput={inputHandler} />

                    <Input
                        id="to"
                        element="input"
                        type="text"
                        label="Add end date"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a ending date"
                        onInput={inputHandler} />

                    <Input
                        id="institution"
                        element="input"
                        type="text"
                        label="Add institution"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter institution"
                        onInput={inputHandler} />

                    <Input
                        id="description"
                        element="input"
                        type="text"
                        label="Add description"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter description"
                        onInput={inputHandler} />

                    <Button type="submit" disabled={!formState.isValid}>ADD EDUCATION</Button>
                </form>
            </Card>
        </>
    )
}

export default UpdateHobbie