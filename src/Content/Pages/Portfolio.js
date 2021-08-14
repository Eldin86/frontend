import React, { useState, useEffect, useContext } from 'react'

import Image from '../../shared/UIElements/Image'
import Button from '../../shared/FormElements/Button'
import Edit from '../../assets/edit_blue.svg'
import Remove from '../../assets/remove.svg'
import Link from '../../assets/link.svg'
import Add from '../../assets/add.svg'
import Modal from '../../shared/UIElements/Modal'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttp } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/UIElements/ErrorModal'
import Placeholder from '../../assets/placeholder.png'

import './Portfolio.css'

const Portfolio = () => {
    const auth = useContext(AuthContext)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [data, setData] = useState()
    const [id, setId] = useState(null)

    useEffect(() => {
        const getPortfolio = async () => {
            try {
                const response = await sendRequest(`${process.env.REACT_APP_API}/portfolio`)
                setData(response.portfolio)
                
            } catch (e) { }
        }
        getPortfolio()
    }, [sendRequest])

    const confirmDeleteHandler = async () => {
       
        try {
            await sendRequest(
                `${process.env.REACT_APP_API}/portfolio/delete/portfolio/${id}`,
                'DELETE',
                null,
                {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token,
                    //"Content-type": "multipart/form-data",
                }
            )
            setShowConfirmModal(false)
            setData(prevState => prevState.filter(p => p._id !== id))
        } catch (error) { }
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
            <ErrorModal error={error} onClear={clearError} />
            <div className="text-white">
                <div className="PortfolioBanner"><h2>PORTFOLIO</h2></div>
                <div className="Content p-20 mt-10">
                    <div>
                        <div className="Title"><h2 className="text-center">MY WORK</h2>{auth.isLoggedIn && <div className="Add_new"> <Button to='portfolio/add/portfolio'><Image src={Add} width="20px" /></Button></div>}</div>

                        {!isLoading && data && <div className="Projects">
                            {
                                data.map(project => {
                                    return (
                                        <div key={project._id} className="Project text-center">
                                            {
                                                auth.isLoggedIn && <div className="mb-10 Buttons_wrapper mt-10">
                                                    <Button onClick={() => openConfirmModal(project._id)} padding="0" inverse>
                                                        <Image src={Remove} width="20px" />
                                                    </Button>
                                                    <Button to={`/portfolio/update/portfolio/${project._id}`}>
                                                        <Image src={Edit} width="20px" />
                                                    </Button>
                                                </div>
                                            }
                                            <div className="Project_content_wrapper">
                                                <div className="Project_wrapper">
                                                    <Image src={project.image_url ? project.image_url : Placeholder} alt={project.label} />
                                                </div>
                                                <Button href={project.url}>
                                                    <div className="Url_wrapper">
                                                        <div><h3><span className="text-white">{project.label}</span></h3></div>
                                                        <div> <Image src={Link} width='20px' /></div>
                                                    </div>
                                                </Button>
                                            </div>

                                        </div>
                                    )
                                })
                            }
                        </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Portfolio