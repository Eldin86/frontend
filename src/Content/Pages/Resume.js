import React, { useState, useContext, useEffect } from 'react'

import Button from '../../shared/FormElements/Button'
import Image from '../../shared/UIElements/Image'
import Edit from '../../assets/edit_blue.svg'
import Remove from '../../assets/remove.svg'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import Add from '../../assets/add.svg'
import Modal from '../../shared/UIElements/Modal'
import { AuthContext } from '../../shared/context/auth-context'
import { useHttp } from '../../shared/hooks/http-hook'
import ErrorModal from '../../shared/UIElements/ErrorModal'

import './Resume.css'
import 'react-circular-progressbar/dist/styles.css';

const Resume = () => {
    const auth = useContext(AuthContext)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const { isLoading, error, sendRequest, clearError } = useHttp()
    const [data, setData] = useState()
    const [deleteData, setdeleteData] = useState({ id: null, value: '' })

    useEffect(() => {
        const getResume = async () => {
            try {
                const response = await sendRequest(`${process.env.REACT_APP_API}/resume`)
                
                setData(response)
            } catch (e) { }
        }
        getResume()
    }, [sendRequest, error])

    const confirmDeleteHandler = async () => {
        switch (deleteData.value) {
            case 'education':
                try {
                    await sendRequest(
                        `${process.env.REACT_APP_API}/resume/delete/education/${deleteData.id}`,
                        'DELETE',
                        null,
                        {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + auth.token,
                            //"Content-type": "multipart/form-data",
                        }
                    )
                    setShowConfirmModal(false)
                    setData(prevState => {
                        return {
                            ...prevState,
                            educations: prevState.educations.filter(edu => edu._id !== deleteData.id)
                        }
                    })
                } catch (error) { }
                break;

            case 'experience':
                try {
                    await sendRequest(
                        `${process.env.REACT_APP_API}/resume/delete/experience/${deleteData.id}`,
                        'DELETE',
                        null,
                        {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + auth.token,
                            //"Content-type": "multipart/form-data",
                        }
                    )
                    setShowConfirmModal(false)
                    setData(prevState => {
                        return {
                            ...prevState,
                            experiences: prevState.experiences.filter(exp => exp._id !== deleteData.id)
                        }
                    })
                } catch (error) { }
                break;

            case 'technologie':
                try {
                    await sendRequest(
                        `${process.env.REACT_APP_API}/resume/delete/technologie/${deleteData.id}`,
                        'DELETE',
                        null,
                        {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + auth.token,
                            //"Content-type": "multipart/form-data",
                        }
                    )
                    setShowConfirmModal(false)
                    setData(prevState => {
                        return {
                            ...prevState,
                            technologies: prevState.technologies.filter(tech => tech._id !== deleteData.id)
                        }
                    })
                } catch (error) { }
                break;

            case 'skill':
                try {
                    await sendRequest(
                        `${process.env.REACT_APP_API}/resume/delete/skill/${deleteData.id}`,
                        'DELETE',
                        null,
                        {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + auth.token,
                            //"Content-type": "multipart/form-data",
                        }
                    )
                    setShowConfirmModal(false)
                    setData(prevState => {
                        return {
                            ...prevState,
                            personalSkills: prevState.personalSkills.filter(skill => skill._id !== deleteData.id)
                        }
                    })
                } catch (error) { }
                break;

            default:
                break;
        }
    }

    const openConfirmModal = (id, value) => {
        setShowConfirmModal(true)
        setdeleteData(prevState => {
            return {
                ...prevState,
                id,
                value
            }
        })
    }

    const closeConfirmModal = () => {
        setShowConfirmModal(false)
    }

    return (
        <>
            <ErrorModal error={error} onClear={clearError} />
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
            <div className="text-white">
                <div className="ResumeBanner"><h2>RESUME</h2></div>

                <div className="Content p-20 mt-10">
                    <div className="Title"><h2 className="text-center">EDUCATION</h2>{auth.isLoggedIn && <div className="Add_new"> <Button to='/resume/add/education'><Image src={Add} width="20px" /></Button></div>}</div>
                    {!isLoading && data && <div className="Educations">
                        {data.educations.map(education => {
                            return (
                                <div key={education._id} className="Education">
                                    {
                                        auth.isLoggedIn && <div className="mb-0 Buttons_wrapper">
                                            <Button onClick={() => openConfirmModal(education._id, 'education')} padding="0" inverse>
                                                <Image src={Remove} width="20px" />
                                            </Button>
                                            <Button to={`/resume/update/education/${education._id}`}>
                                                <Image src={Edit} width="20px" />
                                            </Button>
                                        </div>
                                    }
                                    <div className="Education_content_wrapper">
                                        <p className="fromTo pt-5 pb-5 pl-10 pr-10" ><small>{education.from} - {education.to}</small></p>
                                        <div className="desc pt-5 pb-5 pl-10 pr-10">
                                            <h4 className="m-5">{education.institution}</h4>
                                            <p className="m-5"><b>{education.description}</b></p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </div>}
                    <div className="Title"><h2 className="text-center">EXPERIENCE</h2>{auth.isLoggedIn && <div className="Add_new"> <Button to='/resume/add/experience'><Image src={Add} width="20px" /></Button></div>}</div>
                    {!isLoading && data && <div className="Experiences">
                        {
                            data.experiences.map(experience => {
                                return (
                                    <div key={experience._id} className="Experience">

                                        {
                                            auth.isLoggedIn && <div className="mb-0 Buttons_wrapper">
                                                <Button onClick={() => openConfirmModal(experience._id, 'experience')} padding="0" inverse>
                                                    <Image src={Remove} width="20px" />
                                                </Button>
                                                <Button to={`/resume/update/experience/${experience._id}`}>
                                                    <Image src={Edit} width="20px" />
                                                </Button>
                                            </div>
                                        }
                                        <div className="Experiences_content_wrapper">
                                            <p className="fromTo pt-5 pb-5 pl-10 pr-10" ><small>{experience.from} - {experience.to}</small></p>
                                            <div className="desc pt-5 pb-5 pl-10 pr-10">
                                                <h4 className="m-5">{experience.company}</h4>
                                                <p className="m-5"><b>{experience.position}</b></p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>}
                    <div className="Title"><h2 className="text-center">PROFESSIONAL SKILLS</h2>{auth.isLoggedIn && <div className="Add_new"> <Button to='/resume/add/professional-skill'><Image src={Add} width="20px" /></Button></div>}</div>
                    {!isLoading && data && <div className="Proffesional_skills">
                        {
                            data.technologies.map(technologie => {
                                return (
                                    <div key={technologie._id} className="Proffesional_skill text-center">
                                        {
                                            auth.isLoggedIn && <div className="mb-0 Buttons_wrapper">
                                                <Button onClick={() => openConfirmModal(technologie._id, 'technologie')} padding="0" inverse>
                                                    <Image src={Remove} width="20px" />
                                                </Button>
                                                <Button to={`/resume/update/professional-skills/${technologie._id}`}>
                                                    <Image src={Edit} width="20px" />
                                                </Button>
                                            </div>
                                        }
                                        <div className="Proff_skill_content_wrapper">
                                            <div className="desc pt-5 pb-5">
                                                <Image width="40px" src={technologie.image_url} />
                                                <p><b>{technologie.label}</b></p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>}
                    <div className="Title"><h2 className="text-center">PERSONAL SKILLS</h2>{auth.isLoggedIn && <div className="Add_new"> <Button to='/resume/add/personal-skill'><Image src={Add} width="20px" /></Button></div>}</div>
                    {!isLoading && data && <div className="Personal_skills">
                        {
                            data.personalSkills.map(personal_skill => {
                                return (
                                    <div key={personal_skill._id} className="Personal_skill text-center">

                                        {
                                            auth.isLoggedIn && <div className="mb-10 Buttons_wrapper">
                                                <Button onClick={() => openConfirmModal(personal_skill._id, 'skill')} padding="0" inverse>
                                                    <Image src={Remove} width="20px" />
                                                </Button>
                                                <Button to={`/resume/update/personal-skills/${personal_skill._id}`}>
                                                    <Image src={Edit} width="20px" />
                                                </Button>
                                            </div>
                                        }
                                        <div className="Personal_skill_content_wrapper">
                                            <CircularProgressbarWithChildren className="CircularProgress" text={`${personal_skill.level}%`} strokeWidth="4" value={personal_skill.level} />
                                            <p>{personal_skill.skillTitle}</p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>}
                </div>
            </div>
        </>
    )
}

export default Resume