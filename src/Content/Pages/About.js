import React, { useState, useEffect, useContext } from 'react'

import Image from '../../shared/UIElements/Image'
import Edit from '../../assets/edit_blue.svg'
import Remove from '../../assets/remove.svg'
import Add from '../../assets/add.svg'
import Button from '../../shared/FormElements/Button'
import Modal from '../../shared/UIElements/Modal'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttp } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/UIElements/ErrorModal'

import './About.css'

const About = () => {
    const auth = useContext(AuthContext)
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [data, setData] = useState()
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [id, setId] = useState(null)

    useEffect(() => {
        const getTitle = async () => {
            try {
                const response = await sendRequest(`${process.env.REACT_APP_API}/about`)
                
                setData(response.about)
            } catch (e) { }
        }
        getTitle()
    }, [sendRequest])


    const confirmDeleteHandler = async () => {
        try {
            await sendRequest(
                `${process.env.REACT_APP_API}/about/delete/hobbie/${id}`,
                'DELETE',
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,
                }
            )
            setData(prevState => {
                return {
                    ...prevState,
                    hobbies: prevState.hobbies.filter(hobbie => hobbie._id !== id)
                }
            })
            setShowConfirmModal(false)
        } catch (error) {}
    }

    const openConfirmModal = (id) => {
        setShowConfirmModal(true)
        setId(id)
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false)
    }

    return (
        <>
            <Modal
                center="text-center"
                show={showConfirmModal}
                onCancel={closeConfirmModal}
                header={'Do you want to delete this item?'}
                footer={
                    <div className="text-center">
                        <Button onClick={closeConfirmModal} inverse>Cancel</Button>
                        <Button onClick={confirmDeleteHandler} danger>Delete</Button>
                    </div>
                }
            />
            <ErrorModal error={error} onClear={clearError}/>
            <div className="text-white">
                <div className="AboutBanner"><h2>ABOUT ME</h2></div>

                <div className="Content p-20 mt-10">
                
                    <div>
                        <div className="mb-10">{auth.isLoggedIn && <Button to="/about/update/info"><Image src={Edit} width="20px" /></Button>}</div>
                        {!isLoading && data && <h3 className="mt-10">{data.greetings},</h3>}
                        {!isLoading && data && <p className="About_me_text mt-0">{data.textInfo}</p>}
                    </div>
                    <div>
                        <div className="Title">
                            <h2 className="">HOBBIES</h2>
                            {
                                auth.isLoggedIn && <div className="Add_new">
                                    <Button to='/about/add/hobbie'>
                                        <Image src={Add} width="20px" />
                                    </Button>
                                </div>
                            }
                        </div>

                        {!isLoading && data && <div className="Hobbies">
                            {
                                data.hobbies.map(hobbie => {
                                    return (
                                        <div key={hobbie.label + new Date()} className="Hobbie text-center">
                                            {
                                                auth.isLoggedIn && <div className="mb-10">
                                                    <Button onClick={() => openConfirmModal(hobbie._id)} padding="0" inverse>
                                                        <Image src={Remove} width="20px" />
                                                    </Button>
                                                    <Button to={`/about/update/hobbie/${hobbie._id}`}>
                                                        <Image src={Edit} width="20px" />
                                                    </Button>
                                                </div>
                                            }
                                            <Image src={hobbie.url} width='30px' alt={hobbie.label} />
                                            <p>{hobbie.label}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>}

                    </div>
                </div>
            </div>
        </>
    )
}

export default About