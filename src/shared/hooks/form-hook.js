import { useCallback, useReducer } from 'react'

const formReducer = (state, action) => {
    switch (action.type) {
        case 'INPUT_CHANGE':
            let formIsValid = true
            for (let inputId in state.inputs) {
                //Ako nemamo odredjenog ID samo nastavi dalje!
                if(!state.inputs[inputId]){
                    continue
                }
                if (inputId === action.inputId) {
                    formIsValid = formIsValid && action.isValid
                } else {
                    formIsValid = formIsValid && state.inputs[inputId].isValid
                }
            }
            return {
                ...state,
                inputs: {
                    ...state.inputs,
                    [action.inputId]: {
                        value: action.value,
                        isValid: action.isValid
                    }
                },
                isValid: formIsValid
            }
        case 'SET_DATA':
            return   {
                inputs: action.inputs,
                isValid: action.formIsValid
            }
        default:
            return state
    }
}
export const useForm = (initialInputs, initialFormValidity) => {
    //formState je state koji smo proslijedili u useReducer
    //dispatch koristimo da updateujemo state, odnosno poziva formReducer
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid: initialFormValidity
    })

    const inputHandler = useCallback((id, value, isValid) => {
        dispatch({
            type: 'INPUT_CHANGE',
            value: value,
            isValid: isValid,
            inputId: id
        })
    }, [])

    const setFormData = useCallback((inputdata, formValidity) => {
        dispatch({
            type: 'SET_DATA',
            //inputs objekti sa value i isValid vrijednostima
            inputs: inputdata,
            //true or false
            formIsValid: formValidity
        })
    }, [])

    return [formState, inputHandler, setFormData]
}