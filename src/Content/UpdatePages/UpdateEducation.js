import React, { useState, useContext, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import Card from '../../shared/UIElements/Card'
import Input from '../../shared/FormElements/Input'
import Button from '../../shared/FormElements/Button'
import { VALIDATOR_REQUIRE } from '../../shared/utils/validators'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttp } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import Spinner from '../../shared/UIElements/Spinner'
import ErrorModal from '../../shared/UIElements/ErrorModal'

const DUMMY_EDUCATIONS = [
    {
        id: '01',
        from: 'October 2016',
        to: 'December 2016',
        institution: 'Kulturni Centar Kralj Fahd',
        description: 'Wordpress'
    },
    {
        id: '02',
        from: 'April 2016',
        to: 'October 2016',
        institution: 'Nsoft (Spark School)',
        description: 'HTML, CSS, Javascript, Git'
    },
    {
        id: '03',
        from: 'March 2016 ',
        to: 'May 2016',
        institution: 'Kulturni Centar Kralj Fahd',
        description: 'HTML, CSS'
    },
    {
        id: '04',
        from: 'October 2017',
        to: 'December 2017',
        institution: 'Kulturni Centar Kralj Fahd',
        description: 'Illustrator'
    },
    {
        id: '05',
        from: 'March 2017',
        to: 'May 2017',
        institution: 'Kulturni Centar Kralj Fahd',
        description: 'Photoshop'
    },
    {
        id: '06',
        from: '',
        to: 'Present',
        institution: 'GOOGLE IS MY FRIEND',
        description: ''
    }
]

const UpdateEducation = () => {
    const educationID = useParams().id
    const [data, setData] = useState()
    const auth = useContext(AuthContext)
    const history = useHistory()
    const { isLoading, error, sendRequest, clearError } = useHttp()

    const selectedEducation = DUMMY_EDUCATIONS.find(education => education.id === educationID)

    //Uzmemo metode koje vraca hook. a proslijedimo inicijalni state koji ocekuje
    const [formState, inputHandler, setFormData] = useForm({
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

    useEffect(() => {
        const fetchEducation = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_API}/resume/education/${educationID}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token,
                    })
                setData(responseData)
                setFormData({
                    from: {
                        value: responseData.from,
                        isValid: true
                    },
                    to: {
                        value: responseData.to,
                        isValid: true
                    },
                    institution: {
                        value: responseData.institution,
                        isValid: true
                    },
                    description: {
                        value: responseData.description,
                        isValid: true
                    }
                }, true)
            } catch (e) { }
        }
        fetchEducation()

    }, [setFormData, selectedEducation, educationID, sendRequest, auth])

    const educationSubmitHanlder = async event => {
        event.preventDefault()
        
        try{
            await sendRequest(`${process.env.REACT_APP_API}/resume/update/education/${educationID}`, 'PATCH', 
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
            {!isLoading && data && <form onSubmit={educationSubmitHanlder}>
                <Input
                    id="from"
                    element="input"
                    type="text"
                    label="Update start period"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter starting month and year"
                    onInput={inputHandler}
                    initialValue={data.from}
                    initialIsValid={true} />

                <Input
                    id="to"
                    element="input"
                    type="text"
                    label="Update end period"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter ending month and year"
                    onInput={inputHandler}
                    initialValue={data.to}
                    initialIsValid={true} />

                <Input
                    id="institution"
                    element="input"
                    type="text"
                    label="Update institution"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter name of institution"
                    onInput={inputHandler}
                    initialValue={data.institution}
                    initialIsValid={true} />

                <Input
                    id="description"
                    element="textarea"
                    type="text"
                    label="Update description"
                    validators={[VALIDATOR_REQUIRE()]}
                    errorText="Please enter description"
                    onInput={inputHandler}
                    initialValue={data.description}
                    initialIsValid={true} />

                <Button type="submit" disabled={!formState.isValid}>UPDATE INFO {isLoading && <Spinner />}</Button>
            </form>}
        </Card>
        </>
    )
}

export default UpdateEducation