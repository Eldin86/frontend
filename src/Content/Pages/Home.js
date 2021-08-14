import React, { useState, useEffect, useContext } from 'react'
import ReactTypingEffect from 'react-typing-effect';

import Button from '../../shared/FormElements/Button'
import Image from '../../shared/UIElements/Image'
import Edit from '../../assets/edit_blue.svg'
import Spinner from '../../shared/UIElements/Spinner'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttp } from '../../shared/hooks/http-hook'

import './Home.css'

const Home = () => {
    const auth = useContext(AuthContext)
    const [data, setData] = useState()
    const { isLoading, error, sendRequest, clearError} = useHttp()

    useEffect(() => {
        const getTitle = async () => {
            try {
                const response = await sendRequest(`${process.env.REACT_APP_API}`)
                setData(response)
            } catch (e) {}
        }
        getTitle()
    }, [sendRequest])
   
    return (
        <div className="Home">
           <ErrorModal error={error} onClear={clearError}/>
            <h3 className="text-white ml-10 mt-3 mb-3">HI,</h3>
            <h1 className="text-white ml-10 mt-3 mb-3">I AM ELDIN MASLEŠA</h1>
            <div className="ml-10">{auth.isLoggedIn && <Button to="/update/title"><Image src={Edit} width="20px" /></Button>}</div>
            <h3 className="text-white ml-10 mt-3 mb-3">
                {isLoading && <Spinner />}
                {/* If not loading and if we have data render title */}
                {!isLoading && data && <ReactTypingEffect eraseDelay={500000} text={data.home.title} />}
            </h3>

        </div>
    )
}

export default Home