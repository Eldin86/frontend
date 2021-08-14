import { useState, useCallback, useRef, useEffect } from 'react'

export const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    //const [successMsg, setSuccessMsg] = useState()

    //In case we login and fast switch to another page, we will get error because we get data we don't have, so we want to prevent this
    const activeHttpRequests = useRef([])
    //useCallback to avoid infinite loop
    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
        setIsLoading(true)
        const httpAbortCtrl = new AbortController()
        activeHttpRequests.current.push(httpAbortCtrl)

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                //asign abort controller to request
                signal: httpAbortCtrl.signal
            })
            const responseData = await response.json()
            //Clear abort controller that belong to request which has completed 
            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== httpAbortCtrl.abort())
            //setRedirectTo(redirectTo)
            //setSuccessMsg(responseData.successMsg)

            //If status codes are 400... or 500.. throw new error
            if (!response.ok) {
                throw new Error(responseData.message)
            }

            setIsLoading(false)
            return responseData
        } catch (error) {
            setError(error.message)
            setIsLoading(false)
            throw error;
        }
    }, [])

    //Clear message
    const clearError = () => {
        setError(null)
    }

    //cancel request if we send request and meanwhile switch to another page
    //When leave component abort request before it has completed
    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort())
        }
    }, [])

    return {
        isLoading,
        error,
        //successMsg,
        sendRequest,
        clearError
    }
}