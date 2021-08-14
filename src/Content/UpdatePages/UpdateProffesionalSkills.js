import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

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

const UpdateProffesionalSkills = () => {
    const skillID = useParams().id
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [data, setData] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()

    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler, setFormData] = useForm({
        label: {
            value: '',
            isValid: false
        },
        icon: {
            value: null,
            isValid: false
        }
    }, false)

    useEffect(() => {
        const getSkill = async () => {
            try {
                const response = await sendRequest(`${process.env.REACT_APP_API}/resume/technologie/${skillID}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token,
                    })
                setData(response)

                setFormData({
                    label: {
                        value: response.label,
                        isValid: true
                    },
                    icon: {
                        value: response.image_url,
                        isValid: true
                    }
                }, true)
            } catch (e) { }
        }
        getSkill()
    }, [setFormData, skillID, auth, sendRequest])

    const skillSubmitHanlder = async event => {
        event.preventDefault()

        const formData = new FormData()
        formData.append('label', formState.inputs.label.value)
        formData.append('image', formState.inputs.icon.value)

        try {
            await sendRequest(`${process.env.REACT_APP_API}/resume/update/technologie/${skillID}`,
                'PATCH',
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
                {
                    !isLoading && data && <form onSubmit={skillSubmitHanlder}>

                        <Input
                            id="label"
                            element="input"
                            type="text"
                            label="Update technologie name"
                            validators={[VALIDATOR_REQUIRE()]}
                            errorText="Please enter technologie name"
                            onInput={inputHandler}
                            initialValue={data.label}
                            initialIsValid={true} />

                        <ImageUpload width="60%" image={data.image_url} id="icon" onInput={inputHandler} center />

                        <Button type="submit" disabled={!formState.isValid}>UPDATE INFO {isLoading && <Spinner />}</Button>
                    </form>
                }
            </Card>
        </>
    )
}

export default UpdateProffesionalSkills