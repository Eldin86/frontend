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
        level: {
            value: '',
            isValid: false
        },
        skillTitle: {
            value: '',
            isValid: false
        }
    }, false)


    const addExperienceSubmitHanlder = async event => {
        event.preventDefault()


        try {
            await sendRequest(`${process.env.REACT_APP_API}/resume/add/skill`, 'POST',
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
                <form onSubmit={addExperienceSubmitHanlder}>
                    <Input
                        id="level"
                        element="input"
                        type="text"
                        label="Add skill level"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter skill level"
                        onInput={inputHandler} />

                    <Input
                        id="skillTitle"
                        element="input"
                        type="text"
                        label="Add skill name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a skill name"
                        onInput={inputHandler} />

                    <Button type="submit" disabled={!formState.isValid}>ADD SKILL</Button>
                </form>
            </Card>
        </>
    )
}

export default UpdateHobbie