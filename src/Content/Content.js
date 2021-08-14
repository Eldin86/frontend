import React, { useContext } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { AuthContext } from '../shared/context/auth-context'

import Home from './Pages/Home'
import About from './Pages/About'
import Portfolio from './Pages/Portfolio'
import Resume from './Pages/Resume'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Recover from './Pages/Recover'
import Reset from './Pages/Reset'
/* Update pages */
import UpdateHome from './UpdatePages/UpdateHome'
import UpdateAboutInfo from './UpdatePages/UpdateAboutInfo'
import UpdateHobbies from './UpdatePages/UpdateHobbies'
import UpdatePortfolio from './UpdatePages/UpdatePortfolio'
import UpdateEducation from './UpdatePages/UpdateEducation'
import UpdateExperience from './UpdatePages/UpdateExperience'
import UpdateProffesionalSkills from './UpdatePages/UpdateProffesionalSkills'
import UpdatePersonalSkills from './UpdatePages/UpdatePersonalSkills'
import UpdateContact from './UpdatePages/UpdateContact'
import './Content.css'
import AddHobbie from './addPages/AddHobbie'
import AddPortfolio from './addPages/AddPortfolio'
import AddEducation from './addPages/AddEducation'
import AddExperience from './addPages/AddExperience'
import AddProffesionalSkill from './addPages/AddProffesionalSkill'
import AddPersonalSkill from './addPages/AddPersonalSkill'

/* Dovde */
const Content = (props) => {
    const auth = useContext(AuthContext)

    let routes
    routes = (
        <Switch>
            {/* Homepage */}
            <Route exact path="/">
                <Home />
            </Route>
            {/* About page */}
            <Route exact path="/about">
                <About />
            </Route>
            {/* Portfolio page */}
            <Route exact path="/portfolio">
                <Portfolio />
            </Route>
            {/* Resume page */}
            <Route exact path="/resume">
                <Resume />
            </Route>
            {/* Contact page */}
            <Route exact path="/contact">
                <Contact />
            </Route>
            {/* Login page */}
            <Route path="/login">
                <Login />
            </Route>
            <Route path="/signup">
                <Signup />
            </Route>
            <Route path="/recover">
                <Recover />
            </Route>

            <Route path="/reset-password/secret">
                <Reset />
            </Route>

            <Redirect to="/" />

        </Switch>
    )
        //Only if we are registered show all admin routes
    if (auth.token) {
        routes = (
            <Switch>
                {/* Homepage */}
                <Route exact path="/">
                    <Home />
                </Route>
                {/* Update Title from Homepage */}
                <Route path="/update/title">
                    <UpdateHome />
                </Route>

                {/* About page */}
                <Route exact path="/about">
                    <About />
                </Route>
                <Route path="/about/update/info">
                    <UpdateAboutInfo />
                </Route>
                <Route path="/about/update/hobbie/:id">
                    <UpdateHobbies />
                </Route>
                <Route path="/about/add/hobbie">
                    <AddHobbie />
                </Route>

                {/* Portfolio page */}
                <Route exact path="/portfolio">
                    <Portfolio />
                </Route>
                <Route path="/portfolio/update/portfolio/:id">
                    <UpdatePortfolio />
                </Route>
                <Route path="/portfolio/add/portfolio">
                    <AddPortfolio />
                </Route>

                {/* Resume page */}
                <Route exact path="/resume">
                    <Resume />
                </Route>
                <Route path="/resume/update/education/:id">
                    <UpdateEducation />
                </Route>

                <Route path="/resume/update/experience/:id">
                    <UpdateExperience />
                </Route>
                <Route path="/resume/add/experience">
                    <AddExperience />
                </Route>
                <Route path="/resume/update/professional-skills/:id">
                    <UpdateProffesionalSkills />
                </Route>
                <Route path="/resume/add/professional-skill">
                    <AddProffesionalSkill />
                </Route>
                <Route path="/resume/update/personal-skills/:id">
                    <UpdatePersonalSkills />
                </Route>
                <Route path="/resume/add/personal-skill">
                    <AddPersonalSkill />
                </Route>
                <Route path="/resume/add/education">
                    <AddEducation />
                </Route>

                {/* Contact page */}
                <Route exact path="/contact">
                    <Contact />
                </Route>
                <Route path="/contact/update/contact">
                    <UpdateContact />
                </Route>

                {/* Login page */}
                {/* <Route path="/login">
                    <Login />
                </Route>

                <Route path="/signup">
                    <Signup />
                </Route>
                <Route path="/recover">
                    <Recover />
                </Route> */}

                <Redirect to="/" />
            </Switch>
        )
    }

    return (
        <div className={`ContentContainer ${props.isClosedNav ? 'Contentopen' : 'Contentclose'}`}>
            <Switch>
                {routes}
            </Switch>
        </div>
    )
}

export default Content