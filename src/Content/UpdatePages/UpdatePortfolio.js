import React, { useState, useEffect, useContext } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Card from '../../shared/UIElements/Card'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useForm } from '../../shared/hooks/form-hook'
import Spinner from '../../shared/UIElements/Spinner'
import ImageUpload from '../../shared/FormElements/ImageUpload'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttp } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/UIElements/ErrorModal'


const UpdatePortfolio = () => {
    const projectID = useParams().id
    const [data, setData] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()
    const { isLoading, error, sendRequest, clearError } = useHttp()

    const [formState, inputHandler, setFormData] = useForm({
        url: {
            value: '',
            isValid: false
        },
        label: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false)

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_API}/portfolio/portfolio/${projectID}`, 'GET', null, { Authorization: 'Bearer ' + auth.token })
                setData(responseData)

                setFormData({
                    url: {
                        value: responseData.url,
                        isValid: true
                    },
                    label: {
                        value: responseData.label,
                        isValid: true
                    },
                    image: {
                        value: responseData.image_url,
                        isValid: true
                    }
                }, true)

            } catch (error) { }
        }
        fetchPortfolio()
    }, [setFormData, sendRequest, auth.token, projectID])

    const portfolioSubmitHanlder = async (e) => {
        e.preventDefault()

        const formData = new FormData()

        formData.append('url', formState.inputs.url.value)
        formData.append('label', formState.inputs.label.value)
        formData.append('image', formState.inputs.image.value)

        try {
            await sendRequest(`${process.env.REACT_APP_API}/portfolio/update/portfolio/${projectID}`,
                'PATCH',
                formData,
                {
                    Authorization: 'Bearer ' + auth.token
                }
            )
            history.push('/portfolio')
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

            {!isLoading && !error && data && <Card margin="10px"> <form onSubmit={portfolioSubmitHanlder}>
                <Input
                    id="url"
                    element="input"
                    type="text"
                    label="Update URL"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter a URL"
                    onInput={inputHandler}
                    initialValue={data.url}
                    initialIsValid={true} />
                <Input
                    id="label"
                    element="input"
                    type="text"
                    label="Update Label"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter project name"
                    onInput={inputHandler}
                    initialValue={data.label}
                    initialIsValid={true} />

                <ImageUpload width="100%" image={data.image_url} id="image" onInput={inputHandler} center />

                <Button type="submit" disabled={!formState.isValid}>UPDATE INFO {isLoading && <Spinner />}</Button>
            </form>
            </Card>
            }
        </>
    )
}

export default UpdatePortfolio