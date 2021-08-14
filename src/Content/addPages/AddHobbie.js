import React, { useContext } from 'react'

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

    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler] = useForm({
        hobbie: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false)


    const addHobbieSubmitHanlder = async event => {
        event.preventDefault()

        const formData = new FormData()
        formData.append('label', formState.inputs.hobbie.value)
        formData.append('image', formState.inputs.image.value)

        try {
            await sendRequest(`${process.env.REACT_APP_API}/about/add/hobbie`,
                'POST',
                formData,
                {
                    //'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,
                    //"Content-type": "multipart/form-data",
                }
            )
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
            <Card margin="10px">
                <form onSubmit={addHobbieSubmitHanlder}>
                    <Input
                        id="hobbie"
                        element="input"
                        type="text"
                        label="Add hobbie"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a hobbie"
                        onInput={inputHandler} />
                    {/* Image sent from object */}
                    <ImageUpload width="60%" id="image" errorText="Please provide an image" onInput={inputHandler} center />

                    <Button type="submit" disabled={!formState.isValid}>ADD HOBBIE</Button>
                </form>
            </Card>
        </>
    )
}

export default UpdateHobbie