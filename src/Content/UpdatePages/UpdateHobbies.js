import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Card from '../../shared/UIElements/Card'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttp } from '../../shared/hooks/http-hook'
import Spinner from '../../shared/UIElements/Spinner'
import ImageUpload from '../../shared/FormElements/ImageUpload'
import { AuthContext } from '../../shared/context/auth-context'
import ErrorModal from '../../shared/UIElements/ErrorModal'

const UpdateHobbie = () => {
    //const [isLoading, setIsLoading] = useState(true)
    const hobbieID = useParams().id
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [data, setData] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()

    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler, setFormData] = useForm({
        hobbie: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false)

    useEffect(() => {
        const getHobbie = async () => {
            try {
                const response = await sendRequest(`${process.env.REACT_APP_API}/about/hobbie/${hobbieID}`,
                    'GET',
                    null, {
                    Authorization: 'Bearer ' + auth.token,
                })
                setData(response)

                setFormData({
                    hobbie: {
                        value: response.label,
                        isValid: true
                    },
                    image: {
                        value: response.image_url,
                        isValid: true
                    }
                }, true)
            } catch (e) { }
        }
        getHobbie()

    }, [setFormData, hobbieID, auth.token, sendRequest])



    const hobbieSubmitHanlder = async event => {
        event.preventDefault()

        const formData = new FormData()
        formData.append('label', formState.inputs.hobbie.value)
        formData.append('image', formState.inputs.image.value)

        try {
            await sendRequest(`${process.env.REACT_APP_API}/about/update/hobbie/${hobbieID}`,
                'PATCH',
                formData,
                {
                    //'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,
                    //"Content-type": "multipart/form-data",
                }
            )
            history.push('/about')
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

            {!isLoading && !error && data && <Card margin="10px"> <form onSubmit={hobbieSubmitHanlder}>
                <Input
                    id="hobbie"
                    element="input"
                    type="text"
                    label="Update hobbie"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a hobbie"
                    onInput={inputHandler}
                    initialValue={data.label}
                    initialIsValid={true} />
                {/* Image sent from object */}
                <ImageUpload width="60%" image={data.url} id="image" onInput={inputHandler} center />

                <Button type="submit" disabled={!formState.isValid}>UPDATE INFO {isLoading && <Spinner />}</Button>
            </form>

            </Card>}
        </>
    )
}

export default UpdateHobbie