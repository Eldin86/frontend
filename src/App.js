import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom'

import Slidemenu from './Aside/SlideMenu/SlideMenu'
import Content from './Content/Content'
import { AuthContext } from './shared/context/auth-context'

import './App.css';

let logoutTimer;

function App() {
  //Implementirati nakon ubacenog sadrzaja na applikaciju
  const [token, setToken] = useState(null)
  //Expiration time (date), changes everytime we login
  const [tokenExpiration, setTokenExpiration] = useState()
  const [isClosedNav, setIsClosedNav] = useState(false)

  const closeNavHandler = () => {
    setIsClosedNav(!isClosedNav)
  }
  //Nakon sto se logujemo proslijedimo token u handler i spremimo ga
  const login = useCallback((token, expirationDate) => {
    setToken(token)

    //1000 millisekundi, 60 sekundi, 60 minuta
    //Token expiration date je vrijeme 1h unaprijed
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)
    setTokenExpiration(tokenExpirationDate)
    localStorage.setItem('data', JSON.stringify({ token, expiration: tokenExpirationDate.toISOString() }))
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setTokenExpiration(null)
    localStorage.removeItem('data')
  }, [])

  //Autologout after 1h (after token expires)
  //On login set timer, on logout clear timer
  useEffect(() => {
    if (token && tokenExpiration) {
      //Time for how long is valid token, we get difference in miliseconds
      const remainingTime = tokenExpiration.getTime() - new Date().getTime()

      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      //If we have no token or tokenExpiration, clear timeout (clear al timers)
      clearTimeout(logoutTimer)
    }

  }, [token, logout, tokenExpiration])

  //Autologin if we have token and if future time is greates than now time
  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem('data'))

    //If expiration date is greater than now date
    //ako imamo token, i ako je buduce vrijeme vece od trenutnog proslijedi token i vrijeme preostalo u login
    if (storageData && storageData.token && new Date(storageData.expiration) > new Date()) {

      //Login sa tokenom i preostalim vremenom koliko vrijeti token
      login(storageData.token, new Date(storageData.expiration))
    }
  }, [login])

  return (
    <AuthContext.Provider value={{
      isLoggedIn: !!token,
      token: token,
      login: login,
      logout: logout
    }}>
      <Router>
        <div className="App">
          <Slidemenu isClosedNav={isClosedNav} closeNavHandler={closeNavHandler} />
          <Content isClosedNav={isClosedNav} />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
