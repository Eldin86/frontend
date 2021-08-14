import React, { useState, useEffect, useContext } from 'react'

import Image from '../../shared/UIElements/Image'
import Email from '../../assets/email.svg'
import Location from '../../assets/pin.svg'
import Phone from '../../assets/phone.svg'
import Edit from '../../assets/edit_blue.svg'
import { useForm } from '../../shared/hooks/form-hook'
import Button from '../../shared/FormElements/Button'
import Spinner from '../../shared/UIElements/Spinner'
import { AuthContext } from '../../shared/context/auth-context'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import { useHttp } from '../../shared/hooks/http-hook'

import './Contact.css'
import Input from '../../shared/FormElements/Input'
import { VALIDATOR_EMAIL, VALIDATOR_REQUIRE } from '../../shared/utils/validators'


const Contact = () => {
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [data, setData] = useState()
    const [success, setSuccess] = useState('')

    const [formState, inputHandler] = useForm({
        name: {
            value: '',
            isValid: false,
        },
        email: {
            value: '',
            isValid: false
        },
        message: {
            value: '',
            isValid: false
        }
    }, false)

    useEffect(() => {
        const getContact = async () => {
            try {
                const response = await sendRequest(`${process.env.REACT_APP_API}/contact`)
                setData(response)
            } catch (e) { }
        }
        getContact()
    }, [sendRequest])

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        try {
            const responseData = await sendRequest(`${process.env.REACT_APP_API}/contact`,
                'POST',
                JSON.stringify({
                    name: formState.inputs.name.value,
                    email: formState.inputs.email.value,
                    message: formState.inputs.message.value,
                }),
                {
                    //Content type koristimo samo kad zelimo nesto da posaljemo, odnosno kad attachiramo neke data na odlazeci request
                    'Content-Type': 'application/json'
                }
            )
            setSuccess(responseData.success)
        } catch (e) {

        }
    }

    return (
        <div className="text-white">
            <div className="ContactBanner"><h2>CONTACT</h2></div>
            <div className="Content p-20 mt-10">
                <h2>CONTACT INFORMATION</h2>
                <ErrorModal error={error} onClear={clearError}/>
                {/* Maybe error is shown after fetching data from server because !isLoading is removed */}
                {data && <>
                    {
                        auth.isLoggedIn && <div className="mb-10 Buttons_wrapper">
                            <Button to={`/contact/update/contact`}>
                                <Image src={Edit} width="20px" />
                            </Button>
                        </div>
                    }
                    <div className="Contact_info">
                        <div className="Email text-center mb-10">
                            <Image src={Email} width="35px" />
                            <h4 className="Contact_label m-0 p-20">{data.email}</h4>
                        </div>

                        <div className="Phone text-center mb-10">
                            <Image src={Phone} width="35px" />
                            <h4 className="Contact_label m-0 p-20">{data.phone}</h4>
                        </div>

                        <div className="Location text-center mb-10">
                            <Image src={Location} width="35px" />
                            <h4 className="Contact_label m-0 p-20">{data.location}</h4>
                        </div>
                    </div>
                </>}

                <h3 className="text-center">CONTACT ME</h3>
                <div className="Contact_form">
                    <form onSubmit={onSubmitHandler}>
                        <div className="Email_name">
                            <Input
                                id="name"
                                element="input"
                                name="name"
                                type="text"
                                placeholder="Name"
                                errorText="Please enter your name"
                                onInput={inputHandler}
                                validators={[VALIDATOR_REQUIRE()]}
                                initialValue={formState.inputs.name.value} />
                            <Input
                                id="email"
                                element="input"
                                name="email"
                                type="text"
                                placeholder="Email"
                                errorText="Please enter your Email"
                                onInput={inputHandler}
                                validators={[VALIDATOR_EMAIL()]}
                                initialIsValid={formState.inputs.email.isValid} />
                        </div>
                        <div>
                            <Input
                                id="message"
                                rows="6"
                                type="text"
                                name="message"
                                placeholder="Message"
                                validators={[VALIDATOR_REQUIRE()]}
                                errorText="Please enter your message"
                                onInput={inputHandler}
                                initialIsValid={formState.inputs.message.isValid} />
                        </div>

                        <div>
                            {success && <h4 style={{color: "#93DC80", margin: "0.5rem 0"}}>Message sent successufuly</h4>}
                            <Button type="submit" disabled={!formState.isValid}>SEND {isLoading && <Spinner />}</Button>
                        </div>
                    </form>
                </div>
            </div>

        </div>

    )
}

export default Contact