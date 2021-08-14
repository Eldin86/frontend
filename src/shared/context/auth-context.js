import { createContext } from 'react'

export const AuthContext = createContext({
    isLoggedIn: false,
    //provjeriti da li treba admin Id
    token: null,
    login: () => { },
    logout: () => { }
})