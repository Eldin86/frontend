import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'

import Card from '../../shared/UIElements/Card'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useForm } from '../../shared/hooks/form-hook'
import Spinner from '../../shared/UIElements/Spinner'
import ImageUpload from '../../shared/FormElements/ImageUpload'
import { useHttp } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import ErrorModal from '../../shared/UIElements/ErrorModal'

const UpdateHobbie = () => {
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const auth = useContext(AuthContext)
    const history = useHistory()

    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler] = useForm({
        name: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false)


    const skillSubmitHanlder = async event => {
        event.preventDefault()
        const formData = new FormData()
        formData.append('label', formState.inputs.name.value)
        formData.append('image', formState.inputs.image.value)

        try {
            await sendRequest(`${process.env.REACT_APP_API}/resume/add/technologie`,
                'POST',
                formData,
                {
                    //'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,
                    //"Content-type": "multipart/form-data",
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
                <form onSubmit={skillSubmitHanlder}>
                    <Input
                        id="name"
                        element="input"
                        type="text"
                        label="Add name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter name"
                        onInput={inputHandler} />
                    {/* Image sent from object */}
                    <ImageUpload width="60%" id="image" onInput={inputHandler} center />

                    <Button type="submit" disabled={!formState.isValid}>ADD SKILL</Button>
                </form>
            </Card>
        </>
    )
}

export default UpdateHobbie